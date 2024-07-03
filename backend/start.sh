echo ${NODE_ENV}
echo ${HOST}
nc -zv ${HOST} 5432
npm run start