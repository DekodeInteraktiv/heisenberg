/**
 * Main kitchensink JS file
 */
class Heisenberg {
	constructor() {
		const options = {
			test: true,
		};

		this.boot( options );
	}

	boot( options ) {
		this.options = {
			...options,
			fixture: true,
		};

		if ( this.options.test ) {
			console.log( 'Test enabled' );
		}

		if ( this.options.fixture ) {
			console.log( 'Fixture enabled' );
		}
	}
}

const heisenbergClass = new Heisenberg();
window.Heisenberg = heisenbergClass;
