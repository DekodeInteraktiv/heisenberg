#!/bin/bash

# Colors
red=`tput setaf 1`
reset=`tput sgr0`

# Start in tasks/ even if run from root directory
cd "$(dirname "$0")"

# Exit the script on any command with non 0 return code
# We assume that all the commands in the pipeline set their return code
# properly and that we do not need to validate that the output is correct
set -e

# Go to root
cd ..
root_path=$PWD

# Check if we are in master branch
if [[ "$(git branch | grep \* | cut -d ' ' -f2)" != "master" ]] ; then
  echo "${red}You can only publish from the \"master\" branch${reset}"
  exit 1;
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "${red}Your git status is not clean. Aborting.${reset}"
  exit 1;
fi

# Publish
./node_modules/.bin/lerna publish --independent "$@"
