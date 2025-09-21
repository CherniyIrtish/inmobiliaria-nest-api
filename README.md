## Steps

# local

npm run migration:generate
npm run migration:run
npm run migration:seed
npm run start:dev

# prod (postgres)

Remove all local migrations

export NODE_ENV=production
export DATABASE_URL='postgres://user:pass@localhost:5432/mydb'

npm run build
npm run migration:generate:prod
npm run migration:run:prod
