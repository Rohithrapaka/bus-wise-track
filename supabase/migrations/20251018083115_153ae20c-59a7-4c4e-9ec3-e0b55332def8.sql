-- Create alerts table
CREATE TABLE public.alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  driver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bus_number text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'delivered',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Students can insert their own alerts
CREATE POLICY "Students can create alerts"
ON public.alerts
FOR INSERT
WITH CHECK (auth.uid() = student_id AND has_role(auth.uid(), 'student'::app_role));

-- Students can view their own alerts
CREATE POLICY "Students can view their own alerts"
ON public.alerts
FOR SELECT
USING (auth.uid() = student_id);

-- Drivers can view alerts sent to them
CREATE POLICY "Drivers can view their alerts"
ON public.alerts
FOR SELECT
USING (auth.uid() = driver_id AND has_role(auth.uid(), 'driver'::app_role));

-- Drivers can update status of their alerts
CREATE POLICY "Drivers can update alert status"
ON public.alerts
FOR UPDATE
USING (auth.uid() = driver_id AND has_role(auth.uid(), 'driver'::app_role))
WITH CHECK (auth.uid() = driver_id AND has_role(auth.uid(), 'driver'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_alerts_updated_at
BEFORE UPDATE ON public.alerts
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();