const axios = require('axios');
const fs = require('fs');
const Path = require('path');
const _ = require('lodash');
const promiseRetry = require('promise-retry');
const globalTunnel = require('global-tunnel-ng');
const stringify = require('json-stringify-safe');

// eslint-disable-next-line no-unused-vars
const pkginfo = require('pkginfo')(module);

const { transports } = require('winston');
const logger = require('./lib/logger');
const myutil = require('./lib/util');
const configuration = require('./config');

const bpjsonatatransform = require('./lib/streams/backpressuretransform.jsonata');
const bpcsvtransform = require('./lib/streams/backpressuretransform.csv');

const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Load a local JSON file
 *
 * @param {*} fileName
 * @param {*} type
 */
const loadJsonFromFile = async (options) =>
  new Promise((resolve, reject) => {
    const loggingOptions = {
      label: 'loadJsonFromFile',
    };
    logger.info(`Loading JSON from ${options.localjsonfile}`, loggingOptions);
    fs.readFile(options.localjsonfile, 'utf8', (err, data) => {
      // if has error reject, otherwise resolve
      let response = null;
      try {
        response = JSON.parse(data);
      } catch (error) {
        reject(err);
      }
      return err ? reject(err) : resolve(response);
    });
  });

/**
 * Call Percipio API
 *
 * @param {*} options
 * @returns
 */
const callPercipio = async (options) => {
  return promiseRetry(async (retry, numberOfRetries) => {
    const loggingOptions = {
      label: 'callPercipio',
    };

    const requestUri = options.request.uri;
    logger.debug(`Request URI: ${requestUri}`, loggingOptions);

    let requestParams = options.request.query || {};
    requestParams = _.omitBy(requestParams, _.isNil);
    logger.debug(
      `Request Querystring Parameters: ${JSON.stringify(requestParams)}`,
      loggingOptions
    );

    let requestBody = options.request.body || {};
    requestBody = _.omitBy(requestBody, _.isNil);
    logger.debug(`Request Body: ${JSON.stringify(requestBody)}`, loggingOptions);

    const axiosConfig = {
      url: requestUri,
      headers: {
        Authorization: `Bearer ${options.request.bearer}`,
      },
      method: options.request.method,
    };

    if (!_.isEmpty(requestBody)) {
      axiosConfig.data = requestBody;
    }

    if (!_.isEmpty(requestParams)) {
      axiosConfig.params = requestParams;
    }

    logger.debug(`Axios Config: ${JSON.stringify(axiosConfig)}`, loggingOptions);

    try {
      const response = await axios.request(axiosConfig);
      logger.debug(`Response Headers: ${JSON.stringify(response.headers)}`, loggingOptions);
      logger.silly(`Response Body: ${JSON.stringify(response.data)}`, loggingOptions);

      return response;
    } catch (err) {
      logger.warn(
        `Trying to get report. Got Error after Attempt# ${numberOfRetries} : ${err}`,
        loggingOptions
      );
      if (err.response) {
        logger.debug(`Response Headers: ${JSON.stringify(err.response.headers)}`, loggingOptions);
        logger.debug(`Response Body: ${JSON.stringify(err.response.data)}`, loggingOptions);
      } else {
        logger.debug('No Response Object available', loggingOptions);
      }
      if (numberOfRetries < options.retry_options.retries + 1) {
        retry(err);
      } else {
        logger.error('Failed to call Percipio', loggingOptions);
      }
      throw err;
    }
  }, options.retry_options);
};

/**
 * Loop thru calling the API until all records delivered,
 * pass thru a stream and  return the path to the ndjson file
 *
 * @param {*} options
 * @returns {string} ndjson file path
 */
const getAllMetadataAndTransformAndExportToCSV = async (options) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const loggingOptions = {
      label: 'getAllMetadata',
    };

    const opts = options;

    // const results = [];

    let keepGoing = true;
    let reportCount = true;
    let totalRecords = 0;
    let downloadedRecords = 0;

    const extension = opts.outputextension || 'csv';
    const filename = opts.outputfilename || 'result';

    const outputFile = Path.join(opts.outputpath, `${filename}.${extension}`);

    const step1 = new bpjsonatatransform.JSONataStream(options); // Use object mode and outputs object
    const step2 = new bpcsvtransform.CSVStream(options); // Use object mode and outputs object
    // const step2 = ndjson.stringify(); // Use Object mode and outputs string
    const step3 = fs.createWriteStream(outputFile);

    const outputStream = step1.pipe(step2).pipe(step3);

    outputStream.on('finish', () => {
      logger.info(`Outputstream Finish. Path: ${outputFile}`, loggingOptions);
    });

    step1.on('error', (error) => {
      logger.error(`Error. Path: ${stringify(error)}`, loggingOptions);
    });

    step2.on('error', (error) => {
      logger.error(`Error. Path: ${stringify(error)}`, loggingOptions);
    });

    step3.on('error', (error) => {
      logger.error(`Error. Path: ${stringify(error)}`, loggingOptions);
    });

    if (_.isNull(opts.localjsonfile)) {
      while (keepGoing) {
        let response = null;
        try {
          // eslint-disable-next-line no-await-in-loop
          response = await callPercipio(opts);

          if (reportCount) {
            totalRecords = parseInt(response.headers['x-total-count'], 10);

            logger.info(
              `Total Records to download as reported in header['x-total-count'] ${totalRecords.toLocaleString()}`,
              loggingOptions
            );
            reportCount = false;
          }
        } catch (err) {
          logger.error('ERROR: trying to download results', loggingOptions);
          keepGoing = false;
          reject(err);
        }

        downloadedRecords += response.data.length;

        // Stream the results
        // Iterate over the records and write EACH ONE to the  stream individually.
        // Each one of these records will become a line in the output file.
        response.data.forEach((record) => {
          step1.write(JSON.stringify(record));
        });

        logger.info(
          `Records Downloaded ${downloadedRecords.toLocaleString()} of ${totalRecords.toLocaleString()}`,
          loggingOptions
        );

        // Set offset - number of records in response
        opts.request.query.offset += response.data.length;

        if (opts.request.query.offset >= totalRecords) {
          keepGoing = false;
        }

        /*       if (response.data.length < opts.request.query.max) {
        keepGoing = false;
      } */
      }
    } else {
      // Load JSON file
      let response = null;
      // eslint-disable-next-line no-await-in-loop
      response = await loadJsonFromFile(opts);

      logger.info(`Records Read from file ${response.length.toLocaleString()}`, loggingOptions);

      response.forEach((record) => {
        step1.write(JSON.stringify(record));
      });
    }

    step1.end();
    step3.on('finish', () => {
      logger.info(`Records Saved. Path: ${outputFile}`, loggingOptions);
      resolve(outputFile);
    });
  });
};

/**
 * Process the Percipio call
 *
 * @param {*} options
 * @returns
 */
const main = async (configOptions) => {
  const loggingOptions = {
    label: 'main',
  };

  const options = configOptions || null;

  if (_.isNull(options)) {
    logger.error('Invalid configuration', loggingOptions);
    return false;
  }

  // Set logging to silly level for dev
  if (NODE_ENV.toUpperCase() === 'DEVELOPMENT') {
    logger.level = 'debug';
  } else {
    logger.level = options.debug.loggingLevel;
  }

  // Create logging folder if one does not exist
  if (!_.isNull(options.debug.logpath)) {
    if (!fs.existsSync(options.debug.logpath)) {
      myutil.makeFolder(options.debug.logpath);
    }
  }

  // Create outpur folder if one does not exist
  if (!_.isNull(options.outputpath)) {
    if (!fs.existsSync(options.outputpath)) {
      myutil.makeFolder(options.outputpath);
    }
  }

  // Add logging to a file
  logger.add(
    new transports.File({
      filename: Path.join(options.debug.logpath, options.debug.logFile),
      options: {
        flags: 'w',
      },
    })
  );

  options.logger = logger;

  logger.info(`Start ${module.exports.name}`, loggingOptions);

  logger.debug(`Options: ${stringify(options)}`, loggingOptions);

  if (options.debug.checkFiddler) {
    logger.info('Checking if Fiddler is running', loggingOptions);

    const result = await myutil.isFiddlerRunning(
      options.debug.fiddlerAddress,
      options.debug.fiddlerPort
    );

    if (result) {
      logger.info('Setting Proxy Configuration so requests are sent via Fiddler', loggingOptions);

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

      globalTunnel.initialize({
        host: options.debug.fiddlerAddress,
        port: options.debug.fiddlerPort,
      });
    }
  } else {
    // Use the process.env.http_proxy and https_proxy
    globalTunnel.initialize();
  }

  if (_.isNull(options.request.path.orgId)) {
    logger.error(
      'Invalid configuration - no orgid in config file or set env ORGID',
      loggingOptions
    );
    return false;
  }

  if (_.isNull(options.request.bearer)) {
    logger.error('Invalid configuration - no bearer or set env BEARER', loggingOptions);
    return false;
  }

  logger.info('Calling Percipio', loggingOptions);
  await getAllMetadataAndTransformAndExportToCSV(options).catch((err) => {
    logger.error(`Error:  ${err}`, loggingOptions);
  });
  logger.info(`End ${module.exports.name}`, loggingOptions);
  return true;
};

main(configuration);
