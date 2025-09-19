docker run -d \
    -p 27017:27017 \
    --name my-mongo-container-v2 \
    -e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
    -e MONGO_INITDB_ROOT_PASSWORD=secret \
    -v mongo-data:/data/db \
    mongo
