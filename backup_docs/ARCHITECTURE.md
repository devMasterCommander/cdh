# Arquitectura del Proyecto CDH

## 📋 Índice

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Arquitectura de Seguridad](#arquitectura-de-seguridad)
3. [Componentes Reutilizables](#componentes-reutilizables)
4. [Utilidades y Helpers](#utilidades-y-helpers)
5. [Tipos TypeScript](#tipos-typescript)
6. [API Routes](#api-routes)
7. [Mejores Prácticas](#mejores-prácticas)

---

## 🏗️ Estructura del Proyecto

```
cdh/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (public)/          # Rutas públicas
│   │   │   ├── cursos/        # Catálogo y detalle de cursos
│   │   │   ├── mi-cuenta/     # Dashboard de usuarios
│   │   │   └── mis-cursos/    # Cursos del usuario
│   │   ├── admin/             # Panel de administración
│   │   └── api/               # API Routes
│   │
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes de UI (shadcn/ui)
│   │   │   ├── dashboard-card.tsx      # Card de estadísticas
│   │   │   ├── loading-state.tsx       # Estados de carga
│   │   │   ├── empty-state.tsx         # Estados vacíos
│   │   │   ├── error-boundary.tsx      # Manejo de errores
│   │   │   └── cdh-layout.tsx          # Layout del dashboard
│   │   ├── admin/            # Componentes específicos de admin
│   │   └── public/           # Componentes públicos
│   │
│   ├── lib/                   # Utilidades y helpers
│   │   ├── constants.ts      # Constantes centralizadas
│   │   ├── security.ts       # Utilidades de seguridad
│   │   ├── validators.ts     # Validadores de datos
│   │   ├── api-response.ts   # Respuestas API estandarizadas
│   │   └── prisma.ts         # Cliente de Prisma
│   │
│   ├── types/                 # Tipos TypeScript compartidos
│   │   └── index.ts
│   │
│   ├── hooks/                 # Custom React Hooks
│   │   └── use-mobile.ts     # Hook para detección responsive
│   │
│   └── middleware.ts          # Middleware de Next.js
│
├── prisma/
│   └── schema.prisma          # Schema de base de datos
│
├── public/                    # Assets estáticos
│
└── .cursor/                   # Reglas de Cursor AI
    └── rules/
```

---

## 🔒 Arquitectura de Seguridad

### Archivos Clave

#### `src/lib/constants.ts`
Define todas las constantes del proyecto:
- Rutas y navegación
- Roles y permisos
- Estados de comisiones
- Configuración de cookies
- Reglas de validación
- Mensajes de error

#### `src/lib/security.ts`
Proporciona funciones de seguridad:

**Validación de Sesión:**
```typescript
await getCurrentSession()         // Obtiene sesión actual
await isAuthenticated()           // Verifica autenticación
await getCurrentUserId()          // Obtiene ID del usuario
```

**Validación de Roles:**
```typescript
await hasRole(USER_TYPES.ADMIN)  // Verifica rol específico
await isAdmin()                   // Verifica si es admin
await isAffiliateOrAdmin()        // Verifica afiliado o admin
```

**Guards de Ruta (para API Routes):**
```typescript
await requireAuth()               // Requiere autenticación
await requireAdmin()              // Requiere rol de admin
await requireAffiliate()          // Requiere afiliado o superior
await requireCustomer()           // Requiere customer o superior
await requireOwnershipOrAdmin(userId) // Verifica propiedad o admin
```

**Rate Limiting:**
```typescript
isRateLimited(ip, limit, windowMs) // Control de tasa de peticiones
```

#### `src/lib/validators.ts`
Validadores centralizados:

```typescript
validateEmail(email)              // Valida email
validateName(name)                // Valida nombre
validateCourseName(courseName)    // Valida nombre de curso
validatePrice(price)              // Valida precio
validateReferralSlug(slug)        // Valida slug de referido
validateId(id)                    // Valida ID

// Validadores de objetos completos
validateUserCreate(data)
validateCourseCreate(data)
validateProgressUpdate(data)
```

#### `src/lib/api-response.ts`
Respuestas API estandarizadas:

**Respuestas de Éxito:**
```typescript
successResponse(data, message)    // 200 OK
createdResponse(data, message)    // 201 Created
deletedResponse()                 // 204 No Content
```

**Respuestas de Error:**
```typescript
badRequestResponse(error)         // 400 Bad Request
unauthorizedResponse(error)       // 401 Unauthorized
forbiddenResponse(error)          // 403 Forbidden
notFoundResponse(error)           // 404 Not Found
conflictResponse(error)           // 409 Conflict
rateLimitResponse(error)          // 429 Too Many Requests
internalErrorResponse(error)      // 500 Internal Server Error
```

**Wrappers de Ruta:**
```typescript
withErrorHandling(handler)        // Añade manejo de errores
withAuth(handler)                 // Añade autenticación
```

---

## 🧩 Componentes Reutilizables

### `DashboardCard`
Card reutilizable para estadísticas:

```tsx
<DashboardCard
  title="Total Usuarios"
  value={100}
  description="Usuarios registrados"
  icon={Users}
  href="/admin/usuarios"
  variant="default"
/>
```

### `LoadingState`
Estados de carga unificados:

```tsx
// Gradiente CDH
<LoadingState variant="gradient" text="Cargando..." />

// Spinner simple
<LoadingState variant="spinner" text="Procesando..." />

// Skeletons
<LoadingState variant="skeleton" />

// Spinner inline
<LoadingSpinner />

// Overlay
<LoadingOverlay text="Guardando..." />
```

### `EmptyState`
Estados vacíos elegantes:

```tsx
<EmptyState
  icon={BookOpen}
  title="No hay cursos"
  description="Aún no has comprado ningún curso"
  actionLabel="Ver Cursos"
  actionHref="/cursos"
/>
```

### `ErrorBoundary`
Captura errores de React:

```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// O con estado de error personalizado
<ErrorState
  title="Error al cargar"
  message="No se pudieron cargar los datos"
  onRetry={() => refetch()}
/>
```

---

## 🛠️ Utilidades y Helpers

### Middleware
**`src/middleware.ts`**
- Captura referidos desde URLs `/ref/{slug}`
- Establece cookie de referido por 30 días
- Se ejecuta en todas las rutas excepto API y assets estáticos

### Hooks Personalizados

#### `useIsMobile`
```typescript
const isMobile = useIsMobile(); // Detecta si es móvil (< 768px)
```

---

## 📝 Tipos TypeScript

### Tipos de Usuario
```typescript
UserWithCounts          // Usuario con contadores
UserWithRelations       // Usuario con relaciones completas
```

### Tipos de Curso
```typescript
CourseWithModules       // Curso con módulos
CourseWithDetails       // Curso con detalles completos
Module                  // Módulo con lecciones
Lesson                  // Lección individual
```

### Tipos de Progreso
```typescript
LessonProgressWithLesson    // Progreso con lección
CourseProgress              // Progreso del curso
PurchaseWithProgress        // Compra con progreso
```

### Tipos de API
```typescript
ApiSuccess<T>           // Respuesta exitosa
ApiError                // Respuesta de error
ApiResponse<T>          // Unión de ambas
PaginatedResponse<T>    // Respuesta paginada
```

---

## 🚀 API Routes

### Estructura Recomendada

```typescript
import { withErrorHandling } from "@/lib/api-response";
import { requireAuth } from "@/lib/security";
import { validateEmail } from "@/lib/validators";
import { successResponse, badRequestResponse } from "@/lib/api-response";

export const POST = withErrorHandling(async (request: Request) => {
  // 1. Verificar autenticación
  await requireAuth();

  // 2. Parsear y validar datos
  const body = await request.json();
  const emailValidation = validateEmail(body.email);
  
  if (!emailValidation.success) {
    return badRequestResponse(emailValidation.error);
  }

  // 3. Lógica de negocio
  const result = await someBusinessLogic();

  // 4. Retornar respuesta
  return successResponse(result, "Operación exitosa");
});
```

---

## ✅ Mejores Prácticas

### 1. Seguridad

- **SIEMPRE** usar `requireAuth()` en rutas protegidas
- **SIEMPRE** validar datos de entrada con `validators.ts`
- **NUNCA** confiar en datos del cliente
- Usar rate limiting en endpoints sensibles
- Sanitizar inputs antes de guardar en BD

### 2. Manejo de Errores

- Usar `withErrorHandling()` en todas las API routes
- Capturar errores específicos antes de genéricos
- No exponer detalles técnicos en producción
- Usar `ErrorBoundary` en componentes React
- Loggear errores para debugging

### 3. Validación de Datos

```typescript
// ❌ MAL: Sin validación
const price = body.price;

// ✅ BIEN: Con validación
const priceValidation = validatePrice(body.price);
if (!priceValidation.success) {
  return badRequestResponse(priceValidation.error);
}
const price = priceValidation.data;
```

### 4. Respuestas API

```typescript
// ❌ MAL: Respuesta inconsistente
return NextResponse.json({ data: result });

// ✅ BIEN: Respuesta estandarizada
return successResponse(result, "Operación exitosa");
```

### 5. Tipos TypeScript

```typescript
// ❌ MAL: any
const user: any = await getUser();

// ✅ BIEN: Tipado específico
const user: UserWithCounts = await getUser();
```

### 6. Componentes

```typescript
// ❌ MAL: Componente grande y monolítico
<div className="p-4">
  {loading ? <Spinner /> : content}
</div>

// ✅ BIEN: Componentes reutilizables
<LoadingState variant="spinner">
  {content}
</LoadingState>
```

### 7. Constantes

```typescript
// ❌ MAL: Strings hardcodeadas
if (user.type === "ADMIN") { ... }

// ✅ BIEN: Constantes centralizadas
if (user.type === USER_TYPES.ADMIN) { ... }
```

---

## 🔄 Flujo de Trabajo Típico

### Crear una Nueva Ruta API Protegida

1. Importar utilidades necesarias
2. Usar `withErrorHandling()` como wrapper
3. Validar autenticación con `requireAuth()`
4. Validar datos con `validators.ts`
5. Ejecutar lógica de negocio
6. Retornar respuesta estandarizada

### Crear una Nueva Página

1. Verificar sesión en el componente
2. Usar `LoadingState` para carga
3. Usar `EmptyState` para datos vacíos
4. Usar `ErrorState` para errores
5. Envolver en `ErrorBoundary`
6. Usar tipos compartidos

---

## 📚 Referencias

- **Next.js 15**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **shadcn/ui**: https://ui.shadcn.com
- **NextAuth.js**: https://next-auth.js.org
- **TypeScript**: https://www.typescriptlang.org/docs

