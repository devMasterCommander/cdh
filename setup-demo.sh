#!/bin/bash

# Script para configurar usuario demo
echo "🚀 Configurando Usuario Demo..."
echo ""

# Verificar si el servidor está corriendo
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "⚠️  El servidor no está corriendo"
    echo "   Ejecuta: npm run dev"
    echo ""
    exit 1
fi

# Crear usuario demo via API
echo "📝 Creando usuario demo..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/demo/create-user)

echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

echo ""
echo "✅ Usuario demo configurado"
echo ""
echo "🔑 Credenciales:"
echo "   Email: demo@cdh.com"
echo "   Contraseña: demo1234"
echo ""
echo "🌐 Accede a:"
echo "   http://localhost:3000/demo-login"
echo ""

