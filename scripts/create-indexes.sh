sh set-env.sh

docker exec -it elasticsearch curl -X PUT -H "Content-Type: application/json" --user "$ELASTICSEARCH_USERNAME:$ELASTICSEARCH_PASSWORD" http://localhost:9200/test1
docker exec -it elasticsearch curl -X PUT -H "Content-Type: application/json" --user "$ELASTICSEARCH_USERNAME:$ELASTICSEARCH_PASSWORD" http://localhost:9200/test2
docker exec -it elasticsearch curl -X PUT -H "Content-Type: application/json" --user "$ELASTICSEARCH_USERNAME:$ELASTICSEARCH_PASSWORD" http://localhost:9200/test3
docker exec -it elasticsearch curl -X PUT -H "Content-Type: application/json" --user "$ELASTICSEARCH_USERNAME:$ELASTICSEARCH_PASSWORD" http://localhost:9200/test4