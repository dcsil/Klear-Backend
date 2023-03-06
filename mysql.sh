#!/bin/bash
# Read Password
echo -n Username:
read -s username
# echo -n Password:
# read -s password
echo
# Run Command
mysql -u $username -p < ./db.sql
# SOURCE ./example.sql