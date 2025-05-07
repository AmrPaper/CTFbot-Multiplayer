import pkg from "mongoose";
const { Schema, model, models} = pkg; 

const playerInfoSchema = new Schema({
    _id: {
        //Stores the discord user's ID
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
    name: {
        type: String,
        required: true,
        unique: true
    },
    members: [{
        type: String,
        ref: "Ctf-Players"
    }],
    currentPhase: {
        type: Number,
        default: 1,
        required: true
    }
});

const Team = models["Ctf-Teams"] || model("Ctf-Teams", teamInfoSchema)
const Player = models["Ctf-Players"] || model("Ctf-Players", playerInfoSchema)
export {Team, Player};