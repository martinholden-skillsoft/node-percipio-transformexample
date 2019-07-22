# node-percipio-transformexample
This package makes it easy to download data about available content on your Percipio site, transform the returned JSON using JSONata and save as CSV

## Requirements

1. A Skillsoft [Percipio](https://www.skillsoft.com/platform-solution/percipio/) Site
1. A [Percipio Service Account](https://documentation.skillsoft.com/en_us/pes/3_services/service_accounts/pes_service_accounts.htm) with permission for accessing [CONTENT DISCOVERY API](https://documentation.skillsoft.com/en_us/pes/2_understanding_percipio/rest_api/pes_rest_api.htm)

## Configuration
Once you have copied this repository set the following NODE ENV variables:

| ENV | Required | Description |
| --- | --- | --- |
| ORGID | Required | This is the Percipio Organiation UUID for your Percipio Site |
| BEARER | Required | This is the Percipio Bearer token for a Service Account with permissions for CONTENT DISCOVERY services. |
| CONFIG | Optional | This is the configuration to use, this name is used to get the correct ```config/config.{config}.js```. If not specified defaults to ```DEFAULT``` |

## How to use it

Make the config changes in the appropriate ```config/config.{config}.js``` file, to specify the request criteria for the [catalog-content API call](https://api.percipio.com/content-discovery/api-docs/#/Content/getCatalogContent) and the CSV configuration. See the comments in the file

Create a [JSONata](https://github.com/jsonata-js/jsonata) transform with name ```transform/{config}.jsonata``` to flatten the Percipio JSON into a KEY -> VALUE object, the KEY will be used as the column name in the output file.

Run the app

```bash
npm start
```

## Transform Examples

| File | Description |
| --- | --- |
| [Default](transform/default.jsonata) | This transform attempts to flatten all supplied data. Where the source is an array of objects, the transform outputs multiple columns with a numeric suffix. The object is a | delimited string |
| [Default](transform/moodle.jsonata) | This transform outputs the data formatted to be used by [Moodle Upload Tool](https://github.com/martinholden-skillsoft/moodle-tool_uploadpercipio) |


## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.