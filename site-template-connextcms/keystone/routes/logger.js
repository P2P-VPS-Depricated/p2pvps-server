/*
 * Copyright 2017 Chris Troutner & P2PVPS.org
 * Licensing Information: MIT License
 *
 * This library file to handle logging on the Server. It's a utility file used
 * by the other API handlers in this directory.
 */

'use strict';

// Libraries
const winston = require('winston');

// Globals

class Logger {
  constructor () {
    // Set up the Winston logging.
    winston.add(winston.transports.File, {
      filename: '../logs/p2pvps-server.log',
      maxFiles: 1,
      colorize: false,
      timestamp: true,
      datePattern: '.yyyy-MM-ddTHH-mm',
      maxsize: 1000000,
      json: false
    });

    // Set the logging level.
    // winston.level = 'debug';
    winston.level = 'info';

    // Start first line of the log.
    const now = new Date();
    winston.log('info', `Application starting at ${now}`);
  }

  info (log) {
    winston.log('info', log);
  }

  log (log) {
    this.info(log);
  }

  debug (log) {
    winston.log('debug', log);
  }

  silly (log) {
    winston.log('silly', log);
  }

  error (log, ...args) {
    console.error(log, args);
    winston.error(log, args);
  }

  warn (log, ...args) {
    console.warn(log, ...args);
    winston.warn(log, ...args);
  }
}

module.exports = Logger;
