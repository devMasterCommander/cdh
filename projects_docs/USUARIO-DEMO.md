# Usuario Demo - Instrucciones

Se ha implementado un sistema de login demo para pruebas rápidas del dashboard de usuario.

## 🎯 Credenciales Demo

- **Email**: `demo@cdh.com`
- **Contraseña**: `demo1234`

---

## 🚀 Opción 1: Login Automático (Recomendado)

### Paso 1: Acceder a la Página de Login Demo

1. Inicia el servidor: `npm run dev`
2. Navega a: **http://localhost:3000/demo-login**
3. La contraseña ya está preconfigurada: `demo1234`
4. Haz clic en "Iniciar Sesión"

El sistema creará automáticamente:
- Usuario demo si no existe
- Sesión válida por 1 mes
- Cookie de autenticación

---

## 🔧 Opción 2: Crear Usuario Manualmente via API

### Endpoint: `POST /api/demo/create-user`

```bash
curl -X POST http://localhost:3000/api/demo/create-user
```

Esto creará:
- Usuario: `demo@cdh.com`
- Nombre: `Usuario Demo`
- Tipo: `CUSTOMER`
- Slug de referido: `usuario-demo`

Luego accede a: **http://localhost:3000/demo-login**

---

## 🗄️ Opción 3: Inserción Directa en Base de Datos

Si prefieres crear el usuario directamente en PostgreSQL:

```sql
-- 1. Insertar usuario demo
INSERT INTO "User" (
  id,
  email,
  name,
  "emailVerified",
  "userType",
  "referralSlug",
  "createdAt",
  "updatedAt"
) VALUES (
  'demo-user-id-12345',
  'demo@cdh.com',
  'Usuario Demo',
  NOW(),
  'CUSTOMER',
  'usuario-demo',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;
```

**Nota**: Después de insertar el usuario, usa el login demo en `/demo-login`

---

## 📊 Características del Usuario Demo

El usuario demo tiene:
- ✅ `userType: CUSTOMER` (puede comprar cursos)
- ✅ `referralSlug: usuario-demo` (puede compartir enlaces de referido)
- ✅ Puede solicitar ser afiliado
- ✅ Acceso a `/mi-cuenta`, `/mi-cuenta/progreso`, `/mi-cuenta/afiliado`

---

## 🧪 Para Probar Funcionalidades Completas

### 1. Convertir en Afiliado (via BD)
```sql
UPDATE "User" 
SET "userType" = 'AFFILIATE', 
    "affiliateRequestStatus" = 'APPROVED'
WHERE email = 'demo@cdh.com';
```

### 2. Agregar Cursos de Prueba
```sql
-- Insertar compra de curso (necesitas un curso existente)
INSERT INTO "Purchase" (
  id,
  "userId",
  "courseId",
  "stripePaymentIntentId",
  "createdAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM "User" WHERE email = 'demo@cdh.com'),
  'ID_DE_CURSO_EXISTENTE',
  'demo_payment_' || gen_random_uuid(),
  NOW()
);
```

### 3. Agregar Comisiones de Prueba
```sql
-- Insertar comisión (necesitas buyer y curso existentes)
INSERT INTO "Commission" (
  id,
  amount,
  level,
  status,
  "affiliateId",
  "buyerId",
  "courseId",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  50.00,
  1,
  'APPROVED',
  (SELECT id FROM "User" WHERE email = 'demo@cdh.com'),
  'ID_COMPRADOR',
  'ID_CURSO',
  NOW(),
  NOW()
);
```

---

## ⚠️ Importante

- **Solo en Desarrollo**: El endpoint `/api/demo/create-user` está bloqueado en producción
- **Sesión Persistente**: La sesión demo dura 1 mes
- **Seguridad**: En producción, elimina o protege estos endpoints

---

## 🔗 Enlaces Rápidos

- Login Demo: http://localhost:3000/demo-login
- Mi Cuenta: http://localhost:3000/mi-cuenta
- Mi Progreso: http://localhost:3000/mi-cuenta/progreso
- Panel Afiliado: http://localhost:3000/mi-cuenta/afiliado

---

## 📝 Resumen de Archivos Creados

1. `/api/demo/create-user/route.ts` - Crea usuario demo automáticamente
2. `/api/demo/login/route.ts` - Login con contraseña fija
3. `/demo-login/page.tsx` - Página de login demo

---

**¡Listo para probar! 🎉**

Accede a http://localhost:3000/demo-login y usa la contraseña `demo1234`

