const loadEnv = function(){
    for(let field in templateEnv){
        if(!process.env[field]){
            throw new Error(`Missing required environment variable: ${field}`)
        }
    }
}

const templateEnv = {
    ELASTICSEARCH_URL: '',
    ELASTICSEARCH_USERNAME: '',
    ELASTICSEARCH_PASSWORD: '',
    OPENSEARCH_URL: '',
    OPENSEARCH_USERNAME: '',
    OPENSEARCH_PASSWORD: ''
}

module.exports = loadEnv