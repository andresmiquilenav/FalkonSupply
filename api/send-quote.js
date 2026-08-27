import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { to, subject, htmlContent } = req.body;

    const data = await resend.emails.send({
      from: 'Falkon Supply <onboarding@resend.dev>', // O tu dominio verificado en Resend
      to: [to],
      subject: subject || 'Cotización Falkon Supply',
      html: htmlContent,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}