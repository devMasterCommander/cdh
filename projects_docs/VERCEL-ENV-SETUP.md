# 🔧 Configuración de Variables de Entorno en Vercel

## 🚨 **PROBLEMA IDENTIFICADO**

El deployment falla con el error:
```
Environment variable not found: DATABASE_URL
```

**Causa**: Prisma necesita `DATABASE_URL` durante el build para generar páginas estáticas.

## 📋 **VARIABLES DE ENTORNO REQUERIDAS**

### **1. Variables Críticas para Build (OBLIGATORIAS)**

```env
# Base de datos (Supabase)
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="https://cdh-cy4ls7qq3-qubit-clouds-projects.vercel.app"
NEXTAUTH_SECRET="tu-secret-key-para-vercel"
```

### **2. Variables para Funcionalidad Completa (OPCIONALES)**

```env
# Google OAuth
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"

# Stripe (para pagos)
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."

# Vimeo (para videos)
VIMEO_ACCESS_TOKEN="tu-vimeo-token"

# Email (para NextAuth)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="tu-email@gmail.com"
EMAIL_SERVER_PASSWORD="tu-app-password"
EMAIL_FROM="tu-email@gmail.com"
```

## 🚀 **PASOS PARA CONFIGURAR EN VERCEL**

### **Paso 1: Acceder a Vercel Dashboard**
1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona el proyecto `cdh`
3. Ve a **Settings** → **Environment Variables**

### **Paso 2: Agregar Variables Críticas**
1. **DATABASE_URL**:
   - Name: `DATABASE_URL`
   - Value: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`
   - Environment: `Production`, `Preview`, `Development`

2. **DIRECT_URL**:
   - Name: `DIRECT_URL`
   - Value: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`
   - Environment: `Production`, `Preview`, `Development`

3. **NEXTAUTH_URL**:
   - Name: `NEXTAUTH_URL`
   - Value: `https://cdh-cy4ls7qq3-qubit-clouds-projects.vercel.app`
   - Environment: `Production`, `Preview`, `Development`

4. **NEXTAUTH_SECRET**:
   - Name: `NEXTAUTH_SECRET`
   - Value: `tu-secret-key-seguro`
   - Environment: `Production`, `Preview`, `Development`

### **Paso 3: Redeploy**
1. Después de agregar las variables, ve a **Deployments**
2. Haz clic en **Redeploy** en el deployment más reciente
3. O haz un nuevo push a `main`

## 🔍 **VERIFICACIÓN**

### **Variables Mínimas para Build Exitoso:**
- ✅ `DATABASE_URL` - Para Prisma
- ✅ `DIRECT_URL` - Para Prisma
- ✅ `NEXTAUTH_URL` - Para NextAuth
- ✅ `NEXTAUTH_SECRET` - Para NextAuth

### **Variables para Funcionalidad Completa:**
- ⚠️ `GOOGLE_CLIENT_ID` - Para login con Google
- ⚠️ `GOOGLE_CLIENT_SECRET` - Para login con Google
- ⚠️ `STRIPE_SECRET_KEY` - Para pagos
- ⚠️ `VIMEO_ACCESS_TOKEN` - Para videos

## 🎯 **ESTRATEGIA**

1. **FASE 1**: Configurar solo las variables críticas para que el build sea exitoso
2. **FASE 2**: Configurar las variables opcionales para funcionalidad completa
3. **FASE 3**: Testing y validación

## 📝 **NOTAS IMPORTANTES**

- **DATABASE_URL** es **OBLIGATORIA** durante el build
- Sin `DATABASE_URL`, Prisma no puede generar las páginas estáticas
- Las variables opcionales pueden configurarse después del deployment exitoso
- Usar valores de prueba para desarrollo y valores reales para producción

## 🚀 **PRÓXIMO PASO**

**Configurar las 4 variables críticas en Vercel Dashboard y hacer redeploy.**
