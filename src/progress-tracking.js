import {mongoose} from "mongoose";
import { EmbedBuilder }  from "discord.js";
import { Team, Player } from "./progress-schema.js";
import { config } from "dotenv";
config();

const prefix = "$";
const flags = {
    "1": process.env.FLAG1,
    "2": process.env.FLAG2,
    "3": process.env.FLAG3
};

const goodEnding = new EmbedBuilder()
    .setTitle("Ending 1: Connection Reestablished")
    .setDescription("You saved Etti")
    .setColor("#FFF9FB")
    .setFooter({text: "Powered by Paper 🧻",})
    .addFields({
        name: "Final outcome",
        value: `You move fast — maybe faster than you thought possible.\n
        With Olive’s help and the locator script, you trace the coordinates to an abandoned maintenance tunnel beneath the warehouse district. The air is thick, damp, and buzzing with the hum of nearby substations. Your flashlight flickers against rusted signage… then lands on movement.\n
        She’s there.\n
        Barefoot. Shivering. Alive.\n
        Etti blinks against your light, confused. Her voice is hoarse, barely audible. “...You actually came?”\n
        The moment is real. The risk, the search, the fragments of her voice — it all led here. You wrap your coat around her shoulders, dial emergency services, and step back into the night knowing you were just barely in time.\n
        You didn't just solve the case. You saved her life.\n\n
        
        Congratulations on your first successful case detectives.`
},);

const badEnding = new EmbedBuilder()
    .setTitle("Ending 2: Too Late")
    .setDescription("You failed to saved Etti")
    .setColor("#FFF9FB")
    .setFooter({text: "Powered by Paper 🧻",})
    .addFields({
        name: "Final outcome",
        value: `You get the location. The drive is frantic.\n
        The abandoned warehouse isn’t on any map. Concrete dust hangs in the air as you push open the rusted entrance, following the signal underground. You pass broken crates. Empty chairs. A discarded recorder. Then… silence.\n
        You find her.\n
        Curled on the floor beneath a smashed server rack. Hands bound. Cold.\n
        On her wrist: a final message scrawled in permanent ink.\n
        “Better luck next time :)”\n
        Olive doesn’t say anything. Just static on the other end of the comms. And then:\n
        “We were so close.”\n
        You stare at the scene. She’d left breadcrumbs. Trusted you to follow them. But time… wasn’t on your side.\n
        The mystery is solved. The story is over. But this one doesn't get a happy ending.\n\n
        
        Congratulations on solving your first case detectives, you can't win them all unfortunately.`
},);

function endings(msg) {
    msg.channel.send({embeds: [goodEnding]});
    msg.channel.send({embeds: [badEnding]});
}

async function checkPhase(msg) {
    mongoose.connect(process.env.MONGODB_URI);
    const player = await Player.findOne({ _id: msg.author.id});
    return player ? player.currentPhase : console.log("User not found.");
}

async function submitFlag(msg, args) {
    const playerID = await msg.author.id;
    const usrRoles = await msg.member.roles.cache.map(r => r.name);
    console.log(args);
    console.log(args.join(""));

    try {
        if (!usrRoles.includes("[ARG] Player")) {
            return msg.reply("You are not registered in the ongoing ARG, please contact one of the organisers for assistance!");
        }

        if (!args.length) {
            return msg.reply("Please submit a valid flag!");
        }

        const player = await Player.findOne({ _id: playerID});
        if (!player) {
            return msg.reply("You are not registered within the ARG's database, please contact one of the organisers for assistance!");
        }

        for (const [phase, flag] of Object.entries(flags)) {
            if (args.join("") !== flag) continue;

            const currentPhase = player.currentPhase;
            const targetPhase = Number(phase);
            const nextPhase = targetPhase + 1;

            if (currentPhase > targetPhase) {
                await msg.delete();
                return msg.channel.send("You have already completed this phase, please move on to the next phase.");
            }

            if (currentPhase !== targetPhase) {
                await msg.delete();
                msg.channel.send(`It seems you are trying to skip phase ${phase}. Smh my head 🤦‍♂️.`);
                return msg.channel.send(`Hey, <@&${process.env.ORG}> a mentor is needed here!`);
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

export { submitFlag, checkPhase, endings };