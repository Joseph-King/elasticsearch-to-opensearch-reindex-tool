sh set-env.sh

docker exec -it elasticsearch curl -X POST -H "Content-Type: application/json" --user "$ELASTICSEARCH_USERNAME:$ELASTICSEARCH_PASSWORD" -d '{"message": "this is a dummy data example for test1"}' http://localhost:9200/test1/_doc
docker exec -it elasticsearch curl -X POST -H "Content-Type: application/json" --user "$ELASTICSEARCH_USERNAME:$ELASTICSEARCH_PASSWORD" -d '{"message": "this is a dummy data example for test2"}' http://localhost:9200/test2/_doc
docker exec -it elasticsearch curl -X POST -H "Content-Type: application/json" --user "$ELASTICSEARCH_USERNAME:$ELASTICSEARCH_PASSWORD" -d '{"message": "this is a dummy data example for test3"}' http://localhost:9200/test3/_doc
docker exec -it elasticsearch curl -X POST -H "Content-Type: application/json" --user "$ELASTICSEARCH_USERNAME:$ELASTICSEARCH_PASSWORD" -d '{"message": "this is a dummy data example for test4"}' http://localhost:9200/test4/_doc