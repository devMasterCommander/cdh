// Script para crear sesión del usuario demo directamente en la BD

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setupDemoSession() {
  try {
    console.log('🔧 Configurando usuario demo con sesión activa...\n');

    // 1. Buscar o crear usuario demo
    let demoUser = await prisma.user.findUnique({
      where: { email: 'demo@cdh.com' },
    });

    if (!demoUser) {
      console.log('📝 Creando usuario demo...');
      demoUser = await prisma.user.create({
        data: {
          email: 'demo@cdh.com',
          name: 'Usuario Demo',
          emailVerified: new Date(),
          userType: 'CUSTOMER',
          referralSlug: 'usuario-demo',
        },
      });
      console.log('✅ Usuario demo creado');
    } else {
      console.log('✅ Usuario demo ya existe');
    }

    // 2. Eliminar sesiones anteriores del usuario demo
    await prisma.session.deleteMany({
      where: { userId: demoUser.id },
    });

    // 3. Crear nueva sesión
    const sessionToken = `demo-session-${Date.now()}`;
    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // Expira en 30 días

    await prisma.session.create({
      data: {
        sessionToken,
        userId: demoUser.id,
        expires,
      },
    });

    console.log('✅ Sesión creada');
    console.log('\n🎉 ¡Listo! Ahora puedes acceder con:');
    console.log('\n📧 Email: demo@cdh.com');
    console.log('🔑 Link mágico: Usa el EmailProvider normal');
    console.log('\n💡 O copia este token de sesión en las cookies del navegador:');
    console.log(`   Nombre: next-auth.session-token`);
    console.log(`   Valor: ${sessionToken}`);
    console.log(`   Expira: ${expires.toISOString()}\n`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupDemoSession();

