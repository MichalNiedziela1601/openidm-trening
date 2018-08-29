# Backup
docker exec CONTAINER /usr/local/mysql/bin/mysqldump -u root --password=root DATABASE > backup.sql

# Restore
docker exec -i CONTAINER /usr/bin/mysql -u root --password=root DATABASE < backup.sql
