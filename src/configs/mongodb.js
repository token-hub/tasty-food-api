const config = {
    uri: `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@localhost:${process.env.MONGODB_PORT}/?authMechanism=DEFAULT`,
    database: process.env.MONGODB_DATABASE
};

export default config;
