#!/bin/bash

echo "Backing up database"
cd ~/dev/projects/coffeecu
mongo coffeecu < mongo-backup.sh 
echo "Creating image backups"
cp -r /opt/coffeecu/current/bundle/.uploads/* ~/dev/backups/images
echo "Done"
