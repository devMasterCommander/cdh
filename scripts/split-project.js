#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🏗️ Iniciando separación del proyecto CDH...\n');

// Rutas base
const projectRoot = process.cwd();
const backendDir = path.join(projectRoot, '..', 'cdh-backend');
const frontendDir = path.join(projectRoot, '..', 'cdh-frontend');

// Archivos que van al BACKEND (VPS)
const backendFiles = [
  // API Routes
  'src/app/api',
  // Admin Panel
  'src/app/admin',
  // Lógica de negocio
  'src/lib',
  'prisma',
  // Configuración
  'package.json',
  'package-lock.json',
  'next.config.ts',
  'tailwind.config.ts',
  'tsconfig.json',
  'postcss.config.mjs',
  'eslint.config.mjs',
  // Archivos de configuración
  'vercel.json',
  'STAGING-SETUP.md',
  'ARCHITECTURE-PLAN.md'
];

// Archivos que van al FRONTEND (Vercel)
const frontendFiles = [
  // Páginas públicas
  'src/app/(public)',
  'src/app/auth',
  'src/app/demo-login',
  'src/app/demo-test',
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/app/globals.css',
  'src/app/favicon.ico',
  // Componentes UI
  'src/components',
  'src/hooks',
  // Middleware
  'src/middleware.ts',
  // Archivos de configuración
  'components.json',
  'public'
];

// Archivos compartidos (se copian a ambos)
const sharedFiles = [
  'README.md',
  'REACTIVACION.md',
  'DEMO-README.md',
  'USUARIO-DEMO.md'
];

function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`⚠️  No existe: ${src}`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);
  
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function createBackendStructure() {
  console.log('📦 Creando estructura del backend...');
  
  // Crear directorio backend
  if (!fs.existsSync(backendDir)) {
    fs.mkdirSync(backendDir, { recursive: true });
  }

  // Copiar archivos del backend
  for (const file of backendFiles) {
    const srcPath = path.join(projectRoot, file);
    const destPath = path.join(backendDir, file);
    
    if (fs.existsSync(srcPath)) {
      if (fs.statSync(srcPath).isDirectory()) {
        copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
      console.log(`✅ Copiado: ${file}`);
    } else {
      console.log(`⚠️  No encontrado: ${file}`);
    }
  }

  // Copiar archivos compartidos
  for (const file of sharedFiles) {
    const srcPath = path.join(projectRoot, file);
    const destPath = path.join(backendDir, file);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Compartido: ${file}`);
    }
  }

  console.log(`\n🎯 Backend creado en: ${backendDir}`);
}

function createFrontendStructure() {
  console.log('\n🌐 Creando estructura del frontend...');
  
  // Crear directorio frontend
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  // Copiar archivos del frontend
  for (const file of frontendFiles) {
    const srcPath = path.join(projectRoot, file);
    const destPath = path.join(frontendDir, file);
    
    if (fs.existsSync(srcPath)) {
      if (fs.statSync(srcPath).isDirectory()) {
        copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
      console.log(`✅ Copiado: ${file}`);
    } else {
      console.log(`⚠️  No encontrado: ${file}`);
    }
  }

  // Copiar archivos compartidos
  for (const file of sharedFiles) {
    const srcPath = path.join(projectRoot, file);
    const destPath = path.join(frontendDir, file);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Compartido: ${file}`);
    }
  }

  console.log(`\n🎯 Frontend creado en: ${frontendDir}`);
}

function createPackageJson(type) {
  const basePackage = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  
  if (type === 'backend') {
    // Backend: mantener todas las dependencias
    const backendPackage = {
      ...basePackage,
      name: 'cdh-backend',
      description: 'CDH Backend - API y Panel de Administración',
      scripts: {
        ...basePackage.scripts,
        'dev': 'next dev --turbopack -p 3001',
        'build': 'next build --turbopack',
        'start': 'next start -p 3001'
      }
    };
    
    fs.writeFileSync(
      path.join(backendDir, 'package.json'),
      JSON.stringify(backendPackage, null, 2)
    );
  } else {
    // Frontend: solo dependencias de UI
    const frontendPackage = {
      ...basePackage,
      name: 'cdh-frontend',
      description: 'CDH Frontend - Interfaz de Usuario',
      scripts: {
        ...basePackage.scripts,
        'dev': 'next dev --turbopack',
        'build': 'next build --turbopack',
        'start': 'next start'
      }
    };
    
    fs.writeFileSync(
      path.join(frontendDir, 'package.json'),
      JSON.stringify(frontendPackage, null, 2)
    );
  }
}

function createVercelConfig(type) {
  if (type === 'backend') {
    const backendVercel = {
      "version": 2,
      "builds": [
        {
          "src": "package.json",
          "use": "@vercel/next"
        }
      ],
      "env": {
        "NODE_ENV": "production"
      },
      "functions": {
        "src/app/api/**/*.ts": {
          "maxDuration": 30
        }
      },
      "headers": [
        {
          "source": "/api/(.*)",
          "headers": [
            {
              "key": "Access-Control-Allow-Origin",
              "value": "*"
            },
            {
              "key": "Access-Control-Allow-Methods",
              "value": "GET, POST, PUT, DELETE, OPTIONS"
            },
            {
              "key": "Access-Control-Allow-Headers",
              "value": "Content-Type, Authorization"
            }
          ]
        }
      ]
    };
    
    fs.writeFileSync(
      path.join(backendDir, 'vercel.json'),
      JSON.stringify(backendVercel, null, 2)
    );
  } else {
    const frontendVercel = {
      "version": 2,
      "builds": [
        {
          "src": "package.json",
          "use": "@vercel/next"
        }
      ],
      "env": {
        "NODE_ENV": "production"
      },
      "rewrites": [
        {
          "source": "/ref/:slug*",
          "destination": "/"
        }
      ]
    };
    
    fs.writeFileSync(
      path.join(frontendDir, 'vercel.json'),
      JSON.stringify(frontendVercel, null, 2)
    );
  }
}

// Ejecutar separación
try {
  createBackendStructure();
  createFrontendStructure();
  createPackageJson('backend');
  createPackageJson('frontend');
  createVercelConfig('backend');
  createVercelConfig('frontend');
  
  console.log('\n🎉 ¡Separación completada exitosamente!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. cd ../cdh-backend && npm install');
  console.log('2. cd ../cdh-frontend && npm install');
  console.log('3. Configurar variables de entorno en cada proyecto');
  console.log('4. Deploy backend en VPS OVH');
  console.log('5. Deploy frontend en Vercel');
  
} catch (error) {
  console.error('❌ Error durante la separación:', error);
  process.exit(1);
}
