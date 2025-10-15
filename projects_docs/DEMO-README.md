# 🎭 Usuario Demo - Acceso Rápido

## 🚀 Inicio Rápido (3 pasos)

### 1. Inicia el servidor
```bash
npm run dev
```

### 2. Configura el usuario demo
```bash
npm run setup:demo
```

### 3. Accede al login demo
Abre en tu navegador: **http://localhost:3000/demo-login**

---

## 🔑 Credenciales Demo

```
Email: demo@cdh.com
Contraseña: demo1234
```

---

## 📍 Páginas Disponibles

Una vez autenticado, podrás acceder a:

| Página | URL | Descripción |
|--------|-----|-------------|
| **Mi Perfil** | `/mi-cuenta` | Datos personales y estadísticas |
| **Mis Cursos** | `/mis-cursos` | Cursos comprados |
| **Mi Progreso** | `/mi-cuenta/progreso` | Dashboard de aprendizaje |
| **Panel Afiliado** | `/mi-cuenta/afiliado` | Métricas y referidos |

---

## 🛠️ Opciones de Setup

### Opción 1: Script npm (Recomendado)
```bash
npm run setup:demo
```

### Opción 2: Script Shell (Mac/Linux)
```bash
./setup-demo.sh
```

### Opción 3: Script Node.js manual
```bash
node setup-demo.js
```

### Opción 4: Endpoint API directo
```bash
curl -X POST http://localhost:3000/api/demo/create-user
```

---

## 🎯 Características del Usuario Demo

El usuario viene configurado con:

- ✅ **Tipo**: `CUSTOMER` (puede comprar cursos)
- ✅ **Slug de referido**: `usuario-demo`
- ✅ **Puede solicitar ser afiliado**
- ✅ **Acceso completo al dashboard**

---

## 🧪 Para Pruebas Avanzadas

### Convertir en Afiliado

Ejecuta en tu BD (PostgreSQL):

```sql
UPDATE "User" 
SET "userType" = 'AFFILIATE', 
    "affiliateRequestStatus" = 'APPROVED'
WHERE email = 'demo@cdh.com';
```

### Agregar Curso de Prueba

```sql
INSERT INTO "Purchase" (
  id,
  "userId",
  "courseId",
  "stripePaymentIntentId",
  "createdAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM "User" WHERE email = 'demo@cdh.com'),
  'TU_COURSE_ID',
  'demo_payment_' || gen_random_uuid(),
  NOW()
);
```

---

## 📂 Archivos Creados

```
/demo-login/page.tsx              - Página de login demo
/api/demo/login/route.ts          - Endpoint de autenticación
/api/demo/create-user/route.ts    - Endpoint de creación de usuario
/setup-demo.sh                    - Script bash
/setup-demo.js                    - Script Node.js
/USUARIO-DEMO.md                  - Documentación completa
/DEMO-README.md                   - Este archivo
```

---

## ⚠️ Notas Importantes

- ⚙️ **Solo en desarrollo**: Los endpoints demo están bloqueados en producción
- 🔒 **Sesión persistente**: La sesión dura 1 mes
- 🧹 **Limpieza**: Elimina estos endpoints antes de producción

---

## 🔗 Enlaces Directos

- 🔐 Login Demo: http://localhost:3000/demo-login
- 👤 Mi Cuenta: http://localhost:3000/mi-cuenta
- 📊 Mi Progreso: http://localhost:3000/mi-cuenta/progreso
- 🌟 Panel Afiliado: http://localhost:3000/mi-cuenta/afiliado
- 📚 Mis Cursos: http://localhost:3000/mis-cursos
- 🏠 Catálogo: http://localhost:3000/cursos

---

**¿Problemas?** Consulta `USUARIO-DEMO.md` para instrucciones detalladas.

