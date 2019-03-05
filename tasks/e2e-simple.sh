#!/bin/bash

# ******************************************************************************
# This is an end-to-end test intended to run on CI.
# ******************************************************************************

# Start in tasks/ even if run from root directory
cd "$(dirname "$0")"

function cleanup {
	echo 'Cleaning up.'
	cd "$root_path"
	rm -rf dist
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

function do_not_exists {
	for f in $*; do
		test ! -e "$f"
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

# Bootstrap monorepo
npm i

# Lint md files
npm run lint:md

# Run tests with CI flag
CI=true npm run test

# Test local build command
npm run build

# Test local icon build command
npm run icons

# Check for expected output
exists dist/core.js
exists dist/core.min.js
exists dist/core.min.css
exists dist/scss.min.css
exists dist/icons.php

# Cleanup
cleanup
