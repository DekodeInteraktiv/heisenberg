#!/bin/bash

# ******************************************************************************
# This is an end-to-end test intended to run on CI.
# ******************************************************************************

# Start in tasks/ even if run from root directory
cd "$(dirname "$0")"

original_npm_registry_url=`npm get registry`
original_yarn_registry_url=`yarn config get registry`

function cleanup {
  echo 'Cleaning up.'
  cd "$root_path"
  # Uncomment when snapshot testing is enabled by default:
  # rm ./packages/react-scripts/template/src/__snapshots__/App.test.js.snap
  rm -rf dist
  npm set registry "$original_npm_registry_url"
  yarn config set registry "$original_yarn_registry_url"
}

# Error messages are redirected to stderr
function handle_error {
  echo "$(basename $0): ERROR! An error was encountered executing line $1." 1>&2;
  cleanup
  echo 'Exiting with error.' 1>&2;
  exit 1
}

function handle_exit {
  cleanup
  echo 'Exiting without error.' 1>&2;
  exit
}

# Check for the existence of one or more files.
function exists {
  for f in $*; do
    test -e "$f"
  done
}

# Exit the script with a helpful error message when any error is encountered
trap 'set +x; handle_error $LINENO $BASH_COMMAND' ERR

# Cleanup before exit on any termination signal
trap 'set +x; handle_exit' SIGQUIT SIGTERM SIGINT SIGKILL SIGHUP

# Echo every command being executed
set -x

# Go to root
cd ..
root_path=$PWD

if hash npm 2>/dev/null
then
  npm i -g npm@latest
  npm cache verify
fi

# Bootstrap monorepo
yarn

# Lint all JS / MD files
yarn lint

# Run tests
cd packages/stylelint-config-heisenberg/
yarn test
cd ../..

# Test local build command
yarn build

# Check for expected output
exists dist/js/*.js
exists dist/css/*.css

# Test local start command
yarn start --smoke-test

# Test local icon build command
yarn icons

# Check for expected output
exists dist/icons.php

# Lint icon file.
composer install
./vendor/bin/phpcs

# Unit test icon file
bash tasks/install-wp-tests.sh wordpress_test root '' localhost latest
./vendor/bin/phpunit

# Cleanup
cleanup
