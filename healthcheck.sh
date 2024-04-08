
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c 'SELECT 1' > /dev/null 2>&1
exit_code=$?

if [ "$exit_code" -eq 0 ]; then
  exit 0
else
  exit 1
fi