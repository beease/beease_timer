#!/bin/sh

# attendre que la base de données soit prête
echo "Attente de la base de données PostgreSQL..."
while ! nc -z database 5432; do
  sleep 1
done
echo "La base de données PostgreSQL est prête."

# déployer la migration Prisma
echo "Déploiement de la migration Prisma..."
npx prisma migrate deploy
echo "Migration Prisma déployée."

# démarrer l'application
npm start