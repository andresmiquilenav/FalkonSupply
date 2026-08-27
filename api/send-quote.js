import emailjs from '@emailjs/nodejs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    const { to, subject, htmlContent } = body || {};

    // Inicializamos con las variables de Vercel
    emailjs.init({
      publicKey: process.env.EMAILJS_PUBLIC_KEY,
    });

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to: to,
        subject: subject || 'Cotización Falkon Supply',
        htmlContent: htmlContent || '<p>Sin contenido</p>'
      }
    );

    return res.status(200).json({ success: true, response });
  } catch (error) {
    console.error('ERROR CON EMAILJS:', error);
    return res.status(500).json({ error: error.text || error.message || 'Error desconocido' });
  }
}