const { EOL } = require('os').EOL;
const stringify = require('json-stringify-safe');

const { BackPressureTransform } = require('./back-pressure-transform');

/**
 * Stream transformer that converts JSON to NDJSON
 *
 * @class NDJSONStream
 * @extends {BackPressureTransform}
 */
class NDJSONStream extends BackPressureTransform {
  /**
   *Creates an instance of JSONataStream.
   * @param {*} options
   * @memberof NDJSONStream
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
   * @param {any} chunk The object to process
   * @param {*} encoding
   * @param {*} callback
   * @returns
   * @memberof NDJSONStream
   */
  async _transform(chunk, encoding, callback) {
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

    try {
      const result = `${data}${EOL}`;
      self.counter += 1;

      await self.addData(result);

      return callback(null);
    } catch (error) {
      return callback(error);
    }
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
