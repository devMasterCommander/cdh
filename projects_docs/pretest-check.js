#!/usr/bin/env node

/**
 * Script de Verificación Pre-Test para CDH
 * Verifica que todo esté listo para hacer testing local
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Verificación Pre-Test CDH\n');
console.log('='.repeat(50) + '\n');

let errors = [];
let warnings = [];
let success = [];

// 1. Verificar archivo .env
console.log('📋 1. Verificando variables de entorno...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  // Variables críticas
  const criticalVars = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET'
  ];
  
  criticalVars.forEach(varName => {
    if (envContent.includes(varName)) {
      success.push(`   ✅ ${varName} configurado`);
    } else {
      errors.push(`   ❌ ${varName} NO configurado`);
    }
  });
  
  // Variables opcionales
  const optionalVars = [
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'EMAIL_SERVER_HOST'
  ];
  
  optionalVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      warnings.push(`   ⚠️  ${varName} no configurado (opcional)`);
    }
  });
  
} else {
  errors.push('   ❌ Archivo .env NO encontrado');
  console.log('   💡 Crea un archivo .env siguiendo ENV_SETUP.md');
}

// 2. Verificar node_modules
console.log('\n📦 2. Verificando dependencias...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  success.push('   ✅ node_modules instalado');
  
  // Verificar paquetes críticos
  const criticalPackages = ['next', 'react', 'prisma', '@prisma/client', 'next-auth'];
  criticalPackages.forEach(pkg => {
    const pkgPath = path.join(nodeModulesPath, pkg);
    if (fs.existsSync(pkgPath)) {
      success.push(`   ✅ ${pkg} instalado`);
    } else {
      errors.push(`   ❌ ${pkg} NO instalado`);
    }
  });
} else {
  errors.push('   ❌ node_modules NO encontrado');
  console.log('   💡 Ejecuta: npm install');
}

// 3. Verificar Prisma Client
console.log('\n🗄️  3. Verificando Prisma Client...');
const prismaClientPath = path.join(__dirname, 'node_modules', '.prisma', 'client');
if (fs.existsSync(prismaClientPath)) {
  success.push('   ✅ Prisma Client generado');
} else {
  warnings.push('   ⚠️  Prisma Client no generado');
  console.log('   💡 Ejecuta: npx prisma generate');
}

// 4. Verificar archivos de build
console.log('\n🏗️  4. Verificando builds anteriores...');
const nextPath = path.join(__dirname, '.next');
if (fs.existsSync(nextPath)) {
  warnings.push('   ⚠️  Directorio .next existe (cache anterior)');
  console.log('   💡 Para limpiar: rm -rf .next');
} else {
  success.push('   ✅ No hay cache anterior');
}

// 5. Verificar archivos de documentación
console.log('\n📚 5. Verificando documentación...');
const docs = ['ARCHITECTURE.md', 'PRETEST.md', 'ENV_SETUP.md'];
docs.forEach(doc => {
  if (fs.existsSync(path.join(__dirname, doc))) {
    success.push(`   ✅ ${doc} presente`);
  } else {
    warnings.push(`   ⚠️  ${doc} no encontrado`);
  }
});

// 6. Verificar archivos de seguridad
console.log('\n🔒 6. Verificando archivos de seguridad...');
const securityFiles = [
  'src/lib/constants.ts',
  'src/lib/security.ts',
  'src/lib/validators.ts',
  'src/lib/api-response.ts'
];
securityFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    success.push(`   ✅ ${file} presente`);
  } else {
    errors.push(`   ❌ ${file} NO encontrado`);
  }
});

// Resumen
console.log('\n' + '='.repeat(50));
console.log('\n📊 RESUMEN DE VERIFICACIÓN\n');

if (success.length > 0) {
  console.log('✅ CORRECTO (' + success.length + '):');
  success.forEach(msg => console.log(msg));
}

if (warnings.length > 0) {
  console.log('\n⚠️  ADVERTENCIAS (' + warnings.length + '):');
  warnings.forEach(msg => console.log(msg));
}

if (errors.length > 0) {
  console.log('\n❌ ERRORES (' + errors.length + '):');
  errors.forEach(msg => console.log(msg));
}

console.log('\n' + '='.repeat(50) + '\n');

// Resultado final
if (errors.length === 0) {
  console.log('🎉 ¡TODO LISTO PARA PRETEST!');
  console.log('\n📝 Próximos pasos:');
  console.log('   1. npm run dev');
  console.log('   2. Ir a http://localhost:3000/demo-test');
  console.log('   3. Seguir checklist en PRETEST.md');
  console.log('');
  process.exit(0);
} else {
  console.log('⚠️  HAY ERRORES QUE CORREGIR');
  console.log('\n📝 Acciones requeridas:');
  if (!fs.existsSync(envPath)) {
    console.log('   1. Crear archivo .env (ver ENV_SETUP.md)');
  }
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('   2. Ejecutar: npm install');
  }
  if (!fs.existsSync(prismaClientPath)) {
    console.log('   3. Ejecutar: npx prisma generate');
  }
  console.log('');
  process.exit(1);
}

