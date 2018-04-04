#!/usr/bin/env bash

# Starts the MongoDB server in the foreground (NOT as a service).
# Before running this script, make sure you've done "brew install mongo".

mongod --config /usr/local/etc/mongod.conf
