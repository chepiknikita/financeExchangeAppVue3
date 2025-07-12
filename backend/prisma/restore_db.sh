#!/bin/bash

# Параметры
CONTAINER_NAME="exchange-vue3"          # Имя контейнера с PostgreSQL
POSTGRES_USER=${POSTGRES_USER}          # Пользователь БД
POSTGRES_DB=${POSTGRES_DB_NAME}         # Имя базы данных
BACKUP_FILE="$1"                        # Файл бэкапа (передается как аргумент)

# Проверяем, что указан файл бэкапа
if [ -z "$BACKUP_FILE" ]; then
    echo "Укажите файл резервной копии: ./restore_db.sh /path/to/backup.sql.gz"
    exit 1
fi

# Проверяем существование файла
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Файл резервной копии не найден: ${BACKUP_FILE}"
    exit 1
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Начало восстановления БД из ${BACKUP_FILE}..."

# Останавливаем все подключения к БД
docker exec -t "$CONTAINER_NAME" psql -U "$POSTGRES_USER" -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${POSTGRES_DB}' AND pid <> pg_backend_pid();"

# Удаляем и пересоздаем БД
docker exec -t "$CONTAINER_NAME" psql -U "$POSTGRES_USER" -c "DROP DATABASE IF EXISTS ${POSTGRES_DB};"
docker exec -t "$CONTAINER_NAME" psql -U "$POSTGRES_USER" -c "CREATE DATABASE ${POSTGRES_DB};"

# Восстанавливаем из бэкапа
if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
else
    cat "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
fi

if [ $? -eq 0 ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] База данных успешно восстановлена из ${BACKUP_FILE}"
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Ошибка при восстановлении базы данных!"
    exit 1
fi