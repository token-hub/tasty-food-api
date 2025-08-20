import mongoose from "mongoose";
import config from "../../configs/mongodb.js";

try {
    await mongoose.connect(config.uri);
    console.log("Mongoose OK");
} catch (error) {
    console.log(error);
}
