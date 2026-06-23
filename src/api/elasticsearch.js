const axios = require('axios');

const getAliases = async () => {
    try {
        const response = await axios.get(`${process.env.ELASTICSEARCH_URL}/_aliases`, {
            headers: {
                'Authorization': getAuthHeader()
            }
        })

        return response.data;
    } catch (error) {
        console.error(`Error fetching aliases:`, error.message);
        throw error;
    }
}

const getAllDocs = async (index) => {
    try {
        let query = {
            "from": 0,
            "size": 100,
            "query": {
                "match_all": {}
            }
        }
        let data = []

        const initResponse = await getDocs(index, query)
        if(initResponse.hits && initResponse.hits.hits) {
            data = data.concat(initResponse.hits.hits)
            let totalDocs = initResponse.hits.total.value
            let iterations = Math.ceil(totalDocs / query.size)

            for(let i = 1; i < iterations; i++) {
                query.from = i * query.size
                const response = await getDocs(index, query)
                if(response.hits && response.hits.hits) {
                    data = data.concat(response.hits.hits)
                }
            }
        }

        return data
    } catch (error) {
        console.error(`Error fetching all docs from index ${index}:`, error.message);
        throw error;
    }
}

const getAuthHeader = () => {
    let string = `${process.env.ELASTICSEARCH_USERNAME}:${process.env.ELASTICSEARCH_PASSWORD}`;

    return `BASIC ${Buffer.from(string).toString('base64')}`;
}

const getDocs = async (index, query) => {
    try {
        const response = await axios.get(`${process.env.ELASTICSEARCH_URL}/${index}/_search`, {
            headers: {
                'Authorization': getAuthHeader()
            },
            data: query
        })

        return response.data;
    }   catch (error) {
        console.error(`Error fetching docs from index ${index}:`, error.message);
        throw error;
    }
}

const getIndexes = async () => {
    try {
        const response = await axios.get(`${process.env.ELASTICSEARCH_URL}/_cat/indices`, {
            headers: {
                'Authorization': getAuthHeader()
            }
        })

        return response.data;
    } catch (error) {
        console.error(`Error fetching indexes:`, error.message);
        throw error;
    }
}

module.exports = {
    getAliases, getAllDocs, getIndexes
}