import { EmbedBuilder }  from "discord.js";
import { checkPhase } from "./progress-tracking.js";

let locked = true;
let started = false;

function lock(msg) {
    if (msg.author.id === process.env.OWNER_ID) {
        locked = true;
        console.log(locked);
        msg.reply("Phases 2 and 3 are now on lockdown.");
    } else {
        msg.reply("Only the current owner is allowed to use this command.");
    };
};

function unlock(msg) {
    if (msg.author.id === process.env.OWNER_ID) {
        locked = false;
        console.log(locked);
        msg.reply("Phases 2 and 3 have now been unlocked.");
    } else {
        msg.reply("Only the current owner is allowed to use this command.");
    };
};

function start(msg) {
    if (msg.author.id === process.env.OWNER_ID) {
        started = true;
        console.log(locked);
        return msg.reply("The CTF has now begun!");
    } else {
        return msg.reply("Only the current owner is allowed to use this command.");
    };
};

async function phaseTest(msg) {
    const challengeTxt = new EmbedBuilder()
    .setTitle("Test Phase (Phase 0)")
    .setDescription("Practice session")
    .setColor("#FFF9FB")
    .setFooter({text: "Powered by Paper 🧻",})
    .addFields({
        name: "Data",
        value: `Welcome detectives,\n For your first case we need you to look a little into our man Quigga here, word on the street is that he has an interesting background.\n We managed to get our hands on some files he has on his computer, some of these seem personal, but we're sure you'll figure out what to with all of them.\n You'll find the files linked below:\n
        ${process.env.PHASE_TEST_FILES}`
    },);

    return msg.channel.send({embeds: [challengeTxt]});
};

async function phase1(msg) {
    const challengeTxt = new EmbedBuilder()
    .setTitle("Phase 1")
    .setDescription("Room Investigation")
    .setColor("#FFF9FB")
    .setFooter({text: "Powered by Paper 🧻",})
    .addFields({
        name: "Data",
        value: `You've interviewed a few of the people on the same floor, and have looked through Etti's room, here's a list of everything you've managed to get your hands on:\n
        -Notebook Scans of pages from a notebook left open on Etti's desk.\n
        -Flash Drive containing a zip file and a failed back up folder\n
        -Text scan of a letter found under Etti's bed\n
        -Picture of a sticky note found under Etti's keyboard\n
        -Interview Transcripts\n
        -Pictures of Etti's room\n
        -A damaged drive collected by Forensics team\n
        You'll find the files in the google drive link below:\n
        ${process.env.PHASE_1_FILES}`
    },);

    const phase = await checkPhase(msg);
    const usrRoles = await msg.member.roles.cache.map(r => r.name);
    if (!usrRoles.includes("[ARG] Player")) {
            return msg.reply("You are not registered in the ongoing ARG, please contact one of the organisers for assistance!");
        }
    if (phase) {
        if (started == false) {
            return msg.reply("Sorry the ctf has yet to begin, please try again later once the admin starts it.")
        } else if (phase >= 1) {
            return msg.channel.send({embeds: [challengeTxt]});
        } else {
            return msg.reply("You are not yet eligible to enter this phase.");
        }
    };
};

async function phase2(msg) {
    const challengeTxt = new EmbedBuilder()
    .setTitle("Phase 2")
    .setDescription("Use Your Magic")
    .setColor("#D3D4D9")
    .setFooter({text: "Powered by Paper 🧻",})
    .addFields({
        name: "Data",
        value: `A couple of days passed and you are not able to find any evidence. You interviewed more girls from her dorm but they were all dead ends. It seems that you have lost the traces. But then an email comes out of nowhere. The email is from someone called Olive. He gave you a zip file that was left by Etti. The file is linked below, use your magic.\n
        ${process.env.PHASE_2_FILES}`
    },);

    const phase = await checkPhase(msg);
    const usrRoles = await msg.member.roles.cache.map(r => r.name);
    if (!usrRoles.includes("[ARG] Player")) {
            return msg.reply("You are not registered in the ongoing ARG, please contact one of the organisers for assistance!");
        }
    if (phase) {
        if (started == false) {
            return msg.reply("Sorry the ctf has yet to begin, please try again later once the admin starts it.")
        } else if (locked == true) {
            return msg.reply("Sorry Phase 2 is currently unavailable, please try again later once the admin unlocks it.")
        } else if (phase >= 2) {
            return msg.channel.send({embeds: [challengeTxt]});
        } else {
            return msg.reply("You are not yet eligible to enter this phase.");
        }
    };
};

async function phase3(msg) {
    const challengeTxt = new EmbedBuilder()
    .setTitle("Phase 3")
    .setDescription("Lorem Ipsum")
    .setColor("#4B88A2")
    .setFooter({text: "Powered by Paper 🧻",})
    .addFields({
        name: "Data",
        value: `Oliver left you a recording device. He told you where Rabid usually hangs out and instructed you to try to capture any audio frequencies in that area. You used the device to capture all the available audio frequencies, some were unintelligable, though others were clear enough to listen in on.\n
        The forensics team at your department also contacted you, letting you know that they have recovered some data from the drive retrieved from Etti’s room, though it seems the drive itself is encrypted.\n
        You'll find all the collected files linked down below:\n
        ${process.env.PHASE_3_FILES}`
    },);

    const phase = await checkPhase(msg);
    const usrRoles = await msg.member.roles.cache.map(r => r.name);
    if (!usrRoles.includes("[ARG] Player")) {
            return msg.reply("You are not registered in the ongoing ARG, please contact one of the organisers for assistance!");
        }
    if (phase) {
        if (started == false) {
            return msg.reply("Sorry the ctf has yet to begin, please try again later once the admin starts it.")
        } else if (locked == true) {
            return msg.reply("Sorry Phase 3 is currently unavailable, please try again later once the admin unlocks it.")
        } else if (phase >= 3) {
            return msg.channel.send({embeds: [challengeTxt]});
        } else {
           return msg.reply("You are not yet eligible to enter this phase.");
        }
    };
};

export { phase1, phase2, phase3, lock, unlock, phaseTest, start };