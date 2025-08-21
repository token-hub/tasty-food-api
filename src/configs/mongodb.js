const config = {
    uri: `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@127.0.0.1:${process.env.MONGODB_PORT}/?authMechanism=DEFAULT&authSource=${process.env.MONGODB_DATABASE}`,
    database: process.env.MONGODB_DATABASE
};

export default config;
