#!/usr/bin/env bash

# Initializes a new Mongo database for use with the Full Stack JS Udemy course,
# including creating an "admin" user, an "emaily-dev" database, and an empty
# collection named "users".
#
# The Mongo URL to use after running this script is:
#
#   mongodb://admin:admin@localhost:27017/emaily-dev

# Before running this script, make sure you've done "brew install mongo"
# and also started the local Mongo DB server.

# Create a database and create the "admin" user in it
echo -e "use emaily-dev\n db.createUser({user:'admin', pwd:'admin', roles: []})" | mongo

# Create a collection named "users"
echo -e "use emaily-dev\n db.createCollection('users')" | mongo

