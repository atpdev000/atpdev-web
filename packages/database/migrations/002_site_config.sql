-- =============================================
-- ATP DEV: Tabla de Configuración del Sitio
-- Ejecutar en Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS public.site_config (
  id integer primary key default 1,
  -- Hero
  hero_title text default 'Percy Acha',
  hero_subtitle text default '@ATPDEV',
  hero_typewriter text[] default ARRAY['Android Developer', 'Web Engineer', 'AI Integrator', 'Freelancer'],
  -- Colores
  primary_color text default '#3b82f6',
  secondary_color text default '#8b5cf6',
  -- Perfil / About
  full_name text default 'Percy Acha Taipe',
  bio_short text default 'Ingeniero de Sistemas apasionado por la docencia y el desarrollo de software de alto impacto.',
  bio_long text default 'Bachiller en Ingeniería de Sistemas por la Universidad Nacional José María Arguedas (UNAJMA).',
  avatar_url text default '/avatar.png',
  -- Contacto
  email text default 'contacto@atpdev.dev',
  phone text default '+51 987 006 572',
  location text default 'Andahuaylas, Apurímac, Perú',
  -- Redes Sociales (URL + enabled flag para cada una)
  github_url text default '',
  github_enabled boolean default false,
  linkedin_url text default '',
  linkedin_enabled boolean default false,
  twitter_url text default '',
  twitter_enabled boolean default false,
  facebook_url text default '',
  facebook_enabled boolean default false,
  instagram_url text default '',
  instagram_enabled boolean default false,
  youtube_url text default '',
  youtube_enabled boolean default false,
  tiktok_url text default '',
  tiktok_enabled boolean default false,
  whatsapp_url text default '',
  whatsapp_enabled boolean default true,
  telegram_url text default '',
  telegram_enabled boolean default false,
  discord_url text default '',
  discord_enabled boolean default false,
  -- Links especiales
  cv_url text default '/cv.html',
  credly_url text default 'https://www.credly.com/badges/8172ffd1-f729-41da-8221-60d98e4fe488',
  -- Integraciones
  ga4_id text default '',
  adsense_id text default '',
  -- Timestamp
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insertar fila por defecto
INSERT INTO public.site_config (id, whatsapp_url, whatsapp_enabled, email, phone) 
VALUES (1, 'https://wa.me/51987006572', true, 'contacto@atpdev.dev', '+51 987 006 572') 
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "config_select" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "config_all" ON public.site_config FOR ALL USING (true);
