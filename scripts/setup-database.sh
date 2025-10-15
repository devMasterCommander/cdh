#!/bin/bash

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🗄️ Configurando base de datos para CDH...${NC}"

# Verificar si DATABASE_URL está configurada
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ ERROR: DATABASE_URL no está configurada${NC}"
    echo -e "${YELLOW}💡 Configura la variable de entorno DATABASE_URL primero${NC}"
    exit 1
fi

echo -e "${GREEN}✅ DATABASE_URL encontrada${NC}"

# Generar cliente Prisma
echo -e "${BLUE}📦 Generando cliente Prisma...${NC}"
if npx prisma generate; then
    echo -e "${GREEN}✅ Cliente Prisma generado${NC}"
else
    echo -e "${RED}❌ Error generando cliente Prisma${NC}"
    exit 1
fi

# Ejecutar migraciones
echo -e "${BLUE}🚀 Ejecutando migraciones...${NC}"
if npx prisma db push; then
    echo -e "${GREEN}✅ Migraciones ejecutadas exitosamente${NC}"
else
    echo -e "${RED}❌ Error ejecutando migraciones${NC}"
    exit 1
fi

# Verificar conexión
echo -e "${BLUE}🔍 Verificando conexión...${NC}"
if npx prisma db pull --print; then
    echo -e "${GREEN}✅ Conexión a base de datos verificada${NC}"
else
    echo -e "${RED}❌ Error verificando conexión${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Base de datos configurada exitosamente!${NC}"
echo -e "${BLUE}💡 Puedes usar 'npx prisma studio' para ver los datos${NC}"
