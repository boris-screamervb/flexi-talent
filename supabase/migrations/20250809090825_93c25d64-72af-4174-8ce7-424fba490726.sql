-- Grant HR access for Boris (idempotent)
INSERT INTO public.hr_emails (email)
VALUES ('boris.vetrano@gmail.com')
ON CONFLICT (email) DO NOTHING;