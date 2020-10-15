const { Transform } = require('stream');

/**
 * The BackPressureTransform class adds a utility method addData which
 * allows for pushing data to the Readable, while honoring back-pressure.
 * Source: https://stackoverflow.com/a/54028749
 */
class BackPressureTransform extends Transform {
  /**
   * Asynchronously add a chunk of data to the output, honoring back-pressure.
   *
   * @param {String} data
   * The chunk of data to add to the output.
   *
   * @returns {Promise<void>}
   * A Promise resolving after the data has been added.
   */
  async addData(data) {
    // if .push() returns false, it means that the readable buffer is full
    // when this occurs, we must wait for the internal readable to emit
    // the 'drain' event, signalling the readable is ready for more data
    if (!this.push(data)) {
      await new Promise((resolve, reject) => {
        const errorHandler = (error) => {
          this.emit('error', error);
          reject(error);
        };
        const boundErrorHandler = errorHandler.bind(this);

        // eslint-disable-next-line array-callback-return
        this._readableState.pipes.map((s) => {
          const pipe = s;
          pipe.on('error', boundErrorHandler);
          pipe.once('drain', () => {
            pipe.off('error', boundErrorHandler);
            resolve();
          });
        });
      });
    }
  }
}

module.exports = {
  BackPressureTransform,
};
