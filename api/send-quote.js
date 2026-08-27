module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Importación dinámica compatible con cualquier versión de Node en Vercel
    const { Resend } = await import('resend');

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { to, subject, htmlContent } = body;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('Falta configurar la RESEND_API_KEY en Vercel');
    }

    const resend = new Resend(apiKey);

    const data = await resend.emails.send({
      from: 'Falkon Supply <onboarding@resend.dev>',
      to: [to],
      subject: subject || 'Cotización Falkon Supply',
      html: htmlContent || '<p>Sin contenido</p>',
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error detallado en API:', error);
    return res.status(500).json({ error: error.message });
  }
}; .