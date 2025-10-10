// Simula un webhook después de una compra exitosa
const fetch = require('node-fetch');

// Instrucciones: Después de hacer la compra, ve a Stripe Dashboard > Events
// Copia el JSON completo del evento 'checkout.session.completed'
// Pégalo aquí en la variable eventData

const eventData = {
  "type": "checkout.session.completed",
  "data": {
    "object": {
      // PEGA AQUÍ EL OBJETO COMPLETO DEL EVENTO
    }
  }
};

async function simulateWebhook() {
  console.log('📤 Enviando evento al webhook de desarrollo...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/webhooks/stripe-dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    
    const status = response.status;
    const data = await response.json();
    
    console.log(`Status: ${status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (status === 200) {
      console.log('\n✅ Webhook procesado correctamente!');
      console.log('\nVerifica en el admin:');
      console.log('- http://localhost:3000/admin/transacciones');
      console.log('- http://localhost:3000/admin/usuarios');
    } else {
      console.log('\n❌ Error en el webhook');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Solo ejecutar si se ha configurado el eventData
if (eventData.data.object && Object.keys(eventData.data.object).length > 0) {
  simulateWebhook();
} else {
  console.log('⚠️  Por favor, configura el eventData primero.');
  console.log('\nPasos:');
  console.log('1. Haz una compra en http://localhost:3000/cursos/course_test_abc');
  console.log('2. Ve a https://dashboard.stripe.com/test/events');
  console.log('3. Encuentra el evento "checkout.session.completed" más reciente');
  console.log('4. Copia TODO el JSON del evento');
  console.log('5. Pégalo en eventData.data.object en este archivo');
  console.log('6. Ejecuta: node simulate-webhook.js');
}

