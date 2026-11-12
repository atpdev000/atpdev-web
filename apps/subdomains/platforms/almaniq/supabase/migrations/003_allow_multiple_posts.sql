-- Migración para permitir múltiples posts por día en Almaniq
-- 1. Quitamos la restricción de fecha única
ALTER TABLE daily_content DROP CONSTRAINT IF EXISTS daily_content_date_key;

-- 2. Cambiamos el tipo de la columna a TEXT para soportar IDs como "2026-07-20_TemaViral"
ALTER TABLE daily_content ALTER COLUMN date TYPE TEXT USING date::TEXT;
