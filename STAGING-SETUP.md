# 🚀 Configuración Híbrida - CDH

## 🏗️ Arquitectura Híbrida

```
Frontend (Vercel) → clubdedesarrollohumano.com
├── 🎨 Landing page y cursos públicos
├── 👤 Dashboard usuario/afiliado
└── 🔗 Redirección admin → app.clubdedesarrollohumano.com

Backend (VPS) → app.clubdedesarrollohumano.com
├── ⚙️ Admin Panel completo
├── 🗄️ API Backend
└── 🔗 Conexión a Supabase
```

## 📋 Variables de Entorno para Frontend (Vercel)

Configura estas variables en Vercel Dashboard → Settings → Environment Variables:

```env
# Base de datos (Supabase)
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# NextAuth (Frontend)
NEXTAUTH_URL="https://clubdedesarrollohumano.com"
NEXTAUTH_SECRET="tu-secret-key-para-frontend"

# Google OAuth (Frontend)
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"

# Stripe (Frontend - claves públicas)
STRIPE_PUBLIC_KEY="pk_live_..."
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_live_..."

# Vimeo
VIMEO_ACCESS_TOKEN="tu-vimeo-token"

# Configuración de entorno
NODE_ENV="production"
```

## 🌐 Configuración DNS

### Frontend (Vercel)
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

### Backend (VPS)
```
Tipo: A
Nombre: app
Valor: IP_DEL_VPS
TTL: 3600
```

## 📝 Pasos de Configuración

### 1. Frontend (Vercel)
- **Importar proyecto** desde GitHub
- **Configurar dominio**: `clubdedesarrollohumano.com`
- **Configurar rama**: `feature/hybrid-deployment`
- **Variables de entorno**: Agregar las listadas arriba

### 2. Backend (VPS)
- **Subir proyecto** al VPS
- **Configurar dominio**: `app.clubdedesarrollohumano.com`
- **Variables de entorno**: Configurar para backend
- **Nginx + SSL**: Configurar proxy inverso

### 3. Base de Datos (Supabase)
- **Crear proyecto** en Supabase
- **Configurar conexión** desde ambos servicios
- **Ejecutar migraciones** de Prisma

## 🚀 Deploy Express con Dominios Temporales

### Frontend (Vercel)
```bash
# Usar dominio temporal de Vercel
# Ejemplo: cdh-frontend-abc123.vercel.app
```

### Backend (VPS)
```bash
# Usar IP directa temporalmente
# Ejemplo: http://123.456.789.012:3001
```

## 🧪 Testing

Una vez configurado, puedes probar en:
- **Frontend**: `https://cdh-frontend-abc123.vercel.app`
- **Backend**: `http://123.456.789.012:3001/admin`
- **Redirección**: `/admin` → Backend automáticamente
