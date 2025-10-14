// Script Node.js para configurar usuario demo (multiplataforma)

const http = require('http');

console.log('🚀 Configurando Usuario Demo...\n');

// Verificar si el servidor está corriendo
const checkServer = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000', (res) => {
      resolve(true);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.end();
  });
};

// Crear usuario demo
const createDemoUser = () => {
  return new Promise((resolve, reject) => {
    const postData = '';
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/demo/create-user',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Error al parsear respuesta'));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
};

// Ejecutar
(async () => {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('⚠️  El servidor no está corriendo');
    console.log('   Ejecuta: npm run dev\n');
    process.exit(1);
  }

  console.log('📝 Creando usuario demo...');
  
  try {
    const response = await createDemoUser();
    console.log('\n' + JSON.stringify(response, null, 2));
    
    console.log('\n✅ Usuario demo configurado\n');
    console.log('🔑 Credenciales:');
    console.log('   Email: demo@cdh.com');
    console.log('   Contraseña: demo1234\n');
    console.log('🌐 Accede a:');
    console.log('   http://localhost:3000/demo-login\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();

