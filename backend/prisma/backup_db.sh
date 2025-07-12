#!/bin/bash

# Параметры
CONTAINER_NAME="exchange-vue3"          # Имя контейнера с PostgreSQL
POSTGRES_USER=${POSTGRES_USER}          # Пользователь БД
POSTGRES_DB=${POSTGRES_DB_NAME}         # Имя базы данных
BACKUP_DIR=${USER_BACKUP_DIR}           # Директория для хранения бэкапов
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${POSTGRES_DB}_${TIMESTAMP}.sql.gz"

# Создаем директорию для бэкапов, если ее нет
mkdir -p "$BACKUP_DIR"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Начало создания резервной копии БД ${POSTGRES_DB}..."

# Создаем дамп с сжатием
docker exec -t "$CONTAINER_NAME" pg_dumpall -U "$POSTGRES_USER" | gzip > "$BACKUP_FILE"

# Проверяем успешность выполнения
if [ $? -eq 0 ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Резервная копия успешно создана: ${BACKUP_FILE}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Размер файла: $(du -h "$BACKUP_FILE" | cut -f1)"
    
    # Удаляем старые бэкапы (сохраняем последние 7)
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Очистка старых бэкапов..."
    find "$BACKUP_DIR" -name "${POSTGRES_DB}_*.sql.gz" -type f | sort -r | tail -n +8 | xargs rm -f
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Ошибка при создании резервной копии!"
    exit 1
fi