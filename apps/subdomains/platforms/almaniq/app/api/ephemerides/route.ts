import { NextRequest, NextResponse } from 'next/server'

// Configuración de Supabase desde variables de entorno del servidor
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://placeholder.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key'

// Tipo para la tabla ephemerides
export interface Ephemeris {
	id: number
	day: number
	month: number
	year: number
	event: string
	display_date: string | null
	historical_day: number | null
	historical_month: number | null
	historical_year: number | null
	created_at: string | null
	updated_at: string | null
}

// Función para hacer peticiones a Supabase desde el servidor
async function makeSupabaseRequest(endpoint: string, options: RequestInit = {}) {
	if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
		throw new Error('Variables de entorno de Supabase no configuradas')
	}
	
	const url = `${SUPABASE_URL}/rest/v1${endpoint}`
	
	const response = await fetch(url, {
		...options,
		headers: {
			'apikey': SUPABASE_SERVICE_KEY,
			'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
			'Content-Type': 'application/json',
			'Prefer': 'return=representation',
			...options.headers,
		},
	})

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	}

	return response.json()
}

// Función para obtener la efeméride para una fecha específica (con fallbacks inteligentes)
async function getEphemerisForDate(date: string): Promise<Ephemeris | null> {
	try {
		// 1. Intentar encontrar efeméride exacta para la fecha en ephemerides
		const data = await makeSupabaseRequest(`/ephemerides?display_date=eq.${date}`).catch(() => null)

		if (data && data.length > 0) {
			return data[0]
		}

		// 2. Intentar buscar en daily_content para esa fecha
		const dailyData = await makeSupabaseRequest(`/daily_content?date=ilike.${date}%&order=created_at.desc&limit=1`).catch(() => null)
		if (dailyData && dailyData.length > 0 && dailyData[0].ephemeris_text) {
			const item = dailyData[0]
			const d = new Date(date || Date.now())
			return {
				id: item.id,
				day: d.getDate(),
				month: d.getMonth() + 1,
				year: d.getFullYear(),
				event: item.ephemeris_text,
				display_date: date,
				historical_day: d.getDate(),
				historical_month: d.getMonth() + 1,
				historical_year: d.getFullYear(),
				created_at: item.created_at,
				updated_at: item.updated_at
			}
		}

		// 3. Fallback: Registro más reciente de la tabla ephemerides
		const latestEphem = await makeSupabaseRequest('/ephemerides?order=created_at.desc&limit=1').catch(() => null)
		if (latestEphem && latestEphem.length > 0) {
			return latestEphem[0]
		}

		// 4. Fallback: Registro más reciente de daily_content
		const latestDaily = await makeSupabaseRequest('/daily_content?order=created_at.desc&limit=1').catch(() => null)
		if (latestDaily && latestDaily.length > 0 && latestDaily[0].ephemeris_text) {
			const item = latestDaily[0]
			return {
				id: item.id,
				day: 20,
				month: 7,
				year: 2026,
				event: item.ephemeris_text,
				display_date: item.date,
				historical_day: 20,
				historical_month: 7,
				historical_year: 1969,
				created_at: item.created_at,
				updated_at: item.updated_at
			}
		}

		// 5. Fallback predeterminado de Almaniq (previene que la pantalla se quede sin efeméride)
		return {
			id: 1,
			day: 20,
			month: 7,
			year: 2026,
			event: "El 20 de julio de 1969, la humanidad logró uno de sus mayores hitos con el aterrizaje del Apolo 11 en la Luna. Neil Armstrong se convirtió en la primera persona en pisar la superficie lunar. Curiosamente, la computadora de navegación del módulo lunar tenía menos de 0.00005 GB de memoria RAM, una fracción diminuta del poder de cálculo de cualquier smartphone moderno.",
			display_date: date,
			historical_day: 20,
			historical_month: 7,
			historical_year: 1969,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		}
	} catch (error) {
		console.error('💥 Error en getEphemerisForDate:', error)
		return {
			id: 1,
			day: 20,
			month: 7,
			year: 2026,
			event: "El 20 de julio de 1969, la humanidad logró uno de sus mayores hitos con el aterrizaje del Apolo 11 en la Luna. Neil Armstrong se convirtió en la primera persona en pisar la superficie lunar. Curiosamente, la computadora de navegación del módulo lunar tenía menos de 0.00005 GB de memoria RAM, una fracción diminuta del poder de cálculo de cualquier smartphone moderno.",
			display_date: date,
			historical_day: 20,
			historical_month: 7,
			historical_year: 1969,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		}
	}
}

// Función para obtener la efeméride para el día actual
async function getTodayEphemeris(): Promise<Ephemeris | null> {
	const now = new Date()
	const peruOffset = -5 * 60
	const utcOffset = now.getTimezoneOffset()
	const peruTime = new Date(now.getTime() + (peruOffset - utcOffset) * 60 * 1000)
	const todayStr = peruTime.toISOString().split('T')[0]
	return await getEphemerisForDate(todayStr)
}



// Handler para GET requests
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const date = searchParams.get('date')

		// Si se especifica una fecha, obtener esa efeméride específica
		if (date) {
			const ephemeris = await getEphemerisForDate(date)
			
			if (!ephemeris) {
				return NextResponse.json(
					{ error: 'No se encontró efeméride para la fecha especificada' },
					{ status: 404 }
				)
			}
			
			return NextResponse.json({ data: ephemeris })
		}



		// Por defecto, obtener la efeméride de hoy
		const todayEphemeris = await getTodayEphemeris()
		
		if (!todayEphemeris) {
			return NextResponse.json(
				{ error: 'No se encontró efeméride para hoy' },
				{ status: 404 }
			)
		}

		return NextResponse.json({ data: todayEphemeris })

	} catch (error) {
		console.error('Error en API de efemérides:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		)
	}
} 