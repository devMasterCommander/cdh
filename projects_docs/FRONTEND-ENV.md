# 🌐 Variables de Entorno - Frontend (Vercel)

## 📋 Configuración para Vercel Dashboard

Agrega estas variables en Vercel Dashboard → Settings → Environment Variables:

### **🔗 API Backend**
```env
NEXT_PUBLIC_API_URL=https://api.clubdedesarrollohumano.com
```

### **🔐 Autenticación**
```env
NEXTAUTH_URL=https://clubdedesarrollohumano.com
NEXTAUTH_SECRET=tu-secret-key-para-frontend
```

### **💳 Stripe (Solo claves públicas)**
```env
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
```

### **🎥 Vimeo (Solo para frontend)**
```env
NEXT_PUBLIC_VIMEO_ACCESS_TOKEN=tu-vimeo-token
```

### **🌍 Entorno**
```env
NODE_ENV=production
```

## 🔄 Comunicación Frontend → Backend

El frontend hará llamadas HTTP al backend usando:

```typescript
// Ejemplo de uso
import { apiClient } from '@/lib/api-client';

// Obtener cursos
const courses = await apiClient.getCourses();

// Crear sesión de checkout
const session = await apiClient.createCheckoutSession(courseId);
```

## 🚀 Deploy en Vercel

1. **Conectar repositorio**: `cdh-frontend`
2. **Configurar dominio**: `clubdedesarrollohumano.com`
3. **Variables de entorno**: Agregar las listadas arriba
4. **Deploy automático**: Cada push a `main`

## 🔒 Seguridad

- ✅ Solo claves públicas en frontend
- ✅ API calls a través de HTTPS
- ✅ CORS configurado en backend
- ✅ Autenticación manejada por backend
