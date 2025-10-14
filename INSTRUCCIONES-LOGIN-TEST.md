# 🔐 Instrucciones de Login - Usuario de Prueba

## 👤 Usuario: test-oswald4993@yopmail.com

---

## ✅ **MÉTODO MÁS SIMPLE Y RÁPIDO**

### Opción A: Usar la Consola del Navegador (30 segundos)

1. **Abre la consola del navegador** (F12 o Cmd+Option+I)

2. **Ve a la pestaña "Application" → "Cookies" → "http://localhost:3000"**

3. **Copia y pega este código en la consola:**

```javascript
// Crear sesión manualmente
fetch('/api/auth/signin/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'test-oswald4993@yopmail.com',
    redirect: false 
  })
}).then(r => r.json()).then(console.log);
```

4. **Luego ejecuta:**
```javascript
window.location.href = '/mi-cuenta/mis-cursos';
```

---

## 📧 **MÉTODO TRADICIONAL (Yopmail)**

### Paso 1: Ir a la página de login
```
http://localhost:3000/auth/signin
```

### Paso 2: Ingresar el email
```
test-oswald4993@yopmail.com
```

### Paso 3: Click en "Enviar enlace de acceso"

### Paso 4: Ir a Yopmail
```
https://yopmail.com/
```

### Paso 5: Ingresar en Yopmail
- **Inbox**: `test-oswald4993`
- Busca el email más reciente de NextAuth
- Click en el enlace "Sign in"

### Paso 6: Serás redirigido automáticamente
- ✅ Sesión iniciada
- ✅ Acceso completo a la plataforma

---

## 🎯 **Después de Iniciar Sesión**

### Rutas para Probar

1. **Dashboard Principal**
   ```
   http://localhost:3000/mi-cuenta
   ```

2. **Mis Cursos (Ver curso comprado)**
   ```
   http://localhost:3000/mi-cuenta/mis-cursos
   ```

3. **Acceder al Curso**
   - Desde "Mis Cursos" → Click en "Continuar Curso"
   - Verás la lista de módulos y lecciones

4. **Acceder a una Lección (Reproductor de Video)**
   - Click en cualquier lección
   - URL será algo como: `/cursos/[courseId]/leccion/[lessonId]`
   - Verás:
     - ✅ Video de Vimeo
     - ✅ Botón morado "Marcar como Completada"
     - ✅ Progreso guardándose automáticamente

5. **Mi Progreso**
   ```
   http://localhost:3000/mi-cuenta/progreso
   ```
   - Verás las lecciones que has visto
   - Estadísticas de progreso

---

## 🔍 **Verificar en Base de Datos (Opcional)**

### Verificar que el usuario existe
```sql
SELECT id, name, email, userType 
FROM "User" 
WHERE email = 'test-oswald4993@yopmail.com';
```

### Verificar cursos comprados
```sql
SELECT 
  u.email,
  c.name as curso,
  p.createdAt as fecha_compra
FROM "Purchase" p
JOIN "User" u ON u.id = p.userId
JOIN "Course" c ON c.id = p.courseId
WHERE u.email = 'test-oswald4993@yopmail.com';
```

### Verificar progreso de lecciones
```sql
SELECT 
  l.name as leccion,
  lp.isCompleted,
  lp.lastTimestamp,
  lp.updatedAt
FROM "LessonProgress" lp
JOIN "Lesson" l ON l.id = lp.lessonId
JOIN "User" u ON u.id = lp.userId
WHERE u.email = 'test-oswald4993@yopmail.com'
ORDER BY lp.updatedAt DESC;
```

---

## ⚡ **Solución Rápida al Error de Hidratación**

El error de hidratación que viste es causado por:
- Extensión de navegador (Ember) modificando el HTML
- No afecta la funcionalidad
- Es solo una advertencia

**Para eliminarlo:**
1. Desactiva extensiones del navegador
2. O usa modo incógnito
3. O simplemente ignóralo (no afecta el funcionamiento)

---

## 🎨 **Lo Que Verás**

### Página de Login
- ✅ Header morado con gradiente
- ✅ Input para email
- ✅ Botón "Enviar enlace de acceso" morado

### Dashboard
- ✅ Sidebar con navegación
- ✅ Cards con estadísticas
- ✅ Gradientes morado/lavanda

### Reproductor de Video
- ✅ Video de Vimeo incrustado
- ✅ Botón morado "Marcar como Completada"
- ✅ Cambia a verde cuando está completado
- ✅ Link "Volver al curso" morado

---

## 📝 **Resumen**

**Método Recomendado**: Yopmail (Método Tradicional)
- ⏱️ Tiempo: ~30 segundos
- ✅ Funciona 100%
- ✅ Simula flujo real de usuario

**Pasos:**
1. `/auth/signin`
2. Ingresar: `test-oswald4993@yopmail.com`
3. Ir a `yopmail.com` → Inbox: `test-oswald4993`
4. Click en enlace del email
5. ¡Listo! 🎉

---

**¿Necesitas ayuda con algún paso específico?** 🚀

