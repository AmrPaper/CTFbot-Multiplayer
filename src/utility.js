import { Player } from "./progress-schema.js";
import mongoose from "mongoose";

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI);
    }
}

async function upsertPlayer({ id, name, team }) {
    const update = {};

    if (name !== undefined) update.name = name;
    // Important: explicitly allow null for removal
    if (team !== undefined) update.team = team;

    return Player.findByIdAndUpdate(
        id,
        { _id: id, ...update },
        { upsert: true, new: true }
    );
}


async function checkUsers(id) {
    await connectDB();
    const user = await Player.findById(id);
    return !!user;
}


export { checkUsers, upsertPlayer, connectDB };