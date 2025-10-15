#!/bin/bash

# Script de validación pre-commit para CDH
# Ejecuta todas las validaciones necesarias antes de hacer commit

echo "🔍 Iniciando validación pre-commit..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

echo "📋 Paso 1: Verificando ESLint..."
if ! npm run lint; then
    show_error "ESLint encontró errores. Corrige los errores antes de hacer commit."
fi
show_success "ESLint pasó sin errores"

echo "📋 Paso 2: Verificando build local..."
if ! npm run build; then
    show_error "Build local falló. Corrige los errores antes de hacer commit."
fi
show_success "Build local exitoso"

echo "📋 Paso 3: Verificando archivos con useSearchParams..."
SEARCH_PARAMS_FILES=$(grep -r "useSearchParams" src/app --include="*.tsx" --include="*.ts" | grep -v "Suspense" | wc -l)
if [ "$SEARCH_PARAMS_FILES" -gt 0 ]; then
    show_warning "Se encontraron archivos con useSearchParams que podrían necesitar Suspense boundaries"
    grep -r "useSearchParams" src/app --include="*.tsx" --include="*.ts" | grep -v "Suspense"
fi

echo "📋 Paso 4: Verificando variables de entorno críticas..."
REQUIRED_ENV_VARS=("DATABASE_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL")
MISSING_VARS=()

for var in "${REQUIRED_ENV_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    show_warning "Variables de entorno faltantes: ${MISSING_VARS[*]}"
    show_warning "Asegúrate de configurarlas en Vercel antes del deployment"
fi

echo "📋 Paso 5: Verificando archivos de configuración..."
if [ ! -f "next.config.ts" ]; then
    show_error "next.config.ts no encontrado"
fi

if [ ! -f "vercel.json" ]; then
    show_warning "vercel.json no encontrado - se usará configuración por defecto"
fi

show_success "Todas las validaciones pasaron"
echo -e "${GREEN}🚀 Listo para hacer commit y deployment${NC}"
