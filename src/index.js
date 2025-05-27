import {Client, IntentsBitField, ActivityType, AttachmentBuilder} from "discord.js";
import {mongoose} from "mongoose";
import { join, reset, leave, remove, add } from "./register.js";
import { registerTeam, addMember, removeMember, deleteTeam } from "./team-assignment.js";
import { submitFlag } from "./progress-tracking.js";
import { welcome, intro, help, init } from "./commands.js";
import { phase1, phase2, phase3 } from "./challenges.js";
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
        name: "الليلة بالليل 🌙",
        type: ActivityType.Listening,
    });

    mongoose.connect(process.env.MONGODB_URI);
});

const commandHandlers = {
    "submit-flag": submitFlag,
    "welcome": welcome,
    "remove": remove,
    "add": add,
    "init": init,
    "registerteam": registerTeam,
    "removemember": removeMember,
    "addmember": addMember,
    "deleteteam": deleteTeam,
    "intro":intro,
    "help": help,
    "join": join,
    "reset": reset,
    "leave": leave,
    "phase1": phase1,
    "phase2": phase2,
    "phase3": phase3,
    "bloop": (msg) => {
        console.log(msg.author);
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
            files: ["https://media.discordapp.net/attachments/1284449006616973322/1376780440710414366/image.png?ex=68369234&is=683540b4&hm=57be91ec5182cb5ac50c6f181f590afe032df507eea8e042e1ac5a35734505cf&=&format=webp&quality=lossless&width=705&height=940"]
        })
    },
    "quack": (msg) => { //Mosab's custom command
        msg.reply("Watch for a surprise\nhttps://www.youtube.com/watch?v=EA65VtuKwX0")
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