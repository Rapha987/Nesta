// Netlify Function - Crea PaymentIntent Stripe
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51T9rNbJ7kdsaJJy6Dlr3yt9GCyGHocAfY0RnlqkZoMNydX88k0rcPbNngA9APE5ZOXMGus9P5VBQ3v19knWtiWXY00OOe98SGx';
const stripe = require('stripe')(STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Gestione preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Solo POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Metodo non consentito' })
    };
  }

  try {
    const { amount, email, nome, codiceBuono } = JSON.parse(event.body);

    // Validazione
    if (!amount || !email || !codiceBuono) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Dati mancanti' })
      };
    }

    // Crea PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // in centesimi (es: 100 = 1€)
      currency: 'eur',
      receipt_email: email,
      metadata: {
        codice_buono: codiceBuono,
        cliente_nome: nome || 'N/A',
        cliente_email: email,
        prodotto: 'Gift Card NESTA Trasporti'
      },
      description: `Gift Card NESTA Trasporti - ${codiceBuono}`
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      })
    };

  } catch (error) {
    console.error('Errore Stripe:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Errore durante la creazione del pagamento',
        details: error.message 
      })
    };
  }
};