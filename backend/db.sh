#!/bin/bash

# Configuration
DB_NAME="QuestionBank2"
DB_USER="postgres"
DB_PASSWORD="password"

echo "Creating database..."

psql postgres <<EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

echo "Done!"
echo ""
echo "Add this to your .env:"
echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME\""
