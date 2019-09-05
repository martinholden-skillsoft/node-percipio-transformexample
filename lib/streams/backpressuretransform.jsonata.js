// const { Transform } = require('stream');
const jsonata = require('jsonata');
const fs = require('fs');
const Path = require('path');

const { BackPressureTransform } = require('./back-pressure-transform');

/**
 * Stream transformer that runs the object passed thru JSONata
 *
 * @class JSONataStream
 * @extends {BackPressureTransform}
 */
class JSONataStream extends BackPressureTransform {
  /**
   *Creates an instance of JSONataStream.
   * @param {*} options
   * @memberof JSONataStream
   */
  constructor(options) {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
      ...options
    });
    this.options = options;
    this.counter = 0;

    this.transformExpr = fs.readFileSync(
      Path.join('transform', `${options.customer}.jsonata`),
      'utf8'
    );

    this.transformer = jsonata(this.transformExpr);
    this.loggingOptions = {
      label: 'JSONataStream'
    };
    this.logger = typeof this.options.logger === 'object' ? this.options.logger : null;
    this.log = typeof this.options.logger === 'object';
    this.logcount = this.options.logcount || 100;

    // JSONata Bindings
    this.binding = this.options.jsonataBinding || {};

    if (this.log) {
      this.logger.debug(`JSONata Binding: ${JSON.stringify(this.binding)}`, this.loggingOptions);
    }
  }

  /**
   *
   *
   * @param {any} chunk The object to process
   * @param {*} encoding
   * @param {*} callback
   * @returns
   * @memberof JSONataStream
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

    if (typeof chunk !== 'object' && chunk !== null) {
      data = JSON.parse(chunk);
    }

    try {
      const result = self.transformer.evaluate(data, this.binding);
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
   * @memberof JSONataStream
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
  JSONataStream
};
