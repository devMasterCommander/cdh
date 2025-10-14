# 🧪 Guía de Acceso - Usuario de Prueba

## 👤 **Usuario de Prueba: test-oswald4993@yopmail.com**

Este usuario tiene un curso comprado para probar el reproductor de video y el sistema de progreso.

---

## 🚀 **Método 1: Login Demo Rápido (RECOMENDADO)**

### Paso 1: Acceder a la página de login demo
```
http://localhost:3000/demo-test
```

### Paso 2: Click en "Acceder como Usuario de Prueba"
- El email ya está pre-cargado: `test-oswald4993@yopmail.com`
- Solo haz click en el botón

### Paso 3: Serás redirigido automáticamente
- ✅ Sesión iniciada
- ✅ Redirigido a `/mi-cuenta/mis-cursos`
- ✅ Listo para probar

**⏱️ Tiempo total: ~5 segundos**

---

## 📧 **Método 2: Login Normal con Email**

### Paso 1: Ir a la página de login
```
http://localhost:3000/auth/signin
```

### Paso 2: Ingresar el email
```
test-oswald4993@yopmail.com
```

### Paso 3: Ir a Yopmail
```
https://yopmail.com/
```
- Ingresa: `test-oswald4993`
- Busca el email de NextAuth
- Click en el enlace mágico

### Paso 4: Serás redirigido
- ✅ Sesión iniciada
- ✅ Acceso completo

**⏱️ Tiempo total: ~30 segundos**

---

## 🎯 **Qué Probar con Este Usuario**

### 1. **Dashboard de Usuario**
```
http://localhost:3000/mi-cuenta
```
- ✅ Ver perfil con datos del usuario
- ✅ Ver estadísticas de cursos comprados
- ✅ Editar información personal

### 2. **Mis Cursos**
```
http://localhost:3000/mi-cuenta/mis-cursos
```
- ✅ Ver curso(s) comprado(s)
- ✅ Ver progreso de cada curso
- ✅ Acceder a las lecciones

### 3. **Mi Progreso**
```
http://localhost:3000/mi-cuenta/progreso
```
- ✅ Ver estadísticas de aprendizaje
- ✅ Ver lecciones vistas recientemente
- ✅ Ver progreso por curso

### 4. **Reproductor de Video**
```
Desde /mi-cuenta/mis-cursos → Click en "Continuar Curso" → Click en una lección
```
- ✅ Reproductor de Vimeo cargando
- ✅ Botón "Marcar como Completada" (morado)
- ✅ Progreso guardándose automáticamente
- ✅ Video reanuda desde donde se quedó

### 5. **Programa de Afiliados**
```
http://localhost:3000/mi-cuenta/afiliado
```
- ✅ Ver estado de afiliado
- ✅ Solicitar ser afiliado (si no lo es)
- ✅ Ver comisiones (si es afiliado)

---

## 🔧 **Archivos Técnicos**

### Página de Login Demo
- **Ruta**: `src/app/demo-test/page.tsx`
- **URL**: `http://localhost:3000/demo-test`

### API de Token
- **Ruta**: `src/app/api/demo/create-test-token/route.ts`
- **Método**: POST
- **Body**: `{ email: "test-oswald4993@yopmail.com" }`

---

## 🎨 **Estilos Aplicados**

La página de login demo usa:
- ✅ Header con gradiente primary (morado oscuro)
- ✅ Botón primary para acceder
- ✅ Card de información con borde primary
- ✅ Iconos Lucide React
- ✅ Tipografía Cinzel en título
- ✅ Responsive design

---

## ⚠️ **Importante**

### Seguridad
- ⚠️ **Solo funciona en desarrollo** (`NODE_ENV === "development"`)
- ⚠️ **NO usar en producción**
- ⚠️ El token expira en 10 minutos

### Verificación
- ✅ El usuario debe existir en la base de datos
- ✅ El usuario debe tener al menos un curso comprado
- ✅ Las variables de entorno deben estar configuradas

---

## 🔍 **Verificar Estado del Usuario**

### Consulta SQL (Opcional)
```sql
SELECT 
  u.id, 
  u.name, 
  u.email, 
  u.userType,
  COUNT(DISTINCT p.id) as total_purchases,
  COUNT(DISTINCT lp.id) as total_progress
FROM "User" u
LEFT JOIN "Purchase" p ON p.userId = u.id
LEFT JOIN "LessonProgress" lp ON lp.userId = u.id
WHERE u.email = 'test-oswald4993@yopmail.com'
GROUP BY u.id;
```

### Verificar Cursos Comprados
```sql
SELECT 
  c.name as curso,
  p.createdAt as fecha_compra
FROM "Purchase" p
JOIN "Course" c ON c.id = p.courseId
JOIN "User" u ON u.id = p.userId
WHERE u.email = 'test-oswald4993@yopmail.com';
```

---

## 📋 **Resumen de Acceso**

| Método | URL | Tiempo | Complejidad |
|--------|-----|--------|-------------|
| **Demo Rápido** | `/demo-test` | ~5s | ⭐ Fácil |
| **Email Normal** | `/auth/signin` | ~30s | ⭐⭐ Medio |
| **Yopmail Directo** | `yopmail.com` | ~45s | ⭐⭐⭐ Complejo |

**Recomendación: Usar `/demo-test` para pruebas rápidas** 🚀

---

**Fecha de creación**: Octubre 2025  
**Versión**: 1.0  
**Autor**: Programador Naia para CDH

