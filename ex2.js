#!/usr/bin/env node
"use strict";
const util = require("util");
const path = require("path");
const fs = require("fs");

const args = require("minimist")(process.argv.slice(2), {
  boolean: ["help", "in"],
  string: ["file"]
});

const BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);

if (args.help) {
  
  printHelp();

} else if (args.in || args._.includes("-")) {

  processFile(process.stdin);

} else if (args.file) {

  let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
  processFile(stream);

} else {
  
  error("Incorrect usage.", true);

}

// *****************************

function processFile(inStream) {
  const outStream = inStream;
  const targetStream = process.stdout;

  outStream.pipe(targetStream);
}

function error(msg, includeHelp = false) {
  console.error(msg);
  if (includeHelp) {
    printHelp();
    console.log("");
  }
}

function printHelp() {
  console.log("ex1 usage:");
  console.log("   ex1.js --help\n");
  console.log("--help                   print this help\n");
  console.log("--file={FILENAME}        process the file");
  console.log("--in, -                  process stdin");
}
