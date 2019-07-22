const moment = require('moment');

const config = {};

// Indicates a name for the configuration
config.customer = 'none';
config.startTimestamp = moment()
  .utc()
  .format('YYYYMMDD_HHmmss');

// DEBUG Options - Enables the check for Fiddler, if running the traffic is routed thru Fiddler
config.debug = {};
// Check for fiddler
config.debug.checkFiddler = false;
// Fiddler IP address
config.debug.fiddlerAddress = '127.0.0.1';
// Fiddler Port
config.debug.fiddlerPort = '8888';
// Debug logging
// One of the supported default logging levels for winston - see https://github.com/winstonjs/winston#logging-levels
config.debug.loggingLevel = 'info';
config.debug.logpath = 'logs';
config.debug.logFile = `app_${config.startTimestamp}.log`;

// Output path
config.outputpath = 'results/output';

// Formatting options for the flat file exported using papaparse
// See https://github.com/mholt/PapaParse
config.textoptions = {};
config.textoptions.quotes = true;
config.textoptions.quoteChar = '"';
config.textoptions.escapeChar = '"';
config.textoptions.delimiter = ',';
config.textoptions.header = true;
config.textoptions.newline = '\r\n';

// Request
config.request = {};
// Bearer Token
config.request.bearer = null;
// Base URI to Percipio API
config.request.baseuri = 'https://api.percipio.com';
// Request Path Parameters
config.request.path = {};
/**
 * Name: orgId
 * Description: Organization UUID
 * Required: true
 * Type: string
 * Format: uuid
 */
config.request.path.orgId = null;
// Request Query string Parameters
config.request.query = {};
// Request Body
config.request.body = null;
// Method
config.request.method = 'get';
// The Service Path
config.request.uri = `${config.request.baseuri}/content-discovery/v1/organizations/${config.request.path.orgId}/catalog-content`;

// Global Web Retry Options for promise retry
// see https://github.com/IndigoUnited/node-promise-retry#readme
config.retry_options = {};
config.retry_options.retries = 3;
config.retry_options.minTimeout = 1000;
config.retry_options.maxTimeout = 2000;

module.exports = config;
