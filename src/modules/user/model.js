import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        firstName: { type: String, required: true, lowercase: true, trim: true },
        lastName: { type: String, required: true, lowercase: true, trim: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        reset: {
            token: { type: String },
            isExpired: { type: Boolean }
        }
    },
    { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
