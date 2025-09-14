npm run migration:generate
npm run migration:run
npm run migration:seed
npm run start:dev

## Production

1. Подготовь окружение (используй DIRECT URL из Neon — без -pooler):
   export NODE_ENV=production
   export DATABASE_URL='postgresql://USER:PASSWORD@ep-xxxxx.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'

2. Сборка (чтобы генерировать по JS-датасорсу):
   npm run build

3. Сгенерируй initial-миграцию:
   npm run typeorm:prod -- migration:generate src/database/migrations/Initial -d dist/database/data-source.js

4. Ещё раз собери, чтобы миграция попала в dist:
   npm run build
   ls dist/database/migrations

5. Накати миграции удалённо в Neon:
   npm run migration:run:prod
