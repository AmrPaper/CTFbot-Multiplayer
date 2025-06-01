import {Client, IntentsBitField, ActivityType} from "discord.js";
import {mongoose, set} from "mongoose";
import { join, reset, leave, remove, add } from "./register.js";
import { registerTeam, addMember, removeMember, deleteTeam } from "./team-assignment.js";
import { startTimer, submitFlag, checkPhase, checkTime, setAlloted } from "./progress-tracking.js";
import { welcome, intro, help, init } from "./commands.js";
import { lock, phase1, phase2, phase3, phaseTest, unlock, start } from "./challenges.js";
import { config } from "dotenv";
const prefix = "$";

config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on("ready", (c) => {
    console.log(`${c.user.tag} is now online ya zoooool!`);
    client.user.setActivity({
        name: " Alela Bilel/الليلة بالليل 🌙",
        type: ActivityType.Listening,
    });

    mongoose.connect(process.env.MONGODB_URI);
});

const commandHandlers = {
    "submit": submitFlag,
    "welcome": welcome,
    "lock": lock,
    "unlock": unlock,
    "remove": remove,
    "starttimer": startTimer,
    "checktime": checkTime,
    "setallotted": setAlloted,
    "add": add,
    "init": init,
    "registerteam": registerTeam,
    "removemember": removeMember,
    "addmember": addMember,
    "deleteteam": deleteTeam,
    "start": start,
    "intro":intro,
    "help": help,
    "join": join,
    "reset": reset,
    "leave": leave,
    "phase0": phaseTest,
    "phase1": phase1,
    "phase2": phase2,
    "phase3": phase3,
    "bloop": (msg) => {
        console.log(msg.author);
        console.log(msg.author.id)
        msg.reply("User info logged!");
    },
    "blip": (msg) => {
        console.log(msg.member.roles.cache.map(r => r.name));
        msg.reply("User roles logged!");
    },
    "maktab": (msg) => {
        msg.reply("Inta/Inti makana ya5");
    },
    "daz": (msg) => {
        msg.reply("daz daz");
    },
    "hint": (msg) => { //Abdalla's custom command
        msg.reply({
            content: "I won't tell if you won't 👀",
            files: ["./resources/QR.png"]
        })
    },
    "quack": (msg) => { //Mosab's custom command
        msg.reply("Watch for a surprise\nhttps://www.youtube.com/watch?v=EA65VtuKwX0")
    },
    "bingus": (msg) => { //Amr's custom command
        msg.reply("Oh. My. God.\nAre you seriously trying to cheat?")
        msg.channel.send("https://tenor.com/view/barbie-diy-omg-oh-no-shocked-barbie-gif-13856210")
    },
    "dayirhint": async (msg) => { //Awab's custom command
        const phase = await checkPhase(msg);
        if (phase == 1) {
            msg.reply("Check the trash bin file!");
        } else if (phase == 2) {
            msg.reply("Shid 7elak ya5!");
        } else if (phase == 3) {
            msg.reply({
                content: "This should help you out a bit",
                files: ["./resources/phase3.mp3"]
            });
        } else {
            msg.reply("Allah yideena wa yideek 🙏");
        }
    },
    "haraka": (msg) => { //Momen's custom command
        msg.reply({
            content: "Here we go!",
            files: ["./resources/quack.wav"]
        });
    },
    "rescue": (msg) => { //Mohammed Amir's custom command
        msg.reply("daz");
    }
};

//running different commands depending on the user's input
function messageHandling(msg) {
    if (msg.author.bot || !msg.content.startsWith(prefix)) return; //ignore bot messages and user messages that don't start with "!"

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    const handler = commandHandlers[cmd];
    if (handler) {
        handler(msg, args);
    } else {
        msg.reply("Unknown command. Type $help for a list of commands.");
    };
};

(async () => {
    try {
        client.on("messageCreate", messageHandling);
        client.login(process.env.BOT_TOKEN);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();