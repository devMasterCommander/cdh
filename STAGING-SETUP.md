# 🚀 Configuración de Staging - CDH

## 📋 Variables de Entorno para Staging

Configura estas variables en Vercel Dashboard → Settings → Environment Variables:

```env
# Base de datos (usar instancia separada para staging)
DATABASE_URL="postgresql://usuario:password@host:5432/cdh_staging"

# NextAuth
NEXTAUTH_URL="https://staging.clubdedesarrollohumano.com"
NEXTAUTH_SECRET="tu-secret-key-para-staging"

# Google OAuth (crear credenciales separadas para staging)
GOOGLE_CLIENT_ID="tu-google-client-id-staging"
GOOGLE_CLIENT_SECRET="tu-google-client-secret-staging"

# Stripe (usar claves de test para staging)
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Vimeo
VIMEO_ACCESS_TOKEN="tu-vimeo-token"

# Configuración de entorno
NODE_ENV="production"
```

## 🌐 Configuración DNS

Agregar en tu proveedor de DNS:

```
Tipo: CNAME
Nombre: staging
Valor: cname.vercel-dns.com
TTL: 3600
```

## 📝 Pasos de Configuración

1. **Vercel Dashboard**:
   - Importar proyecto desde GitHub
   - Configurar dominio: `staging.clubdedesarrollohumano.com`
   - Configurar rama: `staging`

2. **Variables de Entorno**:
   - Agregar todas las variables listadas arriba
   - Usar credenciales separadas para staging

3. **Base de Datos**:
   - Crear instancia separada para staging
   - Ejecutar migraciones de Prisma

4. **Google OAuth**:
   - Crear proyecto separado en Google Console
   - Agregar dominio de staging a URLs autorizadas

5. **Stripe**:
   - Usar claves de test (no producción)
   - Configurar webhooks para staging

## 🔄 Deploy Automático

El staging se actualizará automáticamente cuando hagas push a la rama `staging`:

```bash
git checkout staging
git merge develop
git push origin staging
```

## 🧪 Testing

Una vez configurado, puedes probar en:
- https://staging.clubdedesarrollohumano.com
- Usar credenciales de test
- Verificar todas las funcionalidades
