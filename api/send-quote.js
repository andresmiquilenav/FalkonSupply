module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { Resend } = await import('resend');

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    body = body || {};
    const { to, subject, htmlContent } = body;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Falta configurar la RESEND_API_KEY' });
    }

    const resend = new Resend(apiKey);

    // Asegúrate de cambiar 'tudominio.com' por el dominio real que registraste en Resend
    const data = await resend.emails.send({
      from: 'Falkon Supply <ventas@falkon.cl>', 
      to: [to],
      subject: subject || 'Cotización Falkon Supply',
      html: htmlContent || '<p>Sin contenido</p>',
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    // Esto enviará el error exacto a la pantalla en lugar de un mensaje genérico
    return res.status(500).json({ 
      error: 'Error de Resend: ' + error.message 
    });
  }
};