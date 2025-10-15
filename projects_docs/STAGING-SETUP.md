# 🚀 Configuración Híbrida - CDH

## 🏗️ Arquitectura Híbrida (FASE 1)

```
UN SOLO SERVIDOR (Vercel) → clubdedesarrollohumano.com
├── 🎨 Landing page y cursos públicos
├── 👤 Dashboard usuario/afiliado (/mi-cuenta)
├── ⚙️ Admin Panel (/admin)
├── 🗄️ API Backend (/api)
└── 🔗 Conexión a Supabase

FASE 2 (FUTURO): Separación progresiva
├── Frontend → Vercel
└── Backend → VPS
```

## 📋 Variables de Entorno para Servidor Completo (Vercel)

Configura estas variables en Vercel Dashboard → Settings → Environment Variables:

```env
# Base de datos (Supabase)
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# NextAuth (Servidor completo)
NEXTAUTH_URL="https://clubdedesarrollohumano.com"
NEXTAUTH_SECRET="tu-secret-key-para-servidor"

# Google OAuth (Servidor completo)
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"

# Stripe (Servidor completo - claves completas)
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_live_..."

# Vimeo
VIMEO_ACCESS_TOKEN="tu-vimeo-token"

# Configuración de entorno
NODE_ENV="production"
```

## 🌐 Configuración DNS

### Servidor Completo (Vercel)
```
Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com
TTL: 3600

Tipo: A
Nombre: @
Valor: 76.76.19.61
TTL: 3600
```

## 📝 Pasos de Configuración

### 1. Servidor Completo (Vercel)
- **Importar proyecto** desde GitHub
- **Configurar dominio**: `clubdedesarrollohumano.com`
- **Configurar rama**: `feature/hybrid-deployment`
- **Variables de entorno**: Agregar las listadas arriba

### 2. Base de Datos (Supabase)
- **Crear proyecto** en Supabase
- **Configurar conexión** desde Vercel
- **Ejecutar migraciones** de Prisma

### 3. Google OAuth
- **Configurar dominio** en Google Console
- **Agregar URLs autorizadas**: `clubdedesarrollohumano.com`

### 4. Stripe
- **Configurar webhooks** para `clubdedesarrollohumano.com`
- **Usar claves de producción**

## 🚀 Deploy Express con Dominio Temporal

### Servidor Completo (Vercel)
```bash
# Usar dominio temporal de Vercel
# Ejemplo: cdh-hybrid-abc123.vercel.app
```

## 🧪 Testing

Una vez configurado, puedes probar en:
- **Landing**: `https://cdh-hybrid-abc123.vercel.app`
- **Cursos**: `https://cdh-hybrid-abc123.vercel.app/cursos`
- **Mi Cuenta**: `https://cdh-hybrid-abc123.vercel.app/mi-cuenta`
- **Admin**: `https://cdh-hybrid-abc123.vercel.app/admin`
- **API**: `https://cdh-hybrid-abc123.vercel.app/api`

## 🔄 FASE 2: Separación Progresiva (FUTURO)

Cuando esté listo para separar:
1. **Frontend** → Vercel (mantener)
2. **Backend** → VPS (migrar)
3. **Configurar** redirecciones
