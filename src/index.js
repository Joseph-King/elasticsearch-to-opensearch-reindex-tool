// 
require('dotenv').config()
try {
    const loadEnv = require('./controllers/loadEnv')
    loadEnv()
} catch(err) {
    console.error('Error loading environment variables:', err)
    process.exit(1)
}

const getIndexes = require('./controllers/getIndexes')
const postIndexes = require('./controllers/postIndexes')
const validateIndexes = require('./controllers/validateIndexes')

async function main() {
    let indexes = []
    try {
        indexes = await getIndexes.getIndexesToReindex()
    } catch(err) {
        console.error('Error getting Indexes:', err)
        process.exit(1)
    }

    try {
        const postResult = await postIndexes.postIndexes(indexes)
    } catch(err) {
        console.error('Error posting Indexes:', err)
        process.exit(1)
    }

    try {
        const validateResult = await validateIndexes.validate(indexes)
    } catch(err) {
        console.error('Error validating Indexes:', err)
        process.exit(1)
    }

    console.log('If you are reading this, the reindexing process has completed successfully! \n\nOld data was not deleted from ElasticSearch, so you can verify the new data in OpenSearch before deleting the old data from ElasticSearch.')
}

main()