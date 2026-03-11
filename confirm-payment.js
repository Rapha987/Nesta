// Netlify Function - Conferma pagamento e invia email
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51T9rNbJ7kdsaJJy6Dlr3yt9GCyGHocAfY0RnlqkZoMNydX88k0rcPbNngA9APE5ZOXMGus9P5VBQ3v19knWtiWXY00OOe98SGx';
const stripe = require('stripe')(STRIPE_SECRET_KEY);

// Funzione per inviare email via EmailJS o servizio simile
async function inviaEmailConferma(email, nome, codiceBuono, amount) {
  // Qui puoi integrare EmailJS, SendGrid, Mailgun, etc.
  // Per ora logghiamo solo (da implementare con il tuo servizio email)
  console.log(`📧 Email da inviare a ${email}:`, {
    nome,
    codiceBuono,
    amount: amount / 100 + '€'
  });
  return true;
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Metodo non consentito' })
    };
  }

  try {
    const { paymentIntentId, email, nome, codiceBuono } = JSON.parse(event.body);

    // Recupera PaymentIntent da Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Pagamento riuscito!
      
      // Invia email di conferma
      await inviaEmailConferma(
        email, 
        nome, 
        codiceBuono, 
        paymentIntent.amount
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Pagamento completato con successo',
          codiceBuono: codiceBuono,
          amount: paymentIntent.amount
        })
      };
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Pagamento non completato',
          status: paymentIntent.status
        })
      };
    }

  } catch (error) {
    console.error('Errore:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Errore durante la conferma',
        details: error.message 
      })
    };
  }
};