echo ${NODE_ENV}
echo ${HOST}
yum install -y nmap-ncat
nc -zv ${HOST} 5432
npm run build 
echo finish migration
npm run start