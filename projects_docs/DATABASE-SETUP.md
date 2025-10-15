# 🗄️ Configuración de Base de Datos - CDH

## 📋 Pasos para conectar la base de datos

### 1. Crear proyecto en Supabase

1. **Ir a [supabase.com](https://supabase.com)**
2. **Crear cuenta o iniciar sesión**
3. **Crear nuevo proyecto**:
   - Nombre: `cdh-database`
   - Contraseña: Generar una segura (guardarla)
   - Región: `us-east-1` (más cerca de Vercel)

### 2. Obtener URL de conexión

1. **Ir a Settings → Database**
2. **Copiar "Connection string"**
3. **Formato**: `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`

### 3. Configurar en Vercel

1. **Ir a Vercel Dashboard**
2. **Seleccionar proyecto `cdh`**
3. **Settings → Environment Variables**
4. **Agregar variables**:
   - `DATABASE_URL`: La URL de conexión de Supabase
   - `DIRECT_URL`: La misma URL (para migraciones)

### 4. Ejecutar migraciones

Una vez configurada la base de datos, ejecutar:

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# Opcional: Ver datos
npx prisma studio
```

### 5. Verificar conexión

- Probar demo login: `/demo-login`
- Verificar admin panel: `/admin`
- Probar funcionalidades de base de datos

## 🔧 Variables de entorno necesarias

```env
# Base de datos
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="https://cdh-mxnb4i66z-qubit-clouds-projects.vercel.app"
NEXTAUTH_SECRET="tu-secret-key-aqui"

# Stripe (opcional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."
```

## 🚀 URLs de prueba

- **Demo Login**: `https://cdh-mxnb4i66z-qubit-clouds-projects.vercel.app/demo-login`
- **Admin Panel**: `https://cdh-mxnb4i66z-qubit-clouds-projects.vercel.app/admin`
- **Mi Cuenta**: `https://cdh-mxnb4i66z-qubit-clouds-projects.vercel.app/mi-cuenta`
