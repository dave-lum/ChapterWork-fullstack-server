#!/usr/bin/env bash

# Create a database and create the "admin" user in it
echo -e "use emaily-dev\n db.createUser({user:'admin', pwd:'admin', roles: []})" | mongo

# Create a collection named "users"
echo -e "use emaily-dev\n db.createCollection('users')" | mongo

