const { Resend } = require('resend');

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

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('ERROR CRÍTICO: Falta la API Key de Resend');
      return res.status(500).json({ error: 'Falta configurar RESEND_API_KEY' });
    }

    const resend = new Resend(apiKey);

    console.log('Intentando enviar correo a:', to);

    const data = await resend.emails.send({
      from: 'Falkon Supply <ventas@tudominio.com>', // REEMPLAZA ESTO CON TU DOMINIO REAL
      to: [to],
      subject: subject || 'Cotización Falkon Supply',
      html: htmlContent || '<p>Sin contenido</p>',
    });

    console.log('Respuesta exitosa de Resend:', data);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('ERROR AL ENVIAR CON RESEND:', error);
    return res.status(500).json({ error: error.message || 'Error desconocido al enviar' });
  }
}