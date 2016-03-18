#!/bin/bash

echo "Copying images from last to current bundle..."
cp -r /opt/coffeecu/last/bundle/.uploads /opt/coffeecu/current/bundle/.uploads
echo "Done"
