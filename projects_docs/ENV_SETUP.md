# 🔧 Configuración de Variables de Entorno

## Variables de Entorno Requeridas

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# ==================================
# Base de Datos (PostgreSQL)
# ==================================
DATABASE_URL="postgresql://usuario:password@localhost:5432/cdh_db?schema=public"

# ==================================
# NextAuth.js
# ==================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[genera-con-openssl-rand-base64-32]"

# ==================================
# Stripe (Pagos)
# ==================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# ==================================
# Email (SMTP) - Opcional en desarrollo
# ==================================
EMAIL_SERVER_HOST="smtp.ethereal.email"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="tu-usuario"
EMAIL_SERVER_PASSWORD="tu-password"
EMAIL_FROM="noreply@cdh.com"

# ==================================
# Node Environment
# ==================================
NODE_ENV="development"
```

## Generar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Configurar Stripe (Testing)

1. Ir a https://dashboard.stripe.com/test/apikeys
2. Copiar "Publishable key" → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copiar "Secret key" → `STRIPE_SECRET_KEY`
4. Para webhooks:
   - Ir a https://dashboard.stripe.com/test/webhooks
   - Crear webhook para `http://localhost:3000/api/webhooks/stripe`
   - Copiar "Signing secret" → `STRIPE_WEBHOOK_SECRET`

## Email de Testing (Ethereal)

1. Ir a https://ethereal.email
2. Crear una cuenta de testing
3. Copiar credenciales SMTP al `.env`

**Nota:** En desarrollo local, puedes usar el login demo que no requiere email.

