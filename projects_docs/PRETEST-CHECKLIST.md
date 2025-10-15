# ✅ Checklist de Pre-Test CDH

## 🎯 Antes de Empezar

### Setup Inicial
- [ ] Ejecutar `npm run pretest` para verificar configuración
- [ ] Verificar que servidor está corriendo: `npm run dev`
- [ ] Verificar acceso a `http://localhost:3000`

---

## 🧪 Pruebas de Funcionalidad

### 1️⃣ Autenticación Demo
- [ ] Ir a `http://localhost:3000/demo-test`
- [ ] Clic en "Acceder como Usuario de Prueba"
- [ ] Verificar redirección a `/mi-cuenta`
- [ ] Verificar que muestra "test iswald"

### 2️⃣ Dashboard Usuario - Mi Cuenta
- [ ] Ver estadísticas correctas (1 curso, 0 referidos)
- [ ] Clic en card "Cursos Comprados" → navega a `/mis-cursos`
- [ ] Clic en "Editar" → formulario se abre
- [ ] Modificar nombre → clic "Guardar" → se guarda
- [ ] Clic en "Cancelar" → formulario se cierra

### 3️⃣ Dashboard Usuario - Mis Cursos
- [ ] Ver "Curso de Prueba" en la lista
- [ ] Ver progreso 0%
- [ ] Estadísticas muestran: 1 curso, 0% promedio, 0 completados
- [ ] Clic en "Comenzar Curso" → navega al curso

### 4️⃣ Dashboard Usuario - Mi Progreso
- [ ] Página carga sin errores
- [ ] Muestra estadísticas de aprendizaje

### 5️⃣ Dashboard Usuario - Afiliados
- [ ] Página carga sin errores
- [ ] Muestra información de afiliado
- [ ] Muestra URL de referido

### 6️⃣ Navegación del Dashboard Usuario
- [ ] Menú lateral muestra todas las opciones
- [ ] Opción activa está resaltada en morado
- [ ] Hover muestra morado CDH en opciones inactivas
- [ ] Clic en cada opción navega correctamente

### 7️⃣ Responsive Dashboard Usuario

#### Desktop (> 1024px)
- [ ] Sidebar visible y expandido
- [ ] Clic en botón colapsar → sidebar se reduce
- [ ] En modo colapsado, solo se ven íconos
- [ ] Transición es suave (300ms)
- [ ] Volver a expandir funciona

#### Tablet (768px - 1023px)
- [ ] Header sticky visible arriba
- [ ] Clic en botón "Menú" → drawer se abre desde izquierda
- [ ] Drawer muestra todas las opciones
- [ ] Clic en opción → navega y cierra drawer

#### Mobile (< 768px)
- [ ] Header sticky visible arriba
- [ ] Botón "Menú" visible
- [ ] Clic en "Menú" → drawer se abre desde izquierda
- [ ] Drawer ocupa ancho completo
- [ ] Clic en opción → navega y cierra drawer

### 8️⃣ Página de Curso Individual
- [ ] Ir a `http://localhost:3000/cursos/course_test_abc`
- [ ] Ver información del curso
- [ ] Ver lista de módulos y lecciones
- [ ] Clic en una lección → navega al reproductor

### 9️⃣ Reproductor de Video
- [ ] Video de Vimeo carga correctamente
- [ ] Video se puede reproducir
- [ ] Botón "Marcar como completado" funciona
- [ ] Navegación entre lecciones funciona

### 🔟 Admin Panel - Acceso

⚠️ **Nota:** Necesitas un usuario ADMIN. Ejecuta en Prisma Studio:
```sql
UPDATE "User" SET "userType" = 'ADMIN' WHERE email = 'tu-email@ejemplo.com';
```

- [ ] Logout del usuario demo
- [ ] Login con usuario admin
- [ ] Ir a `http://localhost:3000/admin`

### 1️⃣1️⃣ Admin Dashboard
- [ ] Ver estadísticas: Usuarios, Cursos, Compras, Ingresos
- [ ] Ver tabla de "Compras Recientes"
- [ ] Datos son correctos

### 1️⃣2️⃣ Admin - Gestión de Cursos
- [ ] Ir a `/admin/cursos`
- [ ] Ver lista de cursos
- [ ] Buscar curso funciona
- [ ] Clic en "Ver" (ojo) → muestra detalles
- [ ] Clic en "Editar" (lápiz) → formulario de edición
- [ ] Clic en "Crear Curso" → formulario de creación

### 1️⃣3️⃣ Admin - Gestión de Usuarios
- [ ] Ir a `/admin/usuarios`
- [ ] Ver lista de usuarios
- [ ] Buscar usuario funciona
- [ ] Clic en usuario → muestra detalles

### 1️⃣4️⃣ Admin - Transacciones
- [ ] Ir a `/admin/transacciones`
- [ ] Ver lista de transacciones
- [ ] Datos coinciden con base de datos

### 1️⃣5️⃣ Admin - Afiliados
- [ ] Ir a `/admin/afiliados`
- [ ] Ver lista de afiliados
- [ ] Ir a `/admin/afiliados/comisiones`
- [ ] Ver comisiones pendientes

### 1️⃣6️⃣ Responsive Admin Panel

#### Desktop (> 1024px)
- [ ] Sidebar visible y expandido
- [ ] Clic en chevron → sidebar se colapsa
- [ ] En modo colapsado, tooltips aparecen al hacer hover
- [ ] Transición es suave
- [ ] Volver a expandir funciona

#### Tablet/Mobile (< 1024px)
- [ ] Header sticky con logo CDH
- [ ] Clic en "Menú" → drawer se abre desde izquierda
- [ ] Drawer muestra todas las opciones
- [ ] Clic en opción → navega y cierra drawer
- [ ] Overlay oscuro aparece detrás del drawer

---

## 🎨 Pruebas de Estilos CDH

### Colores
- [ ] Morado Primary (#312e81) se aplica en:
  - [ ] Botones activos
  - [ ] Hover de botones
  - [ ] Enlaces activos
  - [ ] Iconos principales
- [ ] Lavanda Secondary (#ebd5f0) se aplica en badges y acentos
- [ ] Transiciones son de 200-300ms

### Tipografía
- [ ] Títulos (h1, h2) usan Cinzel
- [ ] Subtítulos usan Courgette
- [ ] Texto del cuerpo usa Roboto

### Componentes
- [ ] Cards tienen border-radius consistente
- [ ] Shadows son sutiles y consistentes
- [ ] Hover effects son suaves
- [ ] Loading states son elegantes

---

## 🐛 Verificación de Bugs

### Console del Navegador
- [ ] No hay errores en consola
- [ ] No hay warnings de hidratación
- [ ] No hay warnings de deprecación

### Logs del Servidor
- [ ] No hay errores en terminal
- [ ] Queries de Prisma son eficientes
- [ ] No hay N+1 queries

### Validaciones
- [ ] Formularios validan datos correctamente
- [ ] Mensajes de error son claros
- [ ] No se pueden enviar datos inválidos

---

## ✨ Checklist de Calidad Final

### Funcionalidad
- [ ] ✅ Login demo funciona
- [ ] ✅ Dashboard usuario funciona
- [ ] ✅ Dashboard admin funciona
- [ ] ✅ Responsive funciona en todos los breakpoints
- [ ] ✅ Navegación es fluida
- [ ] ✅ Progreso de cursos se guarda

### Seguridad
- [ ] ✅ Rutas protegidas requieren autenticación
- [ ] ✅ Admin routes requieren rol ADMIN
- [ ] ✅ Validaciones implementadas
- [ ] ✅ Datos se sanitizan

### UX/UI
- [ ] ✅ Estilos CDH aplicados consistentemente
- [ ] ✅ Loading states funcionan
- [ ] ✅ Empty states se muestran bien
- [ ] ✅ Error states son informativos
- [ ] ✅ Transiciones son suaves

### Código
- [ ] ✅ Sin errores de TypeScript
- [ ] ✅ Sin errores críticos de linting
- [ ] ✅ Componentes reutilizables implementados
- [ ] ✅ Utilidades de seguridad implementadas
- [ ] ✅ Documentación completa

---

## 🚀 Si Todo Está ✅

### El proyecto está listo para:
1. ✅ Testing completo en local
2. ✅ Corrección de bugs encontrados
3. ✅ Optimizaciones de rendimiento
4. ✅ Preparación para staging/producción

### Próximos Pasos:
1. Realizar todas las pruebas del checklist
2. Documentar bugs encontrados
3. Corregir bugs críticos
4. Optimizar queries lentas
5. Preparar deploy a staging

---

**Fecha:** 14 de Octubre de 2025  
**Versión:** 1.0.0-pretest  
**Estado:** ✅ LISTO PARA PRETEST

