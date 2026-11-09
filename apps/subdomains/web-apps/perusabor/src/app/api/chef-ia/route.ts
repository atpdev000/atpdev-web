import { NextResponse } from 'next/server';
import { queryChefIAPeru } from '@/lib/chefIA';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, recipeSlug } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 });
    }

    const response = queryChefIAPeru(message, recipeSlug);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error en Chef IA API:', error);
    return NextResponse.json(
      { error: 'Error procesando consulta gastronómica' },
      { status: 500 }
    );
  }
}

