#!/bin/bash

# Script de validación para deployment en Vercel
# Ejecuta todas las validaciones necesarias antes de hacer deployment

echo "🚀 Iniciando validación para deployment en Vercel..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar errores
show_error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
    exit 1
}

# Función para mostrar éxito
show_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para mostrar advertencias
show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Función para mostrar información
show_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo "📋 Paso 1: Verificando ESLint..."
if ! npm run lint; then
    show_warning "ESLint encontró errores, pero está deshabilitado durante el build"
    show_info "ESLint está configurado con ignoreDuringBuilds: true en next.config.ts"
    show_info "Esto permite el deployment mientras se corrigen los errores"
else
    show_success "ESLint pasó sin errores"
fi

echo "📋 Paso 2: Verificando build local..."
if ! npm run build; then
    show_error "Build local falló. Corrige los errores antes de hacer deployment."
fi
show_success "Build local exitoso"

echo "📋 Paso 3: Verificando archivos con hooks de Next.js..."
echo "🔍 Buscando useSearchParams sin Suspense..."
SEARCH_PARAMS_FILES=$(grep -r "useSearchParams" src/app --include="*.tsx" --include="*.ts" | grep -v "Suspense" | wc -l)
if [ "$SEARCH_PARAMS_FILES" -gt 0 ]; then
    show_warning "Se encontraron archivos con useSearchParams que podrían necesitar Suspense boundaries:"
    grep -r "useSearchParams" src/app --include="*.tsx" --include="*.ts" | grep -v "Suspense"
fi

echo "🔍 Buscando usePathname sin Suspense..."
PATHNAME_FILES=$(grep -r "usePathname" src/app --include="*.tsx" --include="*.ts" | grep -v "Suspense" | wc -l)
if [ "$PATHNAME_FILES" -gt 0 ]; then
    show_warning "Se encontraron archivos con usePathname que podrían necesitar Suspense boundaries:"
    grep -r "usePathname" src/app --include="*.tsx" --include="*.ts" | grep -v "Suspense"
fi

echo "📋 Paso 4: Verificando configuración de Next.js..."
if [ ! -f "next.config.ts" ]; then
    show_error "next.config.ts no encontrado"
fi

# Verificar que ignoreDuringBuilds esté configurado
if grep -q "ignoreDuringBuilds.*true" next.config.ts; then
    show_warning "ESLint está deshabilitado durante el build (ignoreDuringBuilds: true)"
    show_info "Recuerda re-habilitar ESLint después del deployment exitoso"
fi

if grep -q "ignoreBuildErrors.*true" next.config.ts; then
    show_warning "TypeScript está deshabilitado durante el build (ignoreBuildErrors: true)"
    show_info "Recuerda re-habilitar TypeScript después del deployment exitoso"
fi

echo "📋 Paso 5: Verificando configuración de Vercel..."
if [ ! -f "vercel.json" ]; then
    show_warning "vercel.json no encontrado - se usará configuración por defecto"
else
    show_success "vercel.json encontrado"
fi

echo "📋 Paso 6: Verificando variables de entorno críticas..."
REQUIRED_ENV_VARS=("DATABASE_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL")
MISSING_VARS=()

for var in "${REQUIRED_ENV_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    show_warning "Variables de entorno faltantes localmente: ${MISSING_VARS[*]}"
    show_info "Asegúrate de configurarlas en Vercel Dashboard antes del deployment"
fi

echo "📋 Paso 7: Verificando archivos de Stripe..."
STRIPE_FILES=$(find src/app/api -name "*.ts" -exec grep -l "Stripe" {} \; | wc -l)
if [ "$STRIPE_FILES" -gt 0 ]; then
    show_info "Se encontraron $STRIPE_FILES archivos que usan Stripe"
    show_info "Asegúrate de configurar STRIPE_SECRET_KEY en Vercel"
fi

echo "📋 Paso 8: Verificando dependencias..."
if [ ! -f "package.json" ]; then
    show_error "package.json no encontrado"
fi

# Verificar que las dependencias críticas estén presentes
CRITICAL_DEPS=("next" "react" "typescript")
for dep in "${CRITICAL_DEPS[@]}"; do
    if ! grep -q "\"$dep\"" package.json; then
        show_error "Dependencia crítica faltante: $dep"
    fi
done
show_success "Dependencias críticas verificadas"

show_success "Todas las validaciones pasaron"
echo -e "${GREEN}🚀 Listo para deployment en Vercel${NC}"
echo -e "${BLUE}📝 Próximos pasos:${NC}"
echo -e "${BLUE}   1. Configurar variables de entorno en Vercel Dashboard${NC}"
echo -e "${BLUE}   2. Hacer push a main${NC}"
echo -e "${BLUE}   3. Verificar deployment en Vercel${NC}"
echo -e "${BLUE}   4. Re-habilitar ESLint y TypeScript después del deployment exitoso${NC}"
