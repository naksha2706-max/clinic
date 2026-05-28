-- Create a table for clinics
create table public.clinics (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  address text,
  specialty text,
  is_emergency_capable boolean default false,
  latitude double precision,
  longitude double precision,
  is_available boolean default true,
  current_queue integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Bookings Table
CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clinic_id UUID REFERENCES public.clinics(id),
    user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(), -- Linked to Auth
    patient_name TEXT NOT NULL,
    patient_contact TEXT, -- Phone Number
    patient_email TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    medical_history_summary TEXT,
    symptoms TEXT,
    appointment_time TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled
    queue_position INTEGER DEFAULT NULL,
    estimated_wait_mins INTEGER DEFAULT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see only their own bookings
CREATE POLICY "Users can view own bookings"
ON public.bookings FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own bookings
CREATE POLICY "Users can insert own bookings"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);


-- 3. Interaction Logs (Negotiation History)
CREATE TABLE public.interaction_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    transcript JSONB NOT NULL,
    summary TEXT,
    severity_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.interaction_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see logs for their bookings
CREATE POLICY "Users can view logs for own bookings"
ON public.interaction_logs FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.bookings
        WHERE public.bookings.id = interaction_logs.booking_id
        AND public.bookings.user_id = auth.uid()
    )
);

-- Create policies for Clinics
-- Policy: Anyone can view clinics (to see recommendations)
CREATE POLICY "Anyone can view clinics"
ON public.clinics FOR SELECT
USING (true);

-- Enable Row Level Security (RLS)
-- 4. Emergency Alerts Table
CREATE TABLE public.emergency_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id), -- Optional for guests
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    status TEXT DEFAULT 'triggered', -- triggered, responding, resolved
    channels_notified JSONB DEFAULT '[]', -- ['SMS', 'Email', 'Clinic']
    patient_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (to allow guest emergencies)
CREATE POLICY "Anyone can report an emergency"
ON public.emergency_alerts FOR INSERT
WITH CHECK (true);

-- Policy: Only authenticated users can see their own emergencies
CREATE POLICY "Users can view own emergencies"
ON public.emergency_alerts FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);
