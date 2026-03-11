# NESTA Trasporti - Backend Stripe

Sito con pagamenti Stripe integrati tramite Netlify Functions.

## 🚀 Deploy su Netlify

### 1. Prepara il progetto

Assicurati di avere questi file:
- `index.html` - Frontend
- `netlify/functions/create-payment-intent.js` - Backend creazione pagamento
- `netlify/functions/confirm-payment.js` - Backend conferma pagamento
- `netlify.toml` - Configurazione Netlify
- `package.json` - Dipendenze

### 2. Deploy su Netlify

#### Opzione A: Drag & Drop (più semplice)
1. Comprimi tutti i file in uno ZIP
2. Vai su [netlify.com](https://netlify.com)
3. Trascina lo ZIP nella dashboard

#### Opzione B: Git (consigliato)
1. Crea repo GitHub
2. Pusha i file
3. Connetti repo su Netlify

### 3. Configura variabili d'ambiente

Vai su **Netlify Dashboard → Site settings → Environment variables** e aggiungi:

```
STRIPE_SECRET_KEY = sk_test_... (la tua chiave segreta)
```

Per la produzione usa `sk_live_...`

### 4. Testa il pagamento

Usa questa carta di test Stripe:
- **Numero:** `4242 4242 4242 4242`
- **Data:** Qualsiasi futura (es. 12/25)
- **CVC:** Qualsiasi (es. 123)

## 📁 Struttura

```
nesta-trasporti/
├── index.html              # Frontend
├── netlify.toml            # Config Netlify
├── package.json            # Dipendenze
├── netlify/
│   └── functions/
│       ├── create-payment-intent.js   # Crea PaymentIntent
│       └── confirm-payment.js         # Conferma pagamento
└── README.md
```

## 🔧 API Endpoints

### POST `/api/create-payment-intent`
Crea un PaymentIntent Stripe.

**Body:**
```json
{
  "amount": 100,        // Importo in centesimi (100 = 1€)
  "email": "test@test.com",
  "nome": "Mario Rossi",
  "codiceBuono": "NESTA-ABC123"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

## 📝 Note

- Il backend usa **Netlify Functions** (serverless)
- Stripe processa i pagamenti in modo sicuro
- I dati della carta non toccano mai il tuo server
- Per email automatiche, integra EmailJS/SendGrid nella funzione `confirm-payment.js`

## 🐛 Debug

Vedi i log su: **Netlify Dashboard → Functions → Logs**