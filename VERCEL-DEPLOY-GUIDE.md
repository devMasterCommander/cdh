# 🚀 Guía de Deploy en Vercel - CDH

> **Última actualización**: $(date)

## 📋 Pasos para Deploy Express

### 1. Acceder a Vercel Dashboard
- Ir a [vercel.com](https://vercel.com)
- Iniciar sesión con GitHub
- Click en "New Project"

### 2. Importar Proyecto
- **Repository**: `devMasterCommander/cdh`
- **Branch**: `feature/hybrid-deployment`
- **Framework Preset**: Next.js (detectado automáticamente)
- **Root Directory**: `./` (raíz del proyecto)

### 3. Configurar Variables de Entorno

En la sección "Environment Variables", agregar:

```env
# Base de datos (Supabase)
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# NextAuth
NEXTAUTH_URL=https://cdh-hybrid-abc123.vercel.app
NEXTAUTH_SECRET=tu-secret-key-para-servidor

# Google OAuth
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Stripe (claves completas)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...

# Vimeo
VIMEO_ACCESS_TOKEN=tu-vimeo-token

# Configuración
NODE_ENV=production
```

### 4. Configurar Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 5. Deploy
- Click en "Deploy"
- Esperar a que termine el build
- Obtener URL temporal: `https://cdh-hybrid-abc123.vercel.app`

## 🧪 Testing Post-Deploy

### URLs para Probar
- **Landing**: `https://cdh-hybrid-abc123.vercel.app`
- **Cursos**: `https://cdh-hybrid-abc123.vercel.app/cursos`
- **Mi Cuenta**: `https://cdh-hybrid-abc123.vercel.app/mi-cuenta`
- **Admin**: `https://cdh-hybrid-abc123.vercel.app/admin`
- **API**: `https://cdh-hybrid-abc123.vercel.app/api`

### Funcionalidades a Verificar
- ✅ Landing page carga correctamente
- ✅ Navegación entre páginas
- ✅ Sistema de autenticación
- ✅ Dashboard usuario/afiliado
- ✅ Admin panel accesible
- ✅ API endpoints funcionando
- ✅ Sistema de referidos (`/ref/:slug`)

## 🔧 Troubleshooting

### Error de Build
```bash
# Verificar logs en Vercel Dashboard
# Revisar variables de entorno
# Verificar que todas las dependencias estén instaladas
```

### Error de Base de Datos
- Verificar `DATABASE_URL` en variables de entorno
- Comprobar conectividad a Supabase
- Ejecutar migraciones si es necesario

### Error de Autenticación
- Verificar `NEXTAUTH_SECRET`
- Comprobar `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`
- Verificar URLs autorizadas en Google Console

## 📞 Soporte

- **Logs**: Vercel Dashboard → Functions → Logs
- **Build Logs**: Vercel Dashboard → Deployments → [deployment] → Build Logs
- **Environment**: Vercel Dashboard → Settings → Environment Variables

## 🎯 Próximo Paso

Una vez que el deploy funcione correctamente:
- **PC 3**: Testing y validación completa
- **PC 4**: Configuración DNS para dominio principal
