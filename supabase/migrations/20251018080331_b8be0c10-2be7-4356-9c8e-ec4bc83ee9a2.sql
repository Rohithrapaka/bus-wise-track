-- Drop the existing trigger that auto-creates student role
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;

-- Drop the existing function
DROP FUNCTION IF EXISTS public.handle_new_user_role();

-- Allow users to insert their own role during signup
CREATE POLICY "Users can insert their own role during signup"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);