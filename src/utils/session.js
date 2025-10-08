import mongoose from "mongoose";

export const sessionWrapper = async (cb) => {
    const session = await mongoose.startSession();
    try {
        const result = await session.withTransaction(async () => {
            return await cb(session);
        });
        return result;
    } catch (error) {
        console.error("Transaction aborted:", error);
        throw error;
    } finally {
        session.endSession();
    }
};
