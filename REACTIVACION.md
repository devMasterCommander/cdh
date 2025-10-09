# 🚀 Guía de Reactivación del Proyecto CDH

Este documento te guiará paso a paso para reactivar el proyecto después de un período de inactividad.

## 📝 Tabla de Contenidos
1. [Reactivar Supabase](#1-reactivar-supabase)
2. [Configurar Variables de Entorno](#2-configurar-variables-de-entorno)
3. [Instalar Dependencias](#3-instalar-dependencias)
4. [Sincronizar Base de Datos](#4-sincronizar-base-de-datos)
5. [Iniciar el Proyecto](#5-iniciar-el-proyecto)
6. [Verificación](#6-verificación)

---

## 1️⃣ Reactivar Supabase

### Paso 1.1: Acceder a tu Dashboard de Supabase
1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Inicia sesión con tu cuenta
3. Busca tu proyecto **CDH** (o como lo hayas nombrado)

### Paso 1.2: Reactivar el Proyecto
- Si tu proyecto está **pausado** (plan gratuito inactivo):
  - Haz clic en el botón **"Restore"** o **"Unpause"**
  - Espera 2-5 minutos mientras Supabase reactiva la base de datos
  
- Si tu proyecto fue **eliminado**:
  - Necesitarás crear un nuevo proyecto
  - Ve a "New Project"
  - Elige un nombre, región y contraseña segura
  - Guarda la contraseña ⚠️ (la necesitarás para el DATABASE_URL)

### Paso 1.3: Obtener las Credenciales de Conexión
1. En tu proyecto de Supabase, ve a:
   - **Settings** → **Database**
2. Busca la sección **Connection string**
3. Selecciona el modo **URI** (no transaction pooler para DIRECT_URL)
4. Copia dos URLs:
   - **Session mode** (con pooler) → para `DATABASE_URL`
   - **Transaction mode** (directa) → para `DIRECT_URL`

---

## 2️⃣ Configurar Variables de Entorno

### Paso 2.1: Crear archivo .env.local
```bash
# En la raíz del proyecto
cp .env.local.example .env.local
```

### Paso 2.2: Completar las Variables

Edita `.env.local` con tus credenciales reales:

#### 🔑 Base de Datos (Supabase)
```env
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.xxx.supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[TU-PASSWORD]@db.xxx.supabase.co:5432/postgres"
```

#### 🔐 NextAuth Secret
Genera un secreto aleatorio:
```bash
openssl rand -base64 32
```
Copia el resultado en:
```env
NEXTAUTH_SECRET="el-secreto-generado"
NEXTAUTH_URL="http://localhost:3000"
```

#### 🌐 Google OAuth (Opcional pero recomendado)
1. Ve a [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Crea o selecciona un proyecto
3. Ve a **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Configura:
   - Tipo: **Web application**
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copia el Client ID y Client Secret

```env
GOOGLE_CLIENT_ID="tu-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-secret"
```

#### 💳 Stripe (Para pagos)
1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copia las claves de **Test mode**:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

3. Para el webhook secret:
   - Ve a **Developers** → **Webhooks**
   - Añade endpoint: `http://localhost:3000/api/webhooks/stripe`
   - Selecciona eventos: `checkout.session.completed`, `payment_intent.succeeded`
   - Copia el **Signing secret**

```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### 🎬 Vimeo (Para videos)
Si tienes videos en Vimeo:
1. Ve a [Vimeo Developer](https://developer.vimeo.com/apps)
2. Crea una app y genera un Access Token

```env
VIMEO_ACCESS_TOKEN="tu-token"
```

---

## 3️⃣ Instalar Dependencias

```bash
# Asegúrate de estar en la raíz del proyecto
cd /Users/danibenavidesurdaneta/Documents/GitHub/cdh

# Instalar dependencias
npm install
```

---

## 4️⃣ Sincronizar Base de Datos

### Opción A: Si la base de datos está VACÍA o es NUEVA
```bash
# Crear todas las tablas desde cero
npx prisma db push
```

### Opción B: Si la base de datos YA TENÍA datos
```bash
# Verificar el estado actual
npx prisma db pull

# Luego sincronizar el esquema
npx prisma db push
```

### Generar el Cliente de Prisma
```bash
# Siempre ejecutar después de sincronizar
npx prisma generate
```

### (Opcional) Abrir Prisma Studio para ver tus datos
```bash
npx prisma studio
# Se abrirá en http://localhost:5555
```

---

## 5️⃣ Iniciar el Proyecto

```bash
npm run dev
```

El servidor debería iniciar en: **http://localhost:3000**

---

## 6️⃣ Verificación

### ✅ Checklist de Verificación

1. **Base de datos conectada:**
   - [ ] No hay errores de conexión en la consola
   - [ ] Prisma puede conectarse (prueba con `npx prisma studio`)

2. **Autenticación funcionando:**
   - [ ] Puedes acceder a `/api/auth/signin`
   - [ ] El login con Google funciona (si lo configuraste)

3. **Página principal carga:**
   - [ ] `http://localhost:3000` carga sin errores
   - [ ] No hay errores de Prisma en la consola

4. **API Routes funcionan:**
   - [ ] `/api/progress/toggle-complete` responde
   - [ ] `/api/progress/update-time` responde

---

## 🐛 Solución de Problemas Comunes

### Error: "Can't reach database server"
- ✅ Verifica que Supabase esté activo (no pausado)
- ✅ Verifica que el `DATABASE_URL` sea correcto
- ✅ Verifica que la contraseña no tenga caracteres especiales sin codificar

### Error: "Environment variable not found: DATABASE_URL"
- ✅ Asegúrate que `.env.local` existe en la raíz
- ✅ Reinicia el servidor de desarrollo (`Ctrl+C` y `npm run dev` de nuevo)

### Error: "Invalid `prisma.xxx.findMany()` invocation"
- ✅ Ejecuta `npx prisma generate` de nuevo
- ✅ Reinicia el servidor de desarrollo

### Error: "Table does not exist"
- ✅ Ejecuta `npx prisma db push` para crear las tablas
- ✅ Verifica que estés conectado a la base de datos correcta

---

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de NextAuth](https://next-auth.js.org/)
- [Documentación de Stripe](https://stripe.com/docs)

---

## 💡 Notas Importantes

1. **Plan Gratuito de Supabase:** Los proyectos se pausan después de 7 días de inactividad. Reactivarlos es gratis.

2. **Variables de Entorno:** Nunca subas `.env.local` a Git. Ya está en `.gitignore`.

3. **Desarrollo vs Producción:** 
   - En desarrollo usa `npm run dev`
   - En producción necesitarás configurar las variables de entorno en tu plataforma de hosting (Vercel, etc.)

4. **Migraciones:** Si modificas el `schema.prisma` en el futuro:
   ```bash
   npx prisma db push  # En desarrollo
   # O
   npx prisma migrate dev --name nombre_de_la_migracion  # Recomendado
   ```

---

¡Listo! Tu proyecto debería estar funcionando nuevamente. 🎉

