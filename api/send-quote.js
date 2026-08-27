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

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,      // Sigue exigido por la API
        accessToken: process.env.EMAILJS_PUBLIC_KEY,  // Aquí va la Private Key para autorizar al servidor
        template_params: {
          to: to,
          subject: subject || 'Cotización Falkon Supply',
          htmlContent: htmlContent || '<p>Sin contenido</p>'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al comunicarse con EmailJS');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('ERROR CON EMAILJS:', error);
    return res.status(500).json({ error: error.message || 'Error desconocido' });
  }
}