#!/bin/sh

echo "⏳ Aguardando o banco ficar disponível..."

while ! nc -z db 5432; do
  sleep 1
done

echo "✅ Banco disponível, iniciando Django..."

cd gestor-procedimentos

# Aplica migrações
python manage.py makemigrations procedimentos
python manage.py migrate

# Cria superusuário admin:123456, se ainda não existir
echo "🔐 Verificando se superusuário já existe..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', '123456')
    print("✅ Superusuário criado: admin / 123456")
else:
    print("ℹ️  Superusuário já existe.")
EOF

# Inicia o servidor
python manage.py runserver 0.0.0.0:8000
