import {Team, Player} from "./progress-schema.js";
import { config } from "dotenv";
config();

const prefix = "$";
const flags = {
    "1": process.env.FLAG1,
    "2":process.env.FLAG2,
    "3":process.env.FLAG3
};

async function submitFlag(msg, args) {

    const playerID = await msg.author.id;
    const usrRoles = await msg.member.roles.cache.map(r => r.name);
    
    try {
        if (!usrRoles.includes("ctf")) {
            return msg.reply("You are not registered in the ongoing CTF, please contact one of the organisers for assistance!");
        }

        if (!args.length) {
            return msg.reply("Please submit a valid flag!");
        }

        const usrSubmission = msg.content.slice(prefix.length + args[0].length).trim();

        const player = await Player.findOne({ _id: playerID});
        if (!player) {
            return msg.reply("You are not registered within the CTF's database, please contact one of the organisers for assistance!");
        }

        for (const [phase, flag] of Object.entries(flags)) {
            if (usrSubmission != flag) continue;

            const currentPhase = player.currentPhase;
            const targetPhase = Number(phase);
            const nextPhase = targetPhase + 1;

            if (currentPhase > targetPhase) {
                return msg.reply("You have already completed this phase, please move on to the next phase.");
            }

            if (currentPhase !== targetPhase) {
                msg.reply("It seems you are trying to skip a phase. Smh my head 🤦‍♂️.");
                return msg.reply("@organiser help is required to deal with this case.");
            }

            try {
                if (player.team) {
                    await Player.updateMany(
                        { team: player.team._id, currentPhase: { $lt: nextPhase } },
                        { currentPhase: nextPhase }
                    );
                    await Team.findOneAndUpdate(
                        { _id: player.team._id },
                        { currentPhase: nextPhase }
                    );
                } else {
                    await Player.findOneAndUpdate(
                        { _id: playerID },
                        { currentPhase: nextPhase }
                    );
                }
            } catch (error) {
                console.log(`Error updating phase: ${error}`);
                return msg.reply("There was an error updating your phase 😭. Please try again!");
            }

            try {
                await msg.delete();
                console.log("Message successfully deleted!");
            } catch (error) {
                console.log("Error deleting message:", error);
            }

            return msg.channel.send(`You've submitted the correct flag for phase ${targetPhase}! Good Job!`);
        }

        msg.reply("The flag you submitted is incorrect. Try again 😉.");

    } catch (error) {
        console.log(`Unexpected error: ${error}`);
        msg.reply("An unexpected error occurred.");
    }
};

export { submitFlag };