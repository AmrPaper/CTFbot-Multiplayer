import pkg from "mongoose";
const { Schema, model, models} = pkg; 

const playerInfoSchema = new Schema({
    _id: {//User's discord ID
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    currentPhase: {
        type: Number,
        default: 1,
        required: true
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: "Ctf-Teams",
        default: null
    }
});

const teamInfoSchema = new Schema({
    name: { //Team name
        type: String,
        required: true,
        unique: true
    },
    members: [{ //Player IDs
        type: String,
        ref: "Ctf-Players"
    }],
    currentPhase: {
        type: Number,
        default: 1,
        required: true
    },
    roleID: { //Team's role ID
        type: String,
        required: true
    },
    channelID: { //Team's private channel ID
        type: String,
        required: true
    },
    colour: { //Team's role colour
        type: String,
        required: true
    }
});

const Team = models["Ctf-Teams"] || model("Ctf-Teams", teamInfoSchema)
const Player = models["Ctf-Players"] || model("Ctf-Players", playerInfoSchema)
export {Team, Player};