import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'placeholder_groq_key_for_build',
});

export async function evaluateContentSafety(topic: string, source: string): Promise<{
  isSafe: boolean;
  reason: string;
  editorialAngle: string;
  originalityScore: number;
}> {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
    return {
      isSafe: true,
      reason: 'No Groq API key configured. Bypassing safety check.',
      editorialAngle: 'Default angle due to missing API key.',
      originalityScore: 7
    };
  }

  const prompt = `
  Eres el editor en jefe de Almaniq, un canal de contenido.
  Evalúa la siguiente tendencia para decidir si es apta para publicar.
  Reglas de seguridad: Descarta tragedias, violencia extrema, política divisiva o contenido ilegal.
  
  Tendencia: "${topic}" (Fuente: ${source})

  Responde estrictamente en JSON con el siguiente formato:
  {
    "isSafe": boolean,
    "reason": "Explicación breve de por qué es seguro o inseguro",
    "editorialAngle": "Un ángulo único, interesante y educativo para abordar este tema sin ser clickbait barato. Si no es seguro, déjalo vacío.",
    "originalityScore": número del 0 al 10 (qué tan original o interesante es este tema hoy)
  }
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' }
    });

    const responseContent = completion.choices[0]?.message?.content || '{}';
    const result = JSON.parse(responseContent);

    return {
      isSafe: result.isSafe ?? false,
      reason: result.reason ?? 'Failed to parse reason',
      editorialAngle: result.editorialAngle ?? '',
      originalityScore: result.originalityScore ?? 0
    };
  } catch (error) {
    console.error('Error evaluating content safety:', error);
    return {
      isSafe: false,
      reason: 'Error en la llamada a Groq AI',
      editorialAngle: '',
      originalityScore: 0
    };
  }
}
