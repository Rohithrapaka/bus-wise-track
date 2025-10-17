-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'driver', 'incharge');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policy for user_roles - users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS policy for user_roles - incharge can view all roles
CREATE POLICY "Incharge can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'incharge'));

-- Remove role column from profiles table (if exists)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Create trigger to automatically create user_role on profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert default student role for new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();

-- Add driver_id column to bus_routes for driver assignment
ALTER TABLE public.bus_routes ADD COLUMN IF NOT EXISTS driver_id UUID REFERENCES auth.users(id);

-- RLS policy for bus_routes - drivers can update their own buses
CREATE POLICY "Drivers can update their assigned buses"
ON public.bus_routes
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'driver') AND driver_id = auth.uid()
)
WITH CHECK (
  public.has_role(auth.uid(), 'driver') AND driver_id = auth.uid()
);

-- RLS policy for bus_routes - incharge can manage all buses
CREATE POLICY "Incharge can manage all buses"
ON public.bus_routes
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'incharge'))
WITH CHECK (public.has_role(auth.uid(), 'incharge'));