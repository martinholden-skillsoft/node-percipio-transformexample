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

// An example of how the "overide" could be specified in the Scheduler job
const exampleSchedulerConfig = {
  activity: {
    activityName: 'CONTENT_DISCOVERY',
    preferences: {
      action: 'CONTENT_EXPORT',
      transformName: 'SuccessFactors',
      override: {
        comment_common: '{object} Common shared settings for metadata trasnforms',
        common: {
          Comment_UseExtendedDescription:
            '{boolean} Whether to use the extended description option. This combines the descripion and publication data. See the $metadataextendeddescription function',
          UseExtendedDescription: true,
          Comment_ExtendedDescriptionEOL:
            '{string} The EOL characters to use for the Extended Description. See the $metadataextendeddescription function',
          ExtendedDescriptionEOL: '\r\n',
          Comment_IncludeContentTypeInTitle:
            '{boolean} Whether to include contentType.displayLabel as prefix to title. See the $metadatatitle function',
          IncludeContentTypeInTitle: true,
          Comment_IncludeTechnologyDetailsInTitle:
            '{boolean} Whether to include technologies[0].title and version as prefix to title. See the $metadatatitle function',
          IncludeTechnologyDetailsInTitle: true,
          Comment_ShareLinkParametersLookup:
            '{object} The MAPPING between Percipio contentType.percipioType lowercase and any additions to the link. default option to handle unknown types. Returned value (right side) is the string to append to the link',
          ShareLinkParametersLookup: {
            audiobook: '',
            book: '',
            channel: '',
            course: '',
            linked_content: '',
            video: '',
            journey: '',
            default: '',
          },
          Comment_MobileShareLinkParametersLookup:
            '{object} The MAPPING between Percipio contentType.percipioType lowercase and any additions to the link for Mobile. default option to handle unknown types. Returned value (right side) is the string to append to the link',
          MobileShareLinkParametersLookup: {
            audiobook: '?chromeless=true&preventAppDownload=true',
            book: '?chromeless=true&preventAppDownload=true',
            channel: '?chromeless=true&preventAppDownload=true',
            course: '?chromeless=true&preventAppDownload=true',
            linked_content: '?chromeless=true&preventAppDownload=true',
            video: '?chromeless=true&preventAppDownload=true',
            journey: '?chromeless=true&preventAppDownload=true',
            default: '?chromeless=true&preventAppDownload=true',
          },
        },
        comment_successfactors: '{object} Successfactors specific settings for metadata trasnforms',
        successfactors: {
          comment_showincataloglookup:
            'The MAPPING between Percipio contentType.percipioType lowercase and the visibility in the catalog. Y = VISIBLE, N = HIDDEN. This can be used to hide contentTypes if necessary.',
          showincataloglookup: {
            audiobook: 'Y',
            book: 'Y',
            channel: 'Y',
            course: 'Y',
            linked_content: 'Y',
            video: 'Y',
            journey: 'Y',
          },
          comment_onlinestatuslookup:
            'The MAPPING between Percipio contentType.percipioType lowercase and the ONLINE status. Y = ONLINE, N = OFFLINE. This can be used to hide contentTypes if necessary.',
          onlinestatuslookup: {
            audiobook: 'Y',
            book: 'Y',
            channel: 'Y',
            course: 'Y',
            linked_content: 'Y',
            video: 'Y',
            journey: 'Y',
          },
          comment_languagelookup:
            'The MAPPING between Percipio localeCode to SuccessFactors locales. The PERCIPIO (left side) value is the RFC5646 Language Tag',
          languagelookup: {
            en: 'English',
            fr: 'French',
            'fr-FR': 'French',
            de: 'German',
            'de-DE': 'German',
            es: 'Spanish',
            'es-ES': 'Spanish',
            'es-DO': 'Spanish',
          },
          comment_defaultlanguage:
            'The default SuccessFactors locale string to use if the map does not succeed',
          defaultlanguage: 'English',
          comment_typelookup:
            'The MAPPING between Percipio contentType.percipioType, contentType.category, contentType.displayLabel in lowercase combined with ~ delimiter to the SuccessFactors Component Types',
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
            'video~video~video': 'VIDEO',
            'journey~curriculum~journey': 'JOURNEY',
          },
          comment_completionlookup:
            'The MAPPING between Percipio contentType.percipioType, contentType.category, contentType.displayLabel in lowercase combined with ~ delimiter to the SuccessFactors Completion Types',
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
            'video~video~video': 'VIDEO-COMPL',
            'journey~curriculum~journey': 'JOURNEY-COMPL',
          },
          comment_defaultcatalog:
            'The default CATALOG that content will be created in within SuccessFactors, the CATALOG must already exist. This is used for the CATALOG_1 column.',
          defaultcatalog: 'EXTERNAL',
          comment_cpntsrcid:
            'The default CPNT_SRC_ID that content will be associated with in SuccessFactors, the CPNT_SRC_ID must already exist. This is used for the CPNT_SRC_ID column.',
          cpntsrcid: 'SKILLSOFT',
          comment_buildcompany:
            'The default BUILD_COMPANY that content will be associated with in SuccessFactors. This is used for the BUILD_COMPANY column if the item does not have a association.parent',
          buildcompany: 'Percipio',
          comment_chgbackmethod:
            'The default CHARGE BACK method that content will be associated with in SuccessFactors. This is used for the CHGBCK_METHOD column.',
          chgbackmethod: 1,
          comment_timestampformat:
            'The default format to use when converting ISO8601 timestamps. This has the same syntax as fn:format-dateTime. https://www.w3.org/TR/xpath-functions-31/#func-format-dateTime',
          timestampformat: '[MNn,*-3]-[D01]-[Y0001] [H01]:[m01]:[s01][z]',
          comment_timezoneoffset:
            'The default TimeZone Offset to use when converting ISO8601 timestamps',
          timezoneoffset: '-0500',
          comment_enablerating:
            'The ENABLE_RATING option. This allows users, after completing the training, to rate the item. N = disable item ratings by users Y = enable item ratings by users',
          enablerating: 'Y',
          comment_selfrecordlrngevt:
            'The SELF_RECORD_LRNGEVT option. This enables a user to self-record completion of this item. Y =	Allow users to self-record a learning event N =	Do not allow users to self-record a learning event',
          selfrecordlrngevt: 'N',
        },
      },
      filename: {
        outputPath: 'Skillsoft/itemconn/sf',
        includeDate: false,
        filenamePrefix: 'item_data_CLAQ1NA',
        filenameSuffix: 'csv',
      },
      sftp: {
        sftpConfigUuid: 'fa20850f-71a2-462c-973c-9f30e6f4a961',
      },
      csvOptions: {
        delimiter: '|',
        header: true,
        newline: '!##!\r\n',
      },
    },
  },
  startAt: '2019-01-28T11:01:00.000Z',
  jobConfig: {
    type: 'ASYNC',
    maxRetryCount: 5,
  },
};

// Show example of overriding
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
config.request.query.typeFilter = ['CHANNEL', 'JOURNEY'];
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
config.request.query.updatedSince = null;
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
