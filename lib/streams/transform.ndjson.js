const { Transform } = require('stream');
const { EOL } = require('os').EOL;
const stringify = require('json-stringify-safe');

/**
 * Stream transformer that converts the object passed to new line delimited JSON (ndjson)
 *
 * @class NDJSONStream
 * @extends {Transform}
 */
class NDJSONStream extends Transform {
  /**
   *Creates an instance of NDJSONStream.
   * @param {*} options
   * @memberof ndjsonStream
   */
  constructor(options) {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
      ...options
    });
    this.options = options;

    this.counter = 0;
    this.loggingOptions = {
      label: 'NDJSONStream'
    };
    this.logger = typeof this.options.logger === 'object' ? this.options.logger : null;
    this.log = typeof this.options.logger === 'object';
    this.logcount = this.options.logcount || 100;
  }

  /**
   *
   *
   * @param {any|String|Buffer} chunk The object to process
   * @param {*} encoding
   * @param {*} callback
   * @returns {String}
   * @memberof NDJSONStream
   */
  _transform(chunk, encoding, callback) {
    const self = this;
    let data = chunk;

    if (self.log && self.counter % self.logcount === 0) {
      self.logger.info(
        `Processing. Processed: ${self.counter.toLocaleString()}`,
        self.loggingOptions
      );
    }

    if (typeof chunk === 'object' && chunk !== null) {
      data = stringify(chunk);
    }

    const result = `${data}${EOL}`;
    self.counter += 1;
    return callback(null, result);
  }

  /**
   *
   *
   * @param {*} callback
   * @returns
   * @memberof NDJSONStream
   */
  _flush(callback) {
    const self = this;

    if (self.log) {
      self.logger.info(
        `Processing Completed . Processed: ${self.counter.toLocaleString()}`,
        self.loggingOptions
      );
    }

    return callback(null);
  }
}

module.exports = {
  NDJSONStream
};
