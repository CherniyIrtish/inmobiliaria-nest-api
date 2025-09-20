## Steps

# local

npm run migration:generate
npm run migration:run
npm run migration:seed
npm run start:dev

# prod (postgres)

npm run build
npm run migration:generate:prod
npm run migration:run:prod
