const { setTimeout } = require('timers/promises')

const es = require('../api/elasticsearch')
const os = require('../api/opensearch')
const getIndexes = require('./getIndexes')

const validate = async (indexes) => {
    try {
        console.log('Delay of 5 seconds for OpenSearch to catch up...')
        await setTimeout(5000)

        console.log('Validating indexes...')
        console.log('\n')

        const validationResult = await validateIndexes(indexes)

        console.log('All target indexes exist in both ElasticSearch and OpenSearch.')

        const contentsValidationResult = await validateContents(indexes)

        console.log('All target indexes have the same number of documents and the same content in both ElasticSearch and OpenSearch.')
        console.log('\n')

        return "Indexes and contents validated successfully!"
    } catch (err) {
        throw new Error(`Error validating indexes: ${err.message}`)
    }
}

const validateContents = async (indexes) => {
    try {
        console.log('Validating contents of indexes...')
        console.log('\n')

        for (let index of indexes) {
            const esDocs = await es.getAllDocs(index)
            const osDocs = await os.getAllDocs(index)

            if (esDocs.length !== osDocs.length) {
                console.error(`Document count mismatch found in index ${index}:`)
                console.error(`ElasticSearch document count: ${JSON.stringify(esDocs)}`)
                console.error(`OpenSearch document count: ${JSON.stringify(osDocs)}`)
                throw new Error(`Index ${index} has different number of documents in ElasticSearch and OpenSearch.`)
            }

            for (let i = 0; i < esDocs.length; i++) {
                if (JSON.stringify(esDocs[i]["_source"]) !== JSON.stringify(osDocs[i]["_source"])) {
                    console.error(`Document mismatch found in index ${index} at document ${i}:`)
                    console.error(`ElasticSearch document: ${JSON.stringify(esDocs[i]["_source"])}`)
                    console.error(`OpenSearch document: ${JSON.stringify(osDocs[i]["_source"])}`)
                
                    throw new Error(`Index ${index} has different documents in ElasticSearch and OpenSearch.`)
                }
            }
        }

        return "Contents of indexes validated successfully!"
    } catch (err) {
        throw new Error(`Error validating contents of indexes: ${err.message}`)
    }
}

const validateIndexes = async (indexes) => {
    try {
        const esIndxes = await getIndexes.getEsIndexes()
        const osIndxes = await getIndexes.getOsIndexes()

        for (let index of indexes) {
            if (!esIndxes.includes(index)) {
                throw new Error(`Index ${index} does not exist in ElasticSearch.`)
            }

            if (!osIndxes.includes(index)) {
                throw new Error(`Index ${index} does not exist in OpenSearch.`)
            }
        }

        return "Indexes validated successfully!"
    } catch (err) {
        throw new Error(`Error validating indexes: ${err.message}`)
    }
}

module.exports = { validate }