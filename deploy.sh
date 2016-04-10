#!/bin/bash

mupx deploy
echo "Copying images from last to current bundle..."
cp -r /opt/coffeecu/last/bundle/.uploads/* /opt/coffeecu/current/bundle/.uploads
echo "Creating image backups"
cp -r /opt/coffeecu/current/bundle/.uploads/* ~/dev/backups
echo "Done"
