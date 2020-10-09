#!/bin/bash
echo $PG_HOST:$PG_PORT
./scripts/wait.sh $PG_HOST:$PG_PORT -t 0
./scripts/wait.sh $REDIS_HOST:$REDIS_PORT -t 0
echo "finish wait"
migration() {
  echo " -> Compiling migration..."
  echo ""
  npx tsc -t es2017 -esModuleInterop -module CommonJS -outDir ./migration-dist ./migration/*.ts
  echo " -> Compilation completed."
  echo ""

  echo " -> Starting migration..."
  echo ""
  npm run mg:up
  echo " -> Migration completed."
  echo ""
}

if ls ./migration/*.ts &> /dev/null; then
  migration
else
  echo "Not migration to run."
fi

echo " -> Starting application..."
echo ""
if [ "$NODE_ENV" = "production" ]; then
  npm run start:prod
else
  npm run start:dev
fi
