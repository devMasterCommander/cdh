# 🖥️ Variables de Entorno - Backend (VPS OVH)

## 📋 Configuración para VPS

Agrega estas variables en tu VPS OVH (archivo `.env.local`):

### **🗄️ Base de Datos**
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/cdh_production"
```

### **🔐 NextAuth**
```env
NEXTAUTH_URL=https://api.clubdedesarrollohumano.com
NEXTAUTH_SECRET=tu-secret-key-para-backend
```

### **🔑 Google OAuth**
```env
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
```

### **💳 Stripe (Claves completas)**
```env
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### **🎥 Vimeo**
```env
VIMEO_ACCESS_TOKEN=tu-vimeo-token
```

### **🌍 Entorno**
```env
NODE_ENV=production
PORT=3001
```

## 🚀 Deploy en VPS OVH

### **1. Configurar Nginx (Proxy Reverso)**
```nginx
server {
    listen 80;
    server_name api.clubdedesarrollohumano.com;
    
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

### **2. Configurar SSL (Let's Encrypt)**
```bash
sudo certbot --nginx -d api.clubdedesarrollohumano.com
```

### **3. Configurar PM2 (Process Manager)**
```bash
npm install -g pm2
pm2 start npm --name "cdh-backend" -- start
pm2 save
pm2 startup
```

### **4. Configurar Auto-Deploy**
```bash
# Script de deploy automático
#!/bin/bash
cd /var/www/cdh-backend
git pull origin main
npm install
npm run build
pm2 restart cdh-backend
```

## 🔒 Seguridad

- ✅ Todas las claves secretas en backend
- ✅ CORS configurado para frontend
- ✅ Rate limiting en API
- ✅ Validación de webhooks
- ✅ Backup automático de BD

## 📊 Monitoreo

- ✅ PM2 para gestión de procesos
- ✅ Logs centralizados
- ✅ Monitoreo de recursos
- ✅ Alertas de errores
