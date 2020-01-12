#!/usr/bin/env node
"use strict";
const util = require("util");
const path = require("path");
const fs = require("fs");
const { Transform } = require('stream');
const zlib = require("zlib");

const CAF = require("caf")

const args = require("minimist")(process.argv.slice(2), {
  boolean: ["help", "in", "out", "compress", "uncompress"],
  string: ["file"]
});

processFile = CAF(processFile);

var BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);

var OUTFILE = path.join(BASE_PATH, "out.txt");

if (args.help) {
  
  printHelp();

} else if (args.in || args._.includes("-")) {

  let tooLong = CAF.timeout(12, "Took too long");

  processFile(tooLong, process.stdin)
  .catch(error)

} else if (args.file) {

  let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
  
  let tooLong = CAF.timeout(12, "Took too long");

  processFile(tooLong, stream)
  .then(function() {
    console.log("\nComplete!")
  })
  .catch(error)
  
} else {
  
  error("Incorrect usage.", true);

}

// *****************************

function *processFile(signal, inStream) {
  let outStream = inStream;

  if (args.uncompress) {
    let gunzipStream = zlib.createGunzip();
    outStream = outStream.pipe(gunzipStream)
  }

  const upperStream = new Transform({
    transform(chunk, enc, callback) {
      this.push(chunk.toString().toUpperCase())
      callback()
    }
  })

  outStream = outStream.pipe(upperStream);

  if (args.compress) {

    let gzipStream = zlib.createGzip();
    outStream = outStream.pipe(gzipStream);
    OUTFILE = `${OUTFILE}.gz`;
  }

  let targetStream;
  
  if (args.out) {
    targetStream = process.stdout; 
  } else {
    targetStream = fs.createWriteStream(OUTFILE);
  }

  outStream.pipe(targetStream);

  signal.pr.catch(function() {
    outStream.unpipe(targetStream);
    outStream.destroy();
  });

  yield streamComplete(outStream);
}

function streamComplete(stream) {
  return new Promise(function (res) {
    stream.on("end", res)
  });
}

function error(msg, includeHelp = false) {
  console.error(msg);
  if (includeHelp) {
    printHelp();
    console.log("");
  }
}

function printHelp() {
  console.log("ex3 usage:");
  console.log("   ex3.js --help\n");
  console.log("--help                   print this help\n");
  console.log("--file={FILENAME}        process the file");
  console.log("--in, -                  process stdin");
  console.log("--out                    print to stdout");
  console.log("--compress               gzip the output");
  console.log("--uncompress             un-gzip the input");
  console.log("")
}
