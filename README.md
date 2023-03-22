## Setup
1. Make sure you have a MySQL username and password, and make sure the MySQL server is running. Run ```./script/bootstrap```.
2. npm start


## Migrations
- `db-migrate create SQL_ACTION_NAME --config ./database/config/dev.json` to create migration files, this will create a .js file and two .sql files with the date and SQL_ACTION_NAME. The .sql file with the name 'up' should contain the migration that you want to run and the 'down' should contain the reverse to undo the migrations ran. The .js file is the logic that runs everything, this does not need to be changed usually. 
- `db-migrate up --config ./database/config/dev.json` to run all migrations in order
- `db-migrate down --config./database/config/dev.json` to drop all migrations
- `mysql -u root -p` to log into mysql


## Testing User
- Use karen.smith@gmail.com with the password "pw" to login to a generic account. 