#!/usr/bin/env node
'use strict';

const spawn = require( 'cross-spawn' );
const script = process.argv[2];
const args = process.argv.slice( 3 );

switch ( script ) {
	case 'build':
	case 'start': {
		const result = spawn.sync(
			'node',
			[require.resolve( `../scripts/${script}` )].concat( args ),
			{ stdio: 'inherit' }
		);

		if ( result.signal ) {
			if ( 'SIGKILL' === result.signal ) {
				console.log(
					'The build failed because the process exited too early. ' +
					'This probably means the system ran out of memory or someone called ' +
					'`kill -9` on the process.'
				);
			} else if ( 'SIGTERM' === result.signal ) {
				console.log(
					'The build failed because the process exited too early. ' +
					'Someone might have called `kill` or `killall`, or the system could ' +
					'be shutting down.'
				);
			}

			process.exit( 1 );
		}

		process.exit( result.status );
		break;
	}
	default:
		console.log( `Unknown script ${script}` );
		break;
}
