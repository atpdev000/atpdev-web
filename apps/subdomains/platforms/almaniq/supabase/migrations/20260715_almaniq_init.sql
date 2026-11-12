-- Tendencias detectadas cada día, de cualquier fuente
create table trends (
  id uuid primary key default gen_random_uuid(),
  source text not null,              -- 'google_trends' | 'tiktok' | 'facebook' | 'news'
  topic text not null,
  volume bigint,
  growth_percent numeric,
  detected_at timestamptz default now(),
  raw_payload jsonb,                 -- guarda el dato crudo original
  status text default 'pending'      -- pending | approved | rejected | published
);

-- Resultado de la curaduría editorial (Groq)
create table trend_curation (
  id uuid primary key default gen_random_uuid(),
  trend_id uuid references trends(id) on delete cascade,
  editorial_angle text,              -- el "valor añadido" que evita el flag de contenido reutilizado
  safety_flag boolean default false, -- true si Groq detecta tema sensible
  safety_reason text,
  originality_score numeric,         -- 0-10, umbral mínimo para aprobar publicación
  created_at timestamptz default now()
);

-- Evita publicar el mismo ángulo/tema dos veces
create table content_fingerprint (
  id uuid primary key default gen_random_uuid(),
  topic_hash text unique not null,
  published_at timestamptz default now(),
  platforms text[]                   -- ['tiktok','youtube','facebook']
);

-- Registro de disclosure de IA por publicación (auditoría de cumplimiento de políticas)
create table ai_disclosure_log (
  id uuid primary key default gen_random_uuid(),
  publication_id uuid,
  platform text,
  disclosure_applied boolean,
  disclosure_type text,              -- 'altered_synthetic' | 'ai_generated_label'
  created_at timestamptz default now()
);
