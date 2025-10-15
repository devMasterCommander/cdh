# 🏗️ Arquitectura Desacoplada CDH

## 📊 Esquema de Separación

### **🖥️ VPS OVH (Backend + Admin)**
```
cdh-backend/
├── src/
│   ├── api/           # API Routes (Next.js API)
│   ├── admin/         # Panel de administración
│   ├── lib/           # Lógica de negocio
│   └── prisma/        # Base de datos
├── package.json
└── vercel.json        # Para deploy en VPS
```

**Responsabilidades:**
- ✅ API REST completa
- ✅ Panel de administración
- ✅ Lógica de negocio (comisiones, pagos, etc.)
- ✅ Base de datos PostgreSQL
- ✅ Webhooks de Stripe
- ✅ Autenticación NextAuth

### **🌐 Vercel (Frontend Público)**
```
cdh-frontend/
├── src/
│   ├── app/
│   │   ├── (public)/  # Páginas públicas
│   │   ├── auth/      # Autenticación
│   │   └── api/       # Proxy a backend
│   └── components/    # UI Components
├── package.json
└── vercel.json
```

**Responsabilidades:**
- ✅ Landing page
- ✅ Catálogo de cursos
- ✅ Dashboard de usuario/afiliado
- ✅ Proceso de compra
- ✅ Páginas de autenticación

## 🔗 Comunicación entre Servicios

### **API Endpoints (VPS → Vercel)**
```typescript
// Frontend hace llamadas a:
const API_BASE = process.env.NEXT_PUBLIC_API_URL; // VPS URL

// Ejemplos:
GET  ${API_BASE}/api/courses
POST ${API_BASE}/api/auth/signin
GET  ${API_BASE}/api/user/profile
POST ${API_BASE}/api/checkout/create-session
```

### **Variables de Entorno**

**Frontend (Vercel):**
```env
NEXT_PUBLIC_API_URL=https://api.clubdedesarrollohumano.com
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
NEXTAUTH_URL=https://clubdedesarrollohumano.com
```

**Backend (VPS):**
```env
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXTAUTH_SECRET=...
```

## 🚀 Plan de Migración

### **Fase 1: Separar Backend**
1. Crear `cdh-backend` con admin + API
2. Mover lógica de negocio al VPS
3. Configurar dominio: `api.clubdedesarrollohumano.com`

### **Fase 2: Crear Frontend**
1. Crear `cdh-frontend` solo con UI pública
2. Configurar llamadas API al backend
3. Deploy en Vercel: `clubdedesarrollohumano.com`

### **Fase 3: Optimización**
1. Implementar caché en frontend
2. Optimizar llamadas API
3. Configurar CDN si es necesario

## 💰 Beneficios Económicos

- **VPS OVH**: ~€5-15/mes (control total)
- **Vercel**: Plan gratuito (frontend estático)
- **Total**: ~€5-15/mes vs €50-200/mes en Vercel Pro

## 🔒 Beneficios Técnicos

- **Control total** del backend y base de datos
- **Escalabilidad independiente** de cada servicio
- **Seguridad mejorada** (API separada)
- **Desarrollo independiente** de frontend/backend
- **Backup y mantenimiento** controlado
