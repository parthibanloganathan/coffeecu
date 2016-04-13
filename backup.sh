#!/bin/bash

echo "Creating database backup"
cd ~/dev/projects/coffeecu
mongodump -d coffeecu -o ~/dev/backups/db_dump
echo "Creating image backups"
cp -r /opt/coffeecu/current/bundle/.uploads/* ~/dev/backups/images
echo "Zipping"
cd ~/dev
tar -cvzf backups.tar.gz backups/*
echo "Done"
