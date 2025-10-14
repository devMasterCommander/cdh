# 🎨 Guía de Implementación de Colores CDH

## 📋 Índice
1. [Paleta de Colores Base](#paleta-de-colores-base)
2. [Variables CSS en globals.css](#variables-css-en-globalscss)
3. [Clases Tailwind Personalizadas](#clases-tailwind-personalizadas)
4. [Componentes shadcn/ui](#componentes-shadcnui)
5. [Ejemplos por Componente](#ejemplos-por-componente)
6. [Patrones de Uso](#patrones-de-uso)

---

## 🎨 Paleta de Colores Base

### Colores Principales CDH
```css
Primary:   #312e81 (Morado/Índigo Oscuro) - oklch(0.28 0.09 265)
Secondary: #ebd5f0 (Lavanda Claro)       - oklch(0.88 0.04 300)
Accent:    #0E0031 (Morado Oscuro)       - oklch(0.2 0.05 280)
```

### Uso Conceptual
- **Primary (#312e81)**: Acciones principales, CTAs, elementos destacados, botones
- **Secondary (#ebd5f0)**: Acentos secundarios, backgrounds suaves, badges especiales
- **Accent (#0E0031)**: Textos principales, títulos, elementos de alta jerarquía

---

## 🔧 Variables CSS en `globals.css`

### Variables Definidas en `:root`

```css
:root {
  /* Variables CDH en formato oklch() */
  --cdh-primary: oklch(0.28 0.09 265);   /* #312e81 - Morado/Índigo oscuro */
  --cdh-secondary: oklch(0.88 0.04 300); /* #ebd5f0 - Lavanda claro */
  --cdh-accent: oklch(0.2 0.05 280);     /* #0E0031 - Morado oscuro */
  
  /* Mapeo a variables shadcn/ui */
  --primary: var(--cdh-primary);
  --primary-foreground: oklch(1 0 0); /* Blanco puro para contraste */
  
  --secondary: var(--cdh-secondary);
  --secondary-foreground: oklch(0.3 0.06 282); /* Texto oscuro */
  
  --accent: oklch(0.92 0.04 262);
  --accent-foreground: oklch(0.3 0.06 282);
  
  --foreground: oklch(0.3 0.06 282); /* Texto principal oscuro */
  --background: oklch(0.98 0.01 286); /* Fondo muy claro */
  
  --ring: var(--cdh-primary); /* Ring usa primary */
}
```

---

## 🎯 Clases Tailwind Personalizadas

### Clases de Texto
```css
.text-primary    → color: oklch(0.28 0.09 265) /* Morado oscuro */
.text-secondary  → color: oklch(0.88 0.04 300) /* Lavanda claro */
.text-accent     → color: oklch(0.2 0.05 280)  /* Morado muy oscuro */
```

### Clases de Fondo
```css
.bg-primary      → background: oklch(0.28 0.09 265) /* Morado oscuro */
.bg-secondary    → background: oklch(0.88 0.04 300) /* Lavanda claro */
.bg-accent       → background: oklch(0.2 0.05 280)  /* Morado muy oscuro */
```

### Clases de Borde
```css
.border-primary   → border-color: oklch(0.28 0.09 265) /* Morado oscuro */
.border-secondary → border-color: oklch(0.88 0.04 300) /* Lavanda claro */
.border-accent    → border-color: oklch(0.2 0.05 280)  /* Morado muy oscuro */
```

---

## 🧩 Componentes shadcn/ui

### Button
```tsx
// Variante Primary (por defecto)
<Button className="bg-primary hover:bg-primary/90">
  Botón Principal
</Button>

// Variante Outline con Primary
<Button variant="outline" className="border-cdh-primary text-cdh-primary">
  Botón Outline
</Button>

// Variante Ghost
<Button variant="ghost">
  Botón Ghost
</Button>
```

### Card
```tsx
// Card con header gradient CDH
<Card className="overflow-hidden">
  <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
    <h2 className="font-cinzel">Título</h2>
  </div>
</Card>

// Card con hover
<Card className="hover:shadow-lg transition-shadow">
  <CardContent>Contenido</CardContent>
</Card>
```

### Badge
```tsx
// Badge Primary
<Badge className="bg-primary text-primary-foreground">
  Destacado
</Badge>

// Badge Secondary
<Badge className="bg-cdh-secondary text-white">
  Afiliado
</Badge>

// Badge con estados
<Badge className="bg-green-100 text-green-800">
  Completado
</Badge>

<Badge className="bg-yellow-100 text-yellow-800">
  Pendiente
</Badge>
```

### Progress
```tsx
// Barra de progreso con color primary
<Progress value={75} className="h-2" />
// El color se hereda de --primary automáticamente
```

---

## 📦 Ejemplos por Componente

### 1. **Página de Cursos** (`/cursos`)

#### Header de Navegación
```tsx
<div className="bg-card border-b border-border">
  <Button variant="ghost" size="sm">
    <ArrowLeft className="h-4 w-4" />
  </Button>
  <Button size="sm" className="bg-primary hover:bg-primary/90">
    <BookOpen className="h-4 w-4" />
    Mis Cursos
  </Button>
</div>
```

#### Cards de Curso
```tsx
<Card className="hover:shadow-lg transition-all hover:-translate-y-1">
  <CardHeader>
    <CardTitle className="text-lg font-cinzel text-foreground">
      {curso.name}
    </CardTitle>
    {curso.isPurchased && (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Ya adquirido
      </Badge>
    )}
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-primary">
      {curso.price.toFixed(2)}€
    </div>
    <Button className="w-full bg-primary hover:bg-primary/90">
      <ShoppingCart className="h-4 w-4 mr-2" />
      Ver Detalles
    </Button>
  </CardContent>
</Card>
```

---

### 2. **Detalles de Curso** (`/cursos/[id]`)

#### Header con Gradiente
```tsx
<Card className="overflow-hidden">
  <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
    <Badge className="bg-white/20 text-white hover:bg-white/30">
      <CheckCircle className="h-3 w-3 mr-1" />
      Curso Adquirido
    </Badge>
    <h1 className="text-3xl font-cinzel font-bold">{course.name}</h1>
  </div>
</Card>
```

#### Lecciones con Hover
```tsx
<Link className="flex items-center p-4 hover:bg-muted/50 transition-colors group">
  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary 
                  group-hover:bg-primary group-hover:text-primary-foreground">
    {lesson.order}
  </div>
  <span className="text-foreground group-hover:text-primary">
    {lesson.name}
  </span>
  <ChevronRight className="text-muted-foreground group-hover:text-primary" />
</Link>
```

#### Sidebar de Compra
```tsx
<Card className="sticky top-6">
  <CardContent>
    <div className="flex items-baseline justify-center">
      <DollarSign className="h-6 w-6 text-primary" />
      <p className="text-5xl font-bold text-primary">
        {course.price.toFixed(2)}
      </p>
    </div>
    <Button className="w-full bg-primary hover:bg-primary/90">
      Comprar Ahora
    </Button>
  </CardContent>
</Card>
```

---

### 3. **Dashboard Mi Cuenta** (`/mi-cuenta`)

#### Sidebar Navigation
```tsx
<div className="bg-gradient-to-r from-cdh-primary to-cdh-secondary text-white">
  <span className="font-cinzel text-xl">CDH</span>
</div>

<Link className={`flex items-center gap-3 rounded-lg px-3 py-2 
                  ${isActive 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}>
  <User className="h-4 w-4" />
  Mi Perfil
</Link>
```

#### Avatar con Badge
```tsx
<Avatar className="w-20 h-20 border-4 border-white">
  <AvatarFallback className="text-xl font-cinzel bg-white text-cdh-accent">
    {user.name?.charAt(0)}
  </AvatarFallback>
</Avatar>
<Badge className="bg-cdh-secondary text-white">Afiliado</Badge>
```

---

### 4. **Mi Perfil** (`/mi-cuenta/page.tsx`)

#### Header con Gradiente
```tsx
<Card className="overflow-hidden">
  <div className="bg-gradient-to-r from-cdh-primary to-cdh-secondary p-6 text-white">
    <Avatar className="w-20 h-20 border-4 border-white">
      <AvatarFallback className="bg-white text-cdh-accent">
        {userData.name?.charAt(0)}
      </AvatarFallback>
    </Avatar>
    <h1 className="text-3xl font-cinzel">{userData.name}</h1>
  </div>
</Card>
```

#### Estadísticas
```tsx
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle className="text-sm text-muted-foreground">
      Cursos Comprados
    </CardTitle>
    <BookOpen className="h-4 w-4 text-cdh-primary" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-cdh-accent">
      {userData._count.purchases}
    </div>
  </CardContent>
</Card>
```

#### Botones de Edición
```tsx
<Button 
  variant="outline" 
  className="text-cdh-primary border-cdh-primary hover:bg-cdh-primary hover:text-white">
  <Edit3 className="h-4 w-4 mr-2" />
  Editar
</Button>

<Button className="bg-cdh-primary hover:bg-cdh-primary-dark">
  <Save className="h-4 w-4 mr-2" />
  Guardar Cambios
</Button>
```

---

### 5. **Mis Cursos** (`/mi-cuenta/mis-cursos`)

#### Estadísticas de Cursos
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle className="text-sm text-muted-foreground">
      Total de Cursos
    </CardTitle>
    <BookOpen className="h-4 w-4 text-cdh-primary" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-cdh-accent">{cursos.length}</div>
  </CardContent>
</Card>
```

#### Progress Bar
```tsx
<Progress value={course.progressPercentage} className="h-2" />
<span className="font-semibold text-cdh-accent">
  {course.progressPercentage}%
</span>
```

#### Badges de Estado
```tsx
{course.isCompleted ? (
  <Badge className="bg-green-100 text-green-800">
    <CheckCircle className="h-3 w-3 mr-1" />
    Completado
  </Badge>
) : course.isActive ? (
  <Badge className="bg-primary/10 text-primary">
    <PlayCircle className="h-3 w-3 mr-1" />
    En progreso
  </Badge>
) : (
  <Badge variant="secondary">
    <Target className="h-3 w-3 mr-1" />
    No iniciado
  </Badge>
)}
```

---

### 6. **Mi Progreso** (`/mi-cuenta/progreso`)

#### Card de Progreso Global
```tsx
<Card className="overflow-hidden">
  <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
    <p className="text-sm opacity-90">Progreso Global</p>
    <p className="text-3xl font-bold">{stats.overview.globalProgressPercentage}%</p>
    <TrendingUp className="h-8 w-8 opacity-80" />
  </div>
</Card>
```

#### Métricas con Iconos
```tsx
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle className="text-sm text-muted-foreground">
      Cursos Activos
    </CardTitle>
    <PlayCircle className="h-4 w-4 text-primary" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-foreground">
      {stats.overview.activeCourses}
    </div>
  </CardContent>
</Card>
```

#### Últimas Lecciones
```tsx
<Card className="hover:shadow-md transition-shadow">
  <CardContent className="p-4">
    <div className="flex items-center space-x-2">
      <Book className="h-4 w-4 text-primary" />
      <h3 className="font-medium text-foreground group-hover:text-primary">
        {lesson.lessonName}
      </h3>
    </div>
    <Badge className="bg-primary/10 text-primary">
      <PlayCircle className="h-3 w-3 mr-1" />
      En progreso
    </Badge>
  </CardContent>
</Card>
```

---

### 7. **Programa de Afiliados** (`/mi-cuenta/afiliado`)

#### Header de Afiliado
```tsx
<Card className="overflow-hidden">
  <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
    <h1 className="text-3xl font-cinzel font-bold">Panel de Afiliado</h1>
    <Award className="h-12 w-12 opacity-80" />
  </div>
</Card>
```

#### URL de Referido
```tsx
<Card>
  <CardHeader>
    <CardTitle className="flex items-center space-x-2">
      <Share2 className="h-5 w-5 text-primary" />
      <span>Tu Enlace de Referido</span>
    </CardTitle>
  </CardHeader>
  <CardContent>
    <Button className="bg-primary hover:bg-primary/90">
      <Copy className="h-4 w-4 mr-2" />
      Copiar
    </Button>
  </CardContent>
</Card>
```

#### Comisiones
```tsx
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle className="text-sm text-muted-foreground">
      Comisiones Pendientes
    </CardTitle>
    <Clock className="h-4 w-4 text-yellow-500" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-yellow-600">
      {formatCurrency(stats.commissions.pending.amount)}
    </div>
  </CardContent>
</Card>
```

#### Badges de Estado de Comisión
```tsx
{status === "PENDING" && (
  <Badge className="bg-yellow-100 text-yellow-800">
    <Clock className="h-3 w-3 mr-1" />
    Pendiente
  </Badge>
)}
{status === "APPROVED" && (
  <Badge className="bg-green-100 text-green-800">
    <CheckCircle2 className="h-3 w-3 mr-1" />
    Aprobado
  </Badge>
)}
{status === "PAID" && (
  <Badge className="bg-primary/10 text-primary">
    <CheckCircle className="h-3 w-3 mr-1" />
    Pagado
  </Badge>
)}
```

---

## 🎨 Patrones de Uso

### 1. **Gradientes CDH**
```tsx
// Gradiente Primary
className="bg-gradient-to-br from-primary to-primary/80"

// Gradiente Primary a Secondary
className="bg-gradient-to-r from-cdh-primary to-cdh-secondary"

// Gradiente con opacidad
className="bg-gradient-to-br from-primary/20 to-primary/10"
```

### 2. **Estados de Hover**
```tsx
// Hover con Primary
className="hover:text-primary transition-colors"
className="hover:bg-primary hover:text-primary-foreground"

// Hover con sombra
className="hover:shadow-lg transition-shadow"

// Hover con transformación
className="hover:-translate-y-1 transition-all duration-200"
```

### 3. **Iconos con Colores**
```tsx
// Icono Primary
<BookOpen className="h-4 w-4 text-primary" />

// Icono Secondary
<Award className="h-4 w-4 text-secondary" />

// Icono con estado
<CheckCircle className="h-4 w-4 text-green-500" />
<Clock className="h-4 w-4 text-yellow-500" />
<XCircle className="h-4 w-4 text-red-500" />
```

### 4. **Tipografía con Colores**
```tsx
// Título con Accent
<h1 className="text-3xl font-cinzel text-cdh-accent">Título</h1>

// Subtítulo con Primary
<h2 className="text-xl font-courgette text-cdh-primary">Subtítulo</h2>

// Texto muted
<p className="text-muted-foreground">Descripción</p>

// Texto foreground (Accent)
<p className="text-foreground">Texto principal</p>
```

### 5. **Borders y Separadores**
```tsx
// Border Primary
className="border border-cdh-primary"

// Border con hover
className="border border-border hover:border-primary"

// Separador
<Separator className="bg-border" />

// Border left accent
className="border-l-4 border-primary pl-4"
```

### 6. **Backgrounds con Opacidad**
```tsx
// Background Primary con opacidad
className="bg-primary/10"  // 10% opacidad
className="bg-primary/20"  // 20% opacidad
className="bg-primary/50"  // 50% opacidad

// Background muted
className="bg-muted"       // Gris claro
className="bg-muted/50"    // Gris claro con opacidad
```

---

## 📝 Notas Importantes

### ✅ Hacer
- Usar `text-primary`, `bg-primary`, `border-primary` para consistencia
- Usar `text-foreground` para textos principales (mapea a Accent)
- Usar `text-muted-foreground` para textos secundarios
- Usar gradientes para headers importantes
- Mantener contraste adecuado (Primary con blanco, Accent con fondos claros)

### ❌ Evitar
- No usar colores hex directamente: ~~`#FFB44B`~~ ❌
- No usar `blue-600` o colores Tailwind genéricos para elementos principales
- No mezclar sistemas: usar o variables CSS o clases Tailwind, no ambos
- No olvidar estados hover y focus

---

## 🔍 Debugging

### Ver Variables CSS en DevTools
```javascript
// En la consola del navegador
getComputedStyle(document.documentElement).getPropertyValue('--primary')
getComputedStyle(document.documentElement).getPropertyValue('--cdh-primary-l')
```

### Verificar Clases Aplicadas
```javascript
// Inspeccionar elemento y buscar en Computed Styles
// Buscar: color, background-color, border-color
```

---

## 📚 Recursos

- **globals.css**: `/src/app/globals.css` - Definición de variables
- **tailwind.config.ts**: `/tailwind.config.ts` - Configuración de Tailwind
- **Componentes shadcn/ui**: `/src/components/ui/` - Componentes base
- **Lucide Icons**: https://lucide.dev/ - Iconos utilizados

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0  
**Autor**: Programador Naia para CDH

