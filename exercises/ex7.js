#!/usr/bin/env node

"use strict";

var util = require("util");
var childProc = require("child_process");


// ************************************

const HTTP_PORT = 8039;
const MAX_CHILDREN = 1500;

var delay = util.promisify(setTimeout);


main().catch(console.error);


// ************************************

async function main() {
	// console.log(`Load testing http://localhost:${HTTP_PORT}...`);
	while (true) {
		process.stdout.write(`Sending ${MAX_CHILDREN} requests... `)

		let children = []
		for (let i = 0; i < MAX_CHILDREN; i++) {
			children.push(
				childProc.spawn("node", ["ex7-child.js"])
			)
		}
		let responses = children.map(child => {
			return new Promise((res) => {
				child.on("exit", code => {
					if (code === 0) {
						res(true)
					} else {
						res(false)
					}
				})
			})
		})

		responses = await Promise.all(responses)
		if (responses.filter(Boolean).length == MAX_CHILDREN) {
			console.log("Success!")
		} else {
			console.log("Failure!")
		}

		await delay(500)

	}
}
