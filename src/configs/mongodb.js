const config = {
    uri: `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@127.0.0.1:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}?authMechanism=SCRAM-SHA-256&authSource=${process.env.MONGODB_DATABASE}&replicaSet=${process.env.MONGODB_REPLICA_SET}`,
    database: process.env.MONGODB_DATABASE
};

export default config;
