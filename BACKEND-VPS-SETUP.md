# ⚙️ Configuración Backend VPS - CDH

## 🏗️ Arquitectura Backend

```
app.clubdedesarrollohumano.com (VPS OVH)
├── ⚙️ Admin Panel completo
├── 🗄️ API Backend
├── 🔗 Conexión a Supabase
└── 🔒 SSL con Let's Encrypt
```

## 📋 Variables de Entorno para Backend (VPS)

Crear archivo `.env.local` en el VPS:

```env
# Base de datos (Supabase)
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# NextAuth (Backend)
NEXTAUTH_URL="https://app.clubdedesarrollohumano.com"
NEXTAUTH_SECRET="tu-secret-key-para-backend"

# Google OAuth (Backend)
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"

# Stripe (Backend - claves completas)
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Vimeo
VIMEO_ACCESS_TOKEN="tu-vimeo-token"

# Configuración VPS
NODE_ENV="production"
PORT=3001
```

## 🚀 Pasos de Instalación en VPS

### 1. Preparar VPS
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx
sudo apt install nginx -y

# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Configurar Proyecto
```bash
# Crear directorio
sudo mkdir -p /var/www/app.clubdedesarrollohumano.com
sudo chown -R $USER:$USER /var/www/app.clubdedesarrollohumano.com

# Subir archivos (desde local)
scp -r ./* usuario@tu-vps:/var/www/app.clubdedesarrollohumano.com/

# En el VPS
cd /var/www/app.clubdedesarrollohumano.com
npm install
cp .env.vps.example .env.local
nano .env.local  # Configurar variables
```

### 3. Configurar Nginx
```bash
# Crear configuración
sudo nano /etc/nginx/sites-available/app.clubdedesarrollohumano.com
```

```nginx
server {
    listen 80;
    server_name app.clubdedesarrollohumano.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.clubdedesarrollohumano.com;
    
    ssl_certificate /etc/letsencrypt/live/app.clubdedesarrollohumano.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.clubdedesarrollohumano.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. Configurar SSL
```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/app.clubdedesarrollohumano.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Obtener certificado SSL
sudo certbot --nginx -d app.clubdedesarrollohumano.com
```

### 5. Iniciar Aplicación
```bash
# Construir proyecto
npm run build

# Crear configuración PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'cdh-backend',
    script: 'server.js',
    cwd: '/var/www/app.clubdedesarrollohumano.com',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
EOF

# Iniciar con PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🧪 Testing Backend

Una vez configurado:
- **Admin Panel**: `https://app.clubdedesarrollohumano.com/admin`
- **API**: `https://app.clubdedesarrollohumano.com/api`
- **Health Check**: `https://app.clubdedesarrollohumano.com/api/health`

## 🔧 Monitoreo

```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs cdh-backend

# Reiniciar
pm2 restart cdh-backend
```
