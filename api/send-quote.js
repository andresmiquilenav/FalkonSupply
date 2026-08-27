module.exports = async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // =========================================================
    // 1. RECIBIR DATOS DESDE EL COTIZADOR
    // =========================================================

    const {
      to,
      subject,
      htmlContent
    } = req.body || {};

    // =========================================================
    // 2. VALIDAR DATOS
    // =========================================================

    if (!to) {
      return res.status(400).json({
        success: false,
        error: 'Falta el correo destinatario (to)'
      });
    }

    if (!subject) {
      return res.status(400).json({
        success: false,
        error: 'Falta el asunto (subject)'
      });
    }

    if (!htmlContent) {
      return res.status(400).json({
        success: false,
        error: 'Falta el contenido del correo (htmlContent)'
      });
    }

    // =========================================================
    // 3. DIAGNÓSTICO DE VARIABLES DE EMAILJS
    //    NO MOSTRAMOS LAS CLAVES, SOLO COMPROBAMOS QUE EXISTAN
    // =========================================================

    console.log('EMAILJS CONFIG:', {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,

      public_key_exists: !!process.env.EMAILJS_PUBLIC_KEY,
      public_key_length: process.env.EMAILJS_PUBLIC_KEY
        ? process.env.EMAILJS_PUBLIC_KEY.length
        : 0,

      private_key_exists: !!process.env.EMAILJS_PRIVATE_KEY,
      private_key_length: process.env.EMAILJS_PRIVATE_KEY
        ? process.env.EMAILJS_PRIVATE_KEY.length
        : 0
    });

    // =========================================================
    // 4. COMPROBAR QUE LAS VARIABLES NECESARIAS EXISTAN
    // =========================================================

    if (!process.env.EMAILJS_SERVICE_ID) {
      console.error('FALTA EMAILJS_SERVICE_ID');

      return res.status(500).json({
        success: false,
        error: 'Falta configurar EMAILJS_SERVICE_ID en Vercel'
      });
    }

    if (!process.env.EMAILJS_TEMPLATE_ID) {
      console.error('FALTA EMAILJS_TEMPLATE_ID');

      return res.status(500).json({
        success: false,
        error: 'Falta configurar EMAILJS_TEMPLATE_ID en Vercel'
      });
    }

    if (!process.env.EMAILJS_PUBLIC_KEY) {
      console.error('FALTA EMAILJS_PUBLIC_KEY');

      return res.status(500).json({
        success: false,
        error: 'Falta configurar EMAILJS_PUBLIC_KEY en Vercel'
      });
    }

    if (!process.env.EMAILJS_PRIVATE_KEY) {
      console.error('FALTA EMAILJS_PRIVATE_KEY');

      return res.status(500).json({
        success: false,
        error: 'Falta configurar EMAILJS_PRIVATE_KEY en Vercel'
      });
    }

    // =========================================================
    // 5. ENVIAR CORREO A EMAILJS
    // =========================================================

    console.log('Enviando cotización a EmailJS...');

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

          // PUBLIC KEY
          user_id: process.env.EMAILJS_PUBLIC_KEY,

          // PRIVATE KEY
          accessToken: process.env.EMAILJS_PRIVATE_KEY,

          // Variables de la plantilla EmailJS
          template_params: {
            to: to,
            subject: subject,
            htmlContent: htmlContent
          }
        })
      }
    );

    // =========================================================
    // 6. LEER RESPUESTA DE EMAILJS
    // =========================================================

    const responseText = await response.text();

    console.log('EMAILJS STATUS:', response.status);
    console.log('EMAILJS RESPONSE:', responseText);

    // =========================================================
    // 7. MANEJAR ERROR DE EMAILJS
    // =========================================================

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: 'EmailJS rechazó el envío',
        details: responseText
      });
    }

    // =========================================================
    // 8. ENVÍO EXITOSO
    // =========================================================

    console.log('CORREO ENVIADO CORRECTAMENTE');

    return res.status(200).json({
      success: true,
      message: 'Cotización enviada correctamente',
      emailjs_response: responseText
    });

  } catch (error) {

    // =========================================================
    // 9. ERROR GENERAL DEL SERVIDOR
    // =========================================================

    console.error('ERROR GENERAL EN SEND-QUOTE:', error);

    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};