import { MongoClient } from "mongodb";
import config from "../configs/mongodb.js";

const client = new MongoClient(config.uri);

async function run() {
    try {
        await client.connect();

        // Send a ping to confirm a successful connection
        await client.db(config.database).command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        await client.close();
    }
}

run().catch(console.dir);

export default client;
