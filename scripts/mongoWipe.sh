#!/usr/bin/env bash

# Wipe out all users
echo -e "use emaily-dev\n db.users.remove({})" | mongo

