const es = require('../api/elasticsearch');
const os = require('../api/opensearch');

const ignoredAliasPrefixes = [
    '.apm', 
    '.fleet',
    '.kibana',
    '.logs',
    '.opensearch',
    '.security'
];

const convertAliasesToIndexes = (aliases) => {
    const indexes = [];

    for (const alias in aliases) {
        let isIgnored = false
        for (const ignored of ignoredAliasPrefixes) {
            if (alias.includes(ignored)) {
                console.log(`Ignoring alias: ${alias}`);
                isIgnored = true
                continue;
            }
        }

        if(!isIgnored) {
            indexes.push(alias);
        }
    }

    return indexes;
}

const getEsIndexes = async () => {
    try {
        console.log('Getting aliases from ElasticSearch...')

        const esAliases = convertAliasesToIndexes(await es.getAliases())

        console.log(esAliases)
        console.log('\n')

        return esAliases
    } catch (err) {
        throw new Error(`Error getting ES indexes: ${err.message}`)
    }
}

const getIndexesToReindex = async () => {
    try {
        const esAliases = await getEsIndexes()
        const osAliases = await getOsIndexes()

        let tempIndexes = removeDuplicates(esAliases, osAliases)
        tempIndexes = await removeEmptyIndexes(tempIndexes)

        return tempIndexes
    } catch (err) {
        throw new Error(`Error getting indexes: ${err.message}`)
    }
}

const getOsIndexes = async () => {
    try {
        console.log('Getting aliases from OpenSearch...')

        const osAliases = convertAliasesToIndexes(await os.getAliases())

        console.log(osAliases)
        console.log('\n')

        return osAliases
    } catch (err) {
        throw new Error(`Error getting OS indexes: ${err.message}`)
    }
}

const removeDuplicates = (esIndexes, osIndexes) => {
    const uniqueIndexes = esIndexes.filter(index => !osIndexes.includes(index));

    console.log('Unique indexes to be reindexed:')
    console.log(uniqueIndexes)
    console.log('\n')

    if(uniqueIndexes.length === 0) {
        console.log('No unique indexes found. All indexes from ElasticSearch already exist in OpenSearch.')
        console.log('Exiting...')
        process.exit(0)
    }

    return uniqueIndexes;
}

const removeEmptyIndexes = async (indexes) => {
    const nonEmptyIndexes = [];

    for (const index of indexes) {
        const esDocs = await es.getAllDocs(index)

        if (esDocs.length > 0) {
            nonEmptyIndexes.push(index);
        } else {
            console.log(`Index ${index} is empty. Ignoring...`);
        }
    }

    console.log('Non-empty indexes to be reindexed:')
    console.log(nonEmptyIndexes)
    console.log('\n')

    if(nonEmptyIndexes.length === 0) {
        console.log('No non-empty indexes found. All unique indexes from ElasticSearch are empty.')
        console.log('Exiting...')
        process.exit(0)
    }

    return nonEmptyIndexes;
}

module.exports = { getEsIndexes, getIndexesToReindex, getOsIndexes }