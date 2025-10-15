# 🧪 Guía de Pretest CDH - Local

## 📋 Checklist de Verificación Pre-Test

### ✅ 1. Verificación de Entorno

#### Variables de Entorno Requeridas
Verifica que `.env` contenga:

```env
# Base de datos
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[tu-secret-generado]"

# Stripe (para pagos)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (opcional en desarrollo)
EMAIL_SERVER_HOST="smtp.ethereal.email"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="..."
EMAIL_SERVER_PASSWORD="..."
EMAIL_FROM="noreply@cdh.com"

# Node Environment
NODE_ENV="development"
```

#### Generar NEXTAUTH_SECRET (si no existe)
```bash
openssl rand -base64 32
```

---

### ✅ 2. Instalación y Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Generar cliente de Prisma
npx prisma generate

# 3. Aplicar migraciones a la base de datos
npx prisma db push

# 4. (Opcional) Ver base de datos en navegador
npx prisma studio
```

---

### ✅ 3. Usuario Demo para Testing

#### Crear usuario demo (si no existe)
```bash
node setup-demo.js
```

**Credenciales Demo:**
- **Email**: `test-oswald4993@yopmail.com`
- **Acceso**: `http://localhost:3000/demo-test`

---

### ✅ 4. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

**Servidor disponible en:** `http://localhost:3000`

---

## 🧪 Plan de Pruebas Local

### 1. Pruebas de Autenticación

#### 1.1 Login Demo ✅
- [ ] Ir a `http://localhost:3000/demo-test`
- [ ] Hacer clic en "Acceder como Usuario de Prueba"
- [ ] Verificar redirección a `/mi-cuenta`
- [ ] Verificar que aparece el nombre del usuario

#### 1.2 Logout
- [ ] Hacer clic en botón de logout (si existe)
- [ ] Verificar redirección a home

---

### 2. Pruebas de Dashboard Usuario

#### 2.1 Mi Cuenta (`/mi-cuenta`)
- [ ] Verificar que carga el dashboard
- [ ] Verificar cards de estadísticas:
  - [ ] Cursos Comprados
  - [ ] Personas Referidas
  - [ ] Mi Progreso
- [ ] Verificar sección "Datos Personales"
- [ ] Verificar sección "Información de Cuenta"

#### 2.2 Editar Perfil
- [ ] Hacer clic en botón "Editar"
- [ ] Modificar nombre
- [ ] Hacer clic en "Guardar Cambios"
- [ ] Verificar que se guarda correctamente

#### 2.3 Mis Cursos (`/mi-cuenta/mis-cursos`)
- [ ] Verificar que muestra curso de prueba
- [ ] Verificar estadísticas de cursos
- [ ] Verificar progreso del curso (0%)
- [ ] Hacer clic en "Comenzar Curso"
- [ ] Verificar redirección a página del curso

#### 2.4 Mi Progreso (`/mi-cuenta/progreso`)
- [ ] Verificar que carga la página
- [ ] Verificar estadísticas de progreso
- [ ] Verificar gráficos (si existen)

#### 2.5 Afiliados (`/mi-cuenta/afiliado`)
- [ ] Verificar que carga la página
- [ ] Verificar información de afiliado
- [ ] Verificar URL de referido
- [ ] Verificar estadísticas de comisiones

---

### 3. Pruebas de Responsive

#### 3.1 Desktop (1920x1080)
- [ ] Sidebar expandido funciona
- [ ] Botón de colapsar funciona
- [ ] Sidebar colapsado muestra tooltips
- [ ] Transiciones son suaves

#### 3.2 Tablet (768x1024)
- [ ] Header sticky aparece
- [ ] Botón de menú funciona
- [ ] Drawer se abre desde la izquierda
- [ ] Menú se cierra al seleccionar opción

#### 3.3 Mobile (375x667)
- [ ] Header sticky aparece
- [ ] Botón de menú funciona
- [ ] Drawer se abre desde la izquierda
- [ ] Contenido se adapta correctamente
- [ ] Cards se apilan verticalmente

---

### 4. Pruebas de Admin Panel

#### 4.1 Acceso al Admin
⚠️ **Nota:** Necesitas un usuario con rol `ADMIN`

```sql
-- Actualizar usuario a ADMIN en Prisma Studio
UPDATE "User" SET "userType" = 'ADMIN' WHERE email = 'tu-email@ejemplo.com';
```

#### 4.2 Dashboard Admin (`/admin`)
- [ ] Verificar que carga el dashboard
- [ ] Verificar cards de estadísticas:
  - [ ] Total Usuarios
  - [ ] Total Cursos
  - [ ] Total Compras
  - [ ] Ingresos Totales
- [ ] Verificar tabla de "Compras Recientes"

#### 4.3 Gestión de Cursos (`/admin/cursos`)
- [ ] Verificar lista de cursos
- [ ] Buscar curso por nombre
- [ ] Hacer clic en "Ver" (ojo)
- [ ] Hacer clic en "Editar" (lápiz)
- [ ] Hacer clic en "Crear Curso"

#### 4.4 Gestión de Usuarios (`/admin/usuarios`)
- [ ] Verificar lista de usuarios
- [ ] Buscar usuario por email
- [ ] Ver detalles de usuario
- [ ] Asignar sponsor
- [ ] Cambiar tipo de usuario

#### 4.5 Transacciones (`/admin/transacciones`)
- [ ] Verificar lista de transacciones
- [ ] Ver detalles de transacción

#### 4.6 Afiliados (`/admin/afiliados`)
- [ ] Verificar lista de afiliados
- [ ] Ver comisiones pendientes
- [ ] Aprobar/rechazar comisiones

#### 4.7 Responsive Admin
- [ ] Desktop: Sidebar funciona correctamente
- [ ] Tablet: Drawer funciona
- [ ] Mobile: Drawer funciona

---

### 5. Pruebas de Cursos Públicos

#### 5.1 Catálogo de Cursos (`/cursos`)
- [ ] Verificar que carga el catálogo
- [ ] Verificar que muestra cursos disponibles
- [ ] Hacer clic en un curso

#### 5.2 Detalle de Curso (`/cursos/[id]`)
- [ ] Verificar que muestra información del curso
- [ ] Verificar módulos y lecciones
- [ ] Verificar botón de compra (si no está comprado)
- [ ] Verificar acceso a lecciones (si está comprado)

#### 5.3 Reproductor de Video (`/cursos/[id]/leccion/[lessonId]`)
- [ ] Verificar que carga el reproductor Vimeo
- [ ] Verificar que reproduce el video
- [ ] Verificar botón "Marcar como completado"
- [ ] Verificar navegación entre lecciones

---

### 6. Pruebas de Estilos CDH

#### 6.1 Colores
- [ ] Primary (morado): `#312e81` se aplica correctamente
- [ ] Secondary (lavanda): `#ebd5f0` se aplica correctamente
- [ ] Todos los botones activos muestran morado
- [ ] Hover muestra morado CDH

#### 6.2 Tipografía
- [ ] Títulos usan Cinzel
- [ ] Subtítulos usan Courgette
- [ ] Texto usa Roboto

#### 6.3 Transiciones
- [ ] Todas las transiciones son suaves (200-300ms)
- [ ] Hover effects funcionan correctamente
- [ ] Animaciones de carga son fluidas

---

### 7. Pruebas de Rendimiento

#### 7.1 Tiempos de Carga
- [ ] Dashboard carga en < 2 segundos
- [ ] Páginas de admin cargan en < 2 segundos
- [ ] Navegación entre páginas es fluida

#### 7.2 Queries de Base de Datos
Revisar en terminal:
- [ ] No hay N+1 queries
- [ ] Queries están optimizadas
- [ ] No hay queries duplicadas

---

### 8. Pruebas de Errores

#### 8.1 Manejo de Errores
- [ ] Página 404 se muestra correctamente
- [ ] Errores de API se manejan bien
- [ ] Loading states aparecen correctamente
- [ ] Empty states se muestran bien

#### 8.2 Validaciones
- [ ] Formularios validan datos correctamente
- [ ] Mensajes de error son claros
- [ ] No se pueden enviar datos inválidos

---

## 🐛 Bugs Conocidos y Soluciones

### Bug 1: Hydration Error
**Síntoma:** Error de hidratación en consola
**Solución:** Ya resuelto con componentes client-side

### Bug 2: Sesión no persiste
**Síntoma:** Usuario se desloguea al recargar
**Solución:** Verificar que `NEXTAUTH_SECRET` está configurado

### Bug 3: Estilos no se aplican
**Síntoma:** Colores CDH no aparecen
**Solución:** Reiniciar servidor de desarrollo

---

## 📊 Checklist de Calidad

### Código
- [x] Sin errores de TypeScript
- [x] Sin errores de linting
- [x] Sin console.logs en producción
- [x] Tipos TypeScript completos
- [x] Validaciones implementadas

### Seguridad
- [x] Guards de autenticación implementados
- [x] Validación de datos implementada
- [x] Sanitización de inputs
- [x] Rate limiting básico
- [x] Constantes centralizadas

### UX/UI
- [x] Responsive en todos los breakpoints
- [x] Loading states implementados
- [x] Empty states implementados
- [x] Error states implementados
- [x] Transiciones suaves

### Documentación
- [x] ARCHITECTURE.md completo
- [x] PRETEST.md completo
- [x] Código comentado
- [x] Tipos documentados

---

## 🚀 Comandos Útiles

```bash
# Ver logs de Prisma
npx prisma studio

# Limpiar cache de Next.js
rm -rf .next

# Reinstalar dependencias
rm -rf node_modules && npm install

# Ver errores de build
npm run build

# Verificar tipos TypeScript
npx tsc --noEmit

# Ver linter
npm run lint
```

---

## 📱 URLs de Testing

### Públicas
- Home: `http://localhost:3000`
- Cursos: `http://localhost:3000/cursos`
- Curso Específico: `http://localhost:3000/cursos/course_test_abc`
- Demo Login: `http://localhost:3000/demo-test`

### Dashboard Usuario
- Mi Cuenta: `http://localhost:3000/mi-cuenta`
- Mis Cursos: `http://localhost:3000/mi-cuenta/mis-cursos`
- Mi Progreso: `http://localhost:3000/mi-cuenta/progreso`
- Afiliados: `http://localhost:3000/mi-cuenta/afiliado`

### Admin
- Dashboard: `http://localhost:3000/admin`
- Cursos: `http://localhost:3000/admin/cursos`
- Usuarios: `http://localhost:3000/admin/usuarios`
- Transacciones: `http://localhost:3000/admin/transacciones`
- Afiliados: `http://localhost:3000/admin/afiliados`

---

## ⚠️ Problemas Comunes

### 1. Puerto 3000 en uso
```bash
# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9
```

### 2. Error de conexión a BD
```bash
# Verificar que PostgreSQL está corriendo
# Verificar DATABASE_URL en .env
```

### 3. Prisma Client desactualizado
```bash
npx prisma generate
```

### 4. Estilos no se actualizan
```bash
# Limpiar cache y reiniciar
rm -rf .next && npm run dev
```

---

## ✅ Checklist Final Pre-Deploy

Antes de considerar el deploy:

- [ ] Todas las pruebas del plan pasan
- [ ] No hay errores en consola
- [ ] No hay warnings de TypeScript
- [ ] Build de producción funciona (`npm run build`)
- [ ] Variables de entorno documentadas
- [ ] Usuario admin creado
- [ ] Datos de prueba cargados
- [ ] Documentación actualizada

---

## 🎯 Próximos Pasos Después del Pretest

1. Corregir bugs encontrados
2. Optimizar queries lentas
3. Agregar tests automatizados
4. Preparar variables de entorno de producción
5. Configurar CI/CD
6. Preparar estrategia de deploy

---

## 📞 Soporte

Si encuentras algún problema durante el pretest:
1. Revisa la consola del navegador
2. Revisa los logs del servidor
3. Consulta ARCHITECTURE.md
4. Verifica variables de entorno

**Fecha de última actualización:** 14 de Octubre de 2025
**Versión:** 1.0.0
**Estado:** Listo para Pretest Local ✅

