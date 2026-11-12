-- Migración para crear la tabla ephemerides en Almaniq
CREATE TABLE IF NOT EXISTS ephemerides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day INT,
  month INT,
  year INT,
  event TEXT,
  display_date TEXT,
  historical_day INT,
  historical_month INT,
  historical_year INT,
  created_at TIMESTAMPTZ DEFAULT now()
);
