# elasticsearch-to-opensearch-reindex-tool
Containerized NodeJS tool that will help you migrate your ElasticSearch Indexes to OpenSearch.

Intended to be used to migrate ElasticSearch v8.X to OpenSearch v2.X . May work for other versions, but not guaranteed.

.env.example file is given as a reference. Will need to update with the configurations for your target OpenSearch and ElasticSearch environments.

This tool does not make use of any OpenSearch or ElasticSearch libraries and uses direct API calls via Axios. (AT TIME OF WRITING ALSO ASSUMES BASIC AUTH CONNECTION TO BOTH ELASTICSEARCH AND OPENSEARCH)

The tool gets a list of indexes on OpenSearch and ElasticSearch. Cross references them as duplicate indexes will NOT be rewritten. Then calls the OpenSearch API for reindexing ElasticSearch indexes for each index.

If you want to test with some dumby data, there are some scripts in the scripts directory that should be able to help