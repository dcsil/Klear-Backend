## Setup
1. Make sure you have a MySQL username and password, and make sure the MySQL server is running. Run ```./script/bootstrap```.
2. npm start


## Migrations
- `db-migrate create SQL_ACTION_NAME --config ./database/config/dev.json` 
- `db-migrate up --config ./database/config/dev.json` to run all migrations in order
- `db-migrate down --config./database/config/dev.json` to drop all migrations
- `mysql -u root -p` to log into mysql