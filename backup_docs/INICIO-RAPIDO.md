# 🚀 CDH - Inicio Rápido para Pre-Test

## ⚡ Pasos para Iniciar (5 minutos)

### 1️⃣ Verificar Configuración
```bash
npm run pretest
```

Si hay errores, sigue los pasos indicados.

---

### 2️⃣ Verificar Variables de Entorno

**¿Ya tienes archivo `.env`?**

✅ **SÍ** → Asegúrate de tener:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[tu-secret]"
```

❌ **NO** → Sigue las instrucciones en `ENV_SETUP.md`

**Generar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

### 3️⃣ Iniciar Servidor
```bash
npm run dev
```

Espera a ver: `✓ Ready in XXXms`

---

### 4️⃣ Acceder con Usuario Demo
```bash
# En tu navegador:
http://localhost:3000/demo-test
```

**Clic en:** "Acceder como Usuario de Prueba"

---

## 🎯 URLs Principales

### Dashboard Usuario
- Mi Cuenta: `http://localhost:3000/mi-cuenta`
- Mis Cursos: `http://localhost:3000/mi-cuenta/mis-cursos`
- Mi Progreso: `http://localhost:3000/mi-cuenta/progreso`
- Afiliados: `http://localhost:3000/mi-cuenta/afiliado`

### Admin Panel
⚠️ Requiere usuario ADMIN (ver PRETEST.md)
- Dashboard: `http://localhost:3000/admin`
- Cursos: `http://localhost:3000/admin/cursos`
- Usuarios: `http://localhost:3000/admin/usuarios`

---

## ✅ Verificación Rápida

### Dashboard funciona si ves:
- ✅ Header con logo "CDH"
- ✅ Menú lateral con opciones en morado
- ✅ Cards de estadísticas
- ✅ Nombre del usuario "test iswald"

### Responsive funciona si:
- ✅ En desktop: Sidebar visible, botón de colapsar funciona
- ✅ En móvil: Header sticky, botón de menú abre drawer

---

## 🆘 Solución Rápida de Problemas

### Error: "Can't reach database"
```bash
# Verifica que PostgreSQL está corriendo
# Verifica DATABASE_URL en .env
```

### Error: "Invalid session"
```bash
# Asegúrate de tener NEXTAUTH_SECRET en .env
# Genera uno nuevo con:
openssl rand -base64 32
```

### Estilos no se ven
```bash
# Limpia cache y reinicia:
npm run clean
npm run dev
```

### Puerto 3000 ocupado
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

---

## 📋 Checklist Completo

Ver `PRETEST-CHECKLIST.md` para checklist detallado de todas las funcionalidades a probar.

---

## 📚 Documentación Completa

- 📖 **[PRETEST.md](./PRETEST.md)** - Guía completa de testing
- 🏗️ **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura del código
- 🔧 **[ENV_SETUP.md](./ENV_SETUP.md)** - Variables de entorno
- ✅ **[PRETEST-CHECKLIST.md](./PRETEST-CHECKLIST.md)** - Checklist visual
- 📝 **[RELEASE-NOTES-v1.0.0-pretest.md](./RELEASE-NOTES-v1.0.0-pretest.md)** - Notas de versión

---

**¿Problemas?** Revisa la documentación completa o los logs del servidor.

**¡Listo para Pre-Test!** 🎉

