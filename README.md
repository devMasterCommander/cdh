# 🎓 CDH - Centro de Desarrollo Humano

Plataforma de aprendizaje online con sistema de afiliados, construida con Next.js 15, Prisma, PostgreSQL, NextAuth y Stripe.

## 🚀 Estado Actual del Proyecto

- ✅ **Versión**: v1.0.0-stable
- ✅ **Funcionalidades**: Completas y operativas
- ✅ **Menú responsive**: Implementado en admin y usuario
- ✅ **Sistema de afiliados**: Funcional con comisiones automáticas
- ✅ **Reproductor de video**: Vimeo integrado con progreso
- ✅ **Pagos**: Stripe configurado y operativo
- ✅ **Autenticación**: NextAuth con Google OAuth

## 🏗️ Arquitectura del Proyecto

### **Stack Tecnológico**
- **Framework**: Next.js 15 con Turbopack
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth.js
- **Pagos**: Stripe
- **Videos**: Vimeo Player
- **Estilos**: Tailwind CSS + shadcn/ui
- **UI Components**: Radix UI

### **Estructura Actual**
```
cdh/
├── src/
│   ├── app/
│   │   ├── (public)/          # Páginas públicas
│   │   │   ├── cursos/        # Catálogo de cursos
│   │   │   ├── mi-cuenta/     # Dashboard de usuario
│   │   │   └── curso/         # Página de curso
│   │   ├── admin/             # Panel de administración
│   │   │   ├── cursos/        # Gestión de cursos
│   │   │   ├── usuarios/      # Gestión de usuarios
│   │   │   ├── afiliados/     # Gestión de afiliados
│   │   │   └── transacciones/ # Gestión de pagos
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── checkout_sessions/
│   │   │   ├── progress/      # Progreso de lecciones
│   │   │   └── webhooks/      # Stripe webhooks
│   │   ├── auth/              # Páginas de autenticación
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # Componentes UI (shadcn/ui)
│   │   ├── VideoPlayer.tsx    # Reproductor de Vimeo
│   │   └── BuyButton.tsx      # Botón de compra
│   ├── lib/
│   │   ├── prisma.ts          # Cliente de Prisma
│   │   ├── utils.ts           # Utilidades
│   │   └── api-client.ts      # Cliente API (para arquitectura desacoplada)
│   └── hooks/
│       └── use-mobile.ts      # Hook para detección móvil
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
├── scripts/
│   └── split-project.js       # Script para separar backend/frontend
├── projects_docs/             # Documentación del proyecto
└── package.json
```

## 🚀 Inicio Rápido

### **Requisitos Previos**
- Node.js 18+
- PostgreSQL (Supabase recomendado)
- Cuenta de Stripe
- Credenciales de Google OAuth
- Token de Vimeo

### **1. Instalación**
```bash
# Clonar el repositorio
git clone https://github.com/devMasterCommander/cdh.git
cd cdh

# Instalar dependencias
npm install
```

### **2. Configuración de Variables de Entorno**
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# BASE DE DATOS
DATABASE_URL="postgresql://usuario:password@host:5432/postgres"
DIRECT_URL="postgresql://usuario:password@host:5432/postgres"

# NEXTAUTH
NEXTAUTH_SECRET="genera-con-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# GOOGLE OAUTH
GOOGLE_CLIENT_ID="tu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-client-secret"

# STRIPE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# VIMEO
VIMEO_ACCESS_TOKEN="tu-token"
```

### **3. Configurar Base de Datos**
```bash
# Sincronizar esquema
npx prisma db push

# Generar cliente
npx prisma generate

# (Opcional) Abrir Prisma Studio
npx prisma studio
```

### **4. Iniciar Desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🎯 Funcionalidades Principales

### **👥 Sistema de Usuarios**
- **Tipos**: Guest, Customer, Affiliate, Admin
- **Autenticación**: Google OAuth + Magic Links
- **Perfiles**: Gestión completa de datos personales
- **Afiliados**: Sistema de referidos con comisiones

### **📚 Gestión de Cursos**
- **Estructura**: Cursos → Módulos → Lecciones
- **Videos**: Integración con Vimeo
- **Progreso**: Seguimiento automático de visualización
- **Compras**: Integración con Stripe

### **💰 Sistema de Afiliados**
- **Referidos**: URLs personalizadas (`/ref/slug`)
- **Comisiones**: Cálculo automático al comprar
- **Estados**: Pending, Approved, Declined, Paid
- **Pagos**: Gestión desde panel de admin

### **🖥️ Panel de Administración**
- **Gestión de cursos**: CRUD completo
- **Gestión de usuarios**: Asignación de patrocinadores
- **Gestión de afiliados**: Aprobación y pagos
- **Transacciones**: Seguimiento de pagos
- **Responsive**: Menú lateral colapsable

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo (Turbopack)
npm run build        # Construir para producción
npm run start        # Servidor de producción
npm run lint         # Ejecutar linter

# Prisma
npx prisma studio    # Interfaz visual de BD
npx prisma generate  # Generar cliente
npx prisma db push   # Sincronizar esquema
npx prisma migrate dev  # Crear migración

# Demo
npm run setup:demo   # Configurar usuario demo
npm run demo:session # Crear sesión demo
```

## 🏗️ Arquitectura Desacoplada (Futuro)

El proyecto está preparado para una arquitectura desacoplada:

- **Backend (VPS)**: API + Admin Panel
- **Frontend (Vercel)**: UI pública + Dashboard usuario
- **Beneficios**: Control total, costos reducidos (~€5-15/mes vs €50-200/mes)

Para implementar:
```bash
node scripts/split-project.js
```

## 🧪 Usuario Demo

Para pruebas rápidas:
- **Email**: demo@cdh.com
- **Acceso**: [http://localhost:3000/demo-login](http://localhost:3000/demo-login)

## 📊 Modelos de Base de Datos

### **Entidades Principales**
- **User**: Usuarios con sistema de afiliados
- **Course/Module/Lesson**: Estructura de cursos
- **LessonProgress**: Progreso de usuarios
- **Purchase**: Compras (vinculadas a Stripe)
- **Commission**: Comisiones de afiliados
- **Account/Session**: NextAuth

### **Enums**
- **UserType**: GUEST, CUSTOMER, AFFILIATE, ADMIN
- **CommissionStatus**: PENDING, APPROVED, DECLINED, PAID
- **AffiliateRequestStatus**: NONE, PENDING, APPROVED, REJECTED

## 🚨 Solución de Problemas

### **Base de datos inactiva**
```bash
# Verificar conexión
npx prisma db push
npx prisma generate
```

### **Error de autenticación**
```bash
# Regenerar secret
openssl rand -base64 32
```

### **Problemas de build**
```bash
# Limpiar caché
rm -rf .next
npm run build
```

## 📚 Documentación

- **Documentación completa**: `projects_docs/`
- **Arquitectura**: `projects_docs/ARCHITECTURE-PLAN.md`
- **Configuración Backend**: `projects_docs/BACKEND-ENV.md`
- **Configuración Frontend**: `projects_docs/FRONTEND-ENV.md`

## 🔄 Deploy

### **Desarrollo**
- **Local**: `npm run dev`
- **Staging**: Rama `staging` → Vercel

### **Producción**
- **Monolítico**: Deploy completo en Vercel
- **Desacoplado**: Backend en VPS + Frontend en Vercel

## 📄 Licencia

Proyecto privado - Centro de Desarrollo Humano