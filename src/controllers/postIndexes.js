const os = require('../api/opensearch')

const getPostData = (index) => {
    let tempData = {
        "source": {
            "remote": {
                "host": process.env.ELASTICSEARCH_URL,
                "username": process.env.ELASTICSEARCH_USERNAME,
                "password": process.env.ELASTICSEARCH_PASSWORD
            },
            "index": index
        },
        "dest": {
            "index": index
        }
    }

    return tempData
}

const postIndexes = async (indexes) => {
    try {
        console.log('Posting indexes to OpenSearch...')
        console.log('\n')

        for(let index of indexes) {
            let postData = getPostData(index)

            console.log(`Posting index ${index} to OpenSearch...`)
            const response = await os.postReindex(postData)
        }

        console.log('\n')
        console.log('All indexes posted to OpenSearch successfully!')
        console.log('\n')
        
        return "Indexes posted successfully!"
    } catch (err) {
        throw new Error(`Error posting indexes: ${err.message}`)
    }
}

module.exports = { postIndexes }