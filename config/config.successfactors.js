const config = require('./config.global');

config.customer = 'successfactors';

// Debug logging
// One of the supported default logging levels for winston - see https://github.com/winstonjs/winston#logging-levels
// config.debug.loggingLevel = 'debug';
// Check for fiddler
config.debug.checkFiddler = false;
// Fiddler IP address
config.debug.fiddlerAddress = '127.0.0.1';
// Fiddler Port
config.debug.fiddlerPort = '8888';
// Debug logging
// One of the supported default logging levels for winston - see https://github.com/winstonjs/winston#logging-levels
// config.debug.loggingLevel = 'debug';
config.debug.logpath = `results/${config.customer}`;
config.debug.logFile = `${config.customer}.log`;

// Output path
config.outputpath = `results/${config.customer}`;

// JSONata Bindings
config.jsonataBinding = {};

// An example of how the "overides" could be specified in the Scheduler job
const exampleSchedulerConfig = {
  activity: {
    activityName: 'CONTENT_DISCOVERY',
    preferences: {
      action: 'CONTENT_EXPORT',
      transformName: 'SuccessFactors',
      override: {
        common: {
          UseExtendedDescription: true,
          ExtendedDescriptionEOL: '  ',
          IncludeTechnologyDetailsInTitle: true,
          IncludeContentTypeInTitle: true,
          ShareLinkParametersLookup: {
            audiobook: '?chromeless',
            book: '?chromeless',
            channel: '',
            course: '?chromeless',
            linked_content: '?chromeless',
            video: '?chromeless'
          }
        },
        successfactors: {
          showincataloglookup: {
            audiobook: 'Y',
            book: 'Y',
            channel: 'Y',
            course: 'Y',
            linked_content: 'Y',
            video: 'Y'
          },
          onlinestatuslookup: {
            audiobook: 'Y',
            book: 'Y',
            channel: 'Y',
            course: 'Y',
            linked_content: 'Y',
            video: 'Y'
          },
          languagelookup: {
            en: 'English',
            fr: 'French',
            'fr-FR': 'French',
            de: 'German',
            'de-DE': 'German',
            es: 'Spanish',
            'es-ES': 'Spanish',
            'es-DO': 'Spanish'
          },
          defaultlanguage: 'English',
          typelookup: {
            'audiobook~audiobook~audiobook summary': 'AUDIO SUMMARY',
            'audiobook~audiobook~audiobook': 'AUDIOBOOK',
            'book~book~book': 'BOOK',
            'book~book~book review': 'BOOK',
            'book~book~book summary': 'BOOK SUMMARY',
            'channel~channel~channel': 'CHANNEL',
            'course~course~course': 'COURSE',
            'linked_content~assessment~testprep': 'LINKED CONTENT',
            'linked_content~~practice lab': 'LINKED CONTENT',
            'linked_content~~wintellect': 'LINKED CONTENT',
            'linked_content~course~course': 'LINKED CONTENT',
            'video~video~video': 'VIDEO'
          },
          completionlookup: {
            'audiobook~audiobook~audiobook summary': 'AUDIO-BK-SUMM-COMPL',
            'audiobook~audiobook~audiobook': 'AUDIO-BK-COMPL',
            'book~book~book': 'BOOK-COMPL',
            'book~book~book review': 'UNKNOWN',
            'book~book~book summary': 'BOOK-SUMM-COMPL',
            'channel~channel~channel': 'CHANNEL-COMPL',
            'course~course~course': 'COURSE-COMPL',
            'linked_content~assessment~testprep': 'LINKED-CTNT-COMPL',
            'linked_content~~practice lab': 'LINKED-CTNT-COMPL',
            'linked_content~~wintellect': 'LINKED-CTNT-COMPL',
            'linked_content~course~course': 'LINKED-CTNT-COMPL',
            'video~video~video': 'VIDEO-COMPL'
          },
          defaultcatalog: 'EXTERNAL',
          cpntsrcid: 'SKILLSOFT',
          buildcompany: 'Percipio',
          chgbackmethod: 1,
          timestampformat: '[MNn,*-3]-[D01]-[Y0001] [H01]:[m01]:[s01][z]',
          timezoneoffset: '-0500'
        }
      },
      filename: {
        outputPath: 'Skillsoft/itemconn/sf',
        includeDate: false,
        filenamePrefix: 'item_data_CLAQ1NA',
        filenameSuffix: 'csv'
      },
      sftp: {
        sftpConfigUuid: 'fa20850f-71a2-462c-973c-9f30e6f4a961'
      },
      csvOptions: {
        delimiter: '|',
        header: true,
        newline: '!##!\r\n'
      }
    }
  },
  startAt: '2019-01-28T11:01:00.000Z',
  jobConfig: {
    type: 'ASYNC',
    maxRetryCount: 5
  }
};

config.jsonataBinding.override = exampleSchedulerConfig.activity.preferences.override;

// File Extension
config.outputextension = 'txt';

// Formatting options for the flat file exported using papaparse
// See https://github.com/mholt/PapaParse
config.textoptions = {};
config.textoptions.quotes = true;
config.textoptions.quoteChar = '"';
config.textoptions.escapeChar = '"';
config.textoptions.delimiter = '|';
config.textoptions.header = true;
config.textoptions.newline = '!##!\r\n';

// Request
config.request = {};
// Bearer Token
config.request.bearer = process.env.BEARER || null;
// Base URI to Percipio API
config.request.baseuri = 'https://api.percipio.com';
// Request Path Parameters
config.request.path = {};
/**
 * Name: orgId
 * Description : Organization UUID
 * Required: true
 * Type: string
 * Format: uuid
 */
config.request.path.orgId = process.env.ORGID || null;

// Request Query string Parameters
config.request.query = {};
/**
 * Name: typeFilter
 * Description : Array of types to restrict results to
 * Type: string[]
 * Enum: COURSE,VIDEO,BOOK,AUDIOBOOK,CHANNEL,LINKED_CONTENT
 */
config.request.query.typeFilter = null;
/**
 * Name: licensePoolIds
 * Description : Array of License pool IDs to which to restrict content.
 * Type: string[]
 */
config.request.query.licensePoolIds = null;
/**
 * Name: updatedSince
 * Description : Filter criteria that only returns content updated since the date specified
 * in GMT with an ISO format.  When this parameter is not included, only ACTIVE content will
 * be returned.  When this parameter is included with a date, the response can include both
 * ACTIVE and INACTIVE content.
 * Type: string
 * Format: date-time
 */
config.request.query.updatedSince = '2019-09-01T00:00:00Z';
/**
 * Name: offset
 * Description : Used in conjunction with 'max' to specify which set of 'max' content items
 * should be returned. The default is 0 which returns 1 through max content items. If offset
 * is sent as 1, then content items 2 through max+1 are returned.
 * Type: integer
 */
config.request.query.offset = null;
/**
 * Name: max
 * Description : The maximum number of content items to return in a response. The default is
 * 1000. Valid values are between 1 and 1000.
 * Type: integer
 * Minimum: 1
 * Maximum: 1000
 * Default: 1000
 */
config.request.query.max = 1000;

// Request Body
config.request.body = null;

// Method
config.request.method = 'get';
// The Service Path
config.request.uri = `${config.request.baseuri}/content-discovery/v1/organizations/${config.request.path.orgId}/catalog-content`;

module.exports = config;
