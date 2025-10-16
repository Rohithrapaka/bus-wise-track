-- Create profiles table for student information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'student',
  assigned_bus_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create bus_routes table
CREATE TABLE public.bus_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_number TEXT NOT NULL UNIQUE,
  driver_name TEXT,
  driver_phone TEXT,
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  status TEXT DEFAULT 'inactive',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bus_routes ENABLE ROW LEVEL SECURITY;

-- Everyone can view bus routes
CREATE POLICY "Anyone can view bus routes"
  ON public.bus_routes
  FOR SELECT
  USING (true);

-- Create bus_stops table
CREATE TABLE public.bus_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_number TEXT NOT NULL,
  stop_name TEXT NOT NULL,
  stop_lat DOUBLE PRECISION NOT NULL,
  stop_lng DOUBLE PRECISION NOT NULL,
  stop_order INTEGER NOT NULL,
  eta_minutes INTEGER,
  is_next_stop BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (bus_number) REFERENCES public.bus_routes(bus_number) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.bus_stops ENABLE ROW LEVEL SECURITY;

-- Everyone can view bus stops
CREATE POLICY "Anyone can view bus stops"
  ON public.bus_stops
  FOR SELECT
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_bus_routes_updated_at
  BEFORE UPDATE ON public.bus_routes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample data for testing
INSERT INTO public.bus_routes (bus_number, driver_name, driver_phone, current_lat, current_lng, status) VALUES
  ('Bus 21', 'Michael Smith', '+1-555-0101', 37.7749, -122.4194, 'active'),
  ('Bus 42', 'Sarah Johnson', '+1-555-0102', 37.7849, -122.4094, 'active'),
  ('Bus 15', 'David Lee', '+1-555-0103', 37.7649, -122.4294, 'active');

-- Insert sample bus stops for Bus 21
INSERT INTO public.bus_stops (bus_number, stop_name, stop_lat, stop_lng, stop_order, eta_minutes, is_next_stop) VALUES
  ('Bus 21', 'Main Street', 37.7749, -122.4194, 1, 0, false),
  ('Bus 21', 'Park Avenue', 37.7769, -122.4184, 2, 5, true),
  ('Bus 21', 'College Campus', 37.7789, -122.4174, 3, 12, false),
  ('Bus 21', 'Library Square', 37.7809, -122.4164, 4, 18, false),
  ('Bus 21', 'Shopping Center', 37.7829, -122.4154, 5, 25, false);