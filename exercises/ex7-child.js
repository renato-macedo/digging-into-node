"use strict";

var fetch = require("node-fetch");


// ************************************

const HTTP_PORT = 8039;


main().catch(() => 1);


// ************************************

async function main() {
	// TODO
	var x = 0
	for (let i =0 ; i < 10000; i++) {
		// console.log(x)
		x = i + 1
	}
}
