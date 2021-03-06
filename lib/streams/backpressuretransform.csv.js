const papa = require('papaparse');

const { BackPressureTransform } = require('./back-pressure-transform');
/**
 * Stream transformer that runs the object passed thru CSV
 *
 * @class CSVStream
 * @extends {BackPressureTransform}
 */
class CSVStream extends BackPressureTransform {
  /**
   *Creates an instance of CSVStream.
   * @param {*} options
   * @memberof CSVStream
   */
  constructor(options) {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
      ...options,
    });
    this.options = options;

    this.papaOptions = { ...this.options.textoptions };

    this.counter = 0;
    this.loggingOptions = {
      label: 'CSVStream',
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
   * @memberof CSVStream
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

    if (self.counter === 1 && self.papaOptions.header) {
      self.papaOptions.header = false;
    }

    try {
      const result = papa.unparse([data], self.papaOptions);

      if (Array.isArray(result)) {
        result.forEach(async (record) => {
          self.counter += 1;
          await self.addData(`${record}${self.papaOptions.newline}`);
        });
      } else {
        self.counter += 1;
        await self.addData(`${result}${self.papaOptions.newline}`);
      }

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
   * @memberof CSVStream
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
  CSVStream,
};
