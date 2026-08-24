import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Falta la clave GEMINI_API_KEY en las variables de entorno.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: 'Eres GonStudy AI, un asistente de estudio virtual e interactivo en español diseñado para ayudar a Gonzalo Davanzo y sus compañeros a repasar materias de secundaria, resolver cuestionarios, resúmenes, exámenes de Verdadero o Falso y Multiple Choice.'
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });
  } catch (error) {
    console.error('Error al conectar con Gemini API:', error);
    return res.status(500).json({ error: 'Error interno al procesar tu solicitud con Gemini AI.' });
  }
}
