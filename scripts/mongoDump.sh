#!/usr/bin/env bash

# Dump the entries in the "users" collection
echo -e "use emaily-dev \n db.users.find()" | mongo
