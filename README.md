## Setup
1. Make sure you have a MySQL username and password, and make sure the MySQL server is running. 
2. Run ```./script/bootstrap```.
3. Ensure .env's information is correct from bootstrap for db connection. Follow instructions under "Authentication Service Set Up" to get ```ACCESS_TOKEN_SECRET```
4. Ensure a database/config/dev.json file is created with the correct information to connect to your local db. This file is used to run db migrations. 
    - ONLY IF NOT CREATED PROPERLY: Follow instructions under "Migrations" to set up properly. And then run ```db-migrate up --config ./database/config/dev.json```
5. Start the mysql server ```mysql start```
6. Run ```npm start```

## Database 
### Prod database
- can be accessed through: http://3.142.235.3/phpmyadmin/index.php
- contact someone on the team to get the proper credentials to access prod db
- if developing in dev, use your own local database so we don't make changes we don't want to on prod
- if you want to connect to the prod database go into your .env and change host to the prod host and the user to the correct user instead which would be: 3.142.235.3

### Dev database
- if not working then you might need to add this line in .env and database/config/dev.json: ```"socketPath": "/var/run/mysqld/mysqld.sock"``` 
- Make sure to run new migrations if pulling new code that has any db changes. 


## Migrations
### Set up 
- Create a database/config/dev.json file and paste the following:
```
{
    "dev": {
        "host": "", 
        "user": "",
        "password": "",
        "database": "",
        "driver": "mysql",
        "multipleStatements": true
    }, "sql-file": true
}
```
- Fill out the necessary information

### To run migrations
- `db-migrate create SQL_ACTION_NAME --config ./database/config/dev.json` to create migration files, this will create a .js file and two .sql files with the date and SQL_ACTION_NAME. The .sql file with the name 'up' should contain the migration that you want to run and the 'down' should contain the reverse to undo the migrations ran. The .js file is the logic that runs everything, this does not need to be changed usually. 
- `db-migrate up --config ./database/config/dev.json` to run all migrations in order
- `db-migrate down --config./database/config/dev.json` to drop all migrations
- `mysql -u root -p` to log into mysql

### To run the CV/ML service
- Download the file `resnet-34_kinetics.onnx` from our Google Drive(https://drive.google.com/drive/folders/14O32x--6oFAjRydepzN3o3ghKVzk1EkU) as GitHub has a file size limit
- Place `resnet-34_kinetics.onnx` and other video files you want to run the server on in the folder `cvservice`
- Go into the folder `cvservice` by running `cd cvservice` 
- Run `python3 ./human_activity_reco.py`


## Testing User
- Use karen.smith@gmail.com with the password "pw" to login to a generic account. 

## Authentication Serivce Set up
For authentication, we use jwt to create an access token. For dev purposes, each dev will need to set up their own ACCESS_TOKEN_SECRET in their .env file. To do so:
- run ```node```
- run ```require("crypto").randomBytes(64).toString("hex")```
- paste the results in .env file under ACCESS_TOKEN_SECRET
Note that each dev's token will be different since it's random. To debug, you can use jwt's website to do so. 

## Miscellaneous
### Debugging:
- If any issues with connection to your database try adding: 
```"socketPath": "/var/run/mysqld/mysqld.sock"``` under dev.json 


### Production
To start or stop the server from running:
- ```sudo systemctl start YourAppName.service``` to start the server
- ```sudo systemctl stop YourAppName.service``` to stop the server

## Demo information
### Testing User
- Use karen.smith@gmail.com with the password "pw" to login to a generic account.

- For demo purposes, clicking on the returning user "Karen" will automatically log in without needing to input password. 
