# 🎓 CDH - Plataforma de Cursos Online

Sistema de gestión de aprendizaje (LMS) construido con Next.js, Prisma, Supabase, NextAuth y Stripe.

## 🚀 Inicio Rápido

> ⚠️ **IMPORTANTE:** Si el proyecto ha estado inactivo, lee la **[Guía de Reactivación](./REACTIVACION.md)** primero.

### Requisitos Previos

- Node.js 18+ 
- Cuenta de Supabase (PostgreSQL)
- Cuenta de Stripe (para pagos)
- Credenciales de Google OAuth (para autenticación)

### Stack Tecnológico

- **Framework:** Next.js 15
- **Base de Datos:** PostgreSQL (Supabase) + Prisma ORM
- **Autenticación:** NextAuth.js
- **Pagos:** Stripe
- **Videos:** Vimeo Player
- **Estilos:** Tailwind CSS

## 📋 Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# BASE DE DATOS (Supabase)
DATABASE_URL="postgresql://postgres:password@host:5432/postgres"
DIRECT_URL="postgresql://postgres:password@host:5432/postgres"

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

# EMAIL (opcional)
EMAIL_SERVER_USER="tu-email@gmail.com"
EMAIL_SERVER_PASSWORD="tu-app-password"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_FROM="tu-email@gmail.com"

# VIMEO (opcional)
VIMEO_ACCESS_TOKEN="tu-token"
```

### 3. Configurar Base de Datos

```bash
# Sincronizar el esquema de Prisma con la base de datos
npx prisma db push

# Generar el cliente de Prisma
npx prisma generate

# (Opcional) Abrir Prisma Studio para gestionar datos
npx prisma studio
```

### 4. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
cdh/
├── prisma/
│   └── schema.prisma        # Esquema de base de datos
├── src/
│   ├── app/
│   │   ├── api/             # API Routes
│   │   │   ├── auth/        # NextAuth endpoints
│   │   │   ├── checkout_sessions/
│   │   │   ├── progress/    # Progreso de lecciones
│   │   │   └── webhooks/    # Stripe webhooks
│   │   ├── curso/           # Página de curso
│   │   ├── cursos/          # Páginas dinámicas de cursos
│   │   │   └── [courseId]/
│   │   │       ├── leccion/
│   │   │       │   └── [lessonId]/
│   │   │       └── page.tsx
│   │   ├── layout.tsx       # Layout principal
│   │   └── page.tsx         # Página de inicio
│   ├── components/
│   │   └── VideoPlayer.tsx  # Reproductor de Vimeo
│   ├── lib/
│   │   ├── prisma.ts        # Cliente de Prisma
│   │   └── server/
│   │       └── commissions.ts
│   └── middleware.ts        # Middleware de autenticación
├── .env.local               # Variables de entorno (crear)
└── package.json
```

## 🗄️ Modelos de Base de Datos

### Principales Entidades

- **User:** Usuarios del sistema con sistema de afiliados
- **Course:** Cursos disponibles
- **Module:** Módulos de cada curso
- **Lesson:** Lecciones con videos de Vimeo
- **LessonProgress:** Progreso de usuarios en lecciones
- **Purchase:** Compras realizadas (vinculadas a Stripe)
- **Commission:** Comisiones de afiliados
- **Account/Session:** Tablas de NextAuth

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo con Turbopack
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción
npm run lint         # Ejecutar linter

# Prisma
npx prisma studio    # Abrir interfaz visual de base de datos
npx prisma generate  # Generar cliente de Prisma
npx prisma db push   # Sincronizar esquema (desarrollo)
npx prisma migrate dev  # Crear migración (recomendado)
npx prisma db pull   # Actualizar esquema desde BD existente
```

## 🔐 Autenticación

Este proyecto usa **NextAuth.js** con soporte para:
- Google OAuth
- Magic Links por email (opcional)

Los usuarios pueden tener patrocinadores (sistema de afiliados de varios niveles).

## 💳 Sistema de Pagos

Integración con **Stripe** para:
- Checkout de cursos
- Webhooks para confirmar pagos
- Generación automática de comisiones por afiliados

## 📹 Sistema de Videos

- Reproductor de Vimeo integrado
- Guardado automático del progreso (timestamp)
- Marcado de lecciones como completadas

## 🚨 Solución de Problemas

### Supabase pausado o inactivo

Ver **[REACTIVACION.md](./REACTIVACION.md)** para instrucciones detalladas.

### Error: "Can't reach database server"
```bash
# Verifica que Supabase esté activo
# Verifica DATABASE_URL en .env.local
```

### Error: "Table does not exist"
```bash
npx prisma db push
npx prisma generate
```

### Error de autenticación
```bash
# Regenera el NEXTAUTH_SECRET
openssl rand -base64 32
```

## 📚 Recursos

- [Guía de Reactivación](./REACTIVACION.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org/)
- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## 📄 Licencia

Proyecto privado.
