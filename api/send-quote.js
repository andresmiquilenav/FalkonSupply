export default async function handler(req, res) {
  try {

    // aquí recibes los datos
    const { to, subject, htmlContent } = req.body;

    // DIAGNÓSTICO TEMPORAL
    console.log('EMAILJS CONFIG:', {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      public_key_exists: !!process.env.EMAILJS_PUBLIC_KEY,
      public_key_length: process.env.EMAILJS_PUBLIC_KEY?.length,
      private_key_exists: !!process.env.EMAILJS_PRIVATE_KEY,
      private_key_length: process.env.EMAILJS_PRIVATE_KEY?.length
    });

    // aquí llamas a EmailJS
    const response = await fetch(
      'https://api.emailjs.com/api/v1.0/email/send',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_PUBLIC_KEY,
          accessToken: process.env.EMAILJS_PRIVATE_KEY,

          template_params: {
            to: to,
            subject: subject,
            htmlContent: htmlContent
          }
        })
      }
    );

    // resto de tu código...