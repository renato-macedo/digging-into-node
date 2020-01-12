#!/usr/bin/env node
'use strict';
const util = require('util');
const path = require('path');
const fs = require('fs');
const getStdin = require('get-stdin');

const args = require('minimist')(process.argv.slice(2), {
  boolean: ['help', 'in'],
  string: ['file']
});

const BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);

if (args.help) {
  printHelp();
} else if (args.in || args._.includes('-')) {
  getStdin()
    .then(processFile)
    .catch(error);
} else if (args.file) {
  fs.readFile(path.join(BASE_PATH, args.file), function(err, contents) {
    if (err) {
      error(err.toString());
    } else {
      processFile(contents.toString());
    }
  });
} else {
  error('Incorrect usage.', true);
}

// *****************************

function processFile(contents) {
  contents = contents.toUpperCase();
  process.stdout.write(contents);
}

function error(msg, includeHelp = false) {
  console.error(msg);
  if (includeHelp) {
    printHelp();
    console.log('');
  }
}

function printHelp() {
  console.log('ex1 usage:');
  console.log('   ex1.js --help\n');
  console.log('--help                   print this help\n');
  console.log('--file={FILENAME}        process the file');
  console.log('--in, -                  process stdin');
}
