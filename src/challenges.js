import { EmbedBuilder }  from "discord.js";
import { checkPhase } from "./progress-tracking.js";

let locked = true;

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

async function phaseTest(msg) {
    const challengeTxt = new EmbedBuilder()
    .setTitle("Test Phase (Phase 0)")
    .setDescription("Practice session")
    .setColor("#FFF9FB")
    .setFooter({text: "Powered by Paper 🧻",})
    .addFields({
        name: "Data",
        value: `Lorem Ipsum
        ${process.env.PHASE_1_FILES}`
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
        You'll find the files in the google drive link below:\n
        ${process.env.PHASE_1_FILES}`
    },);

    const phase = await checkPhase(msg);
    if (phase) {
        if (phase >= 1) {
            msg.channel.send({embeds: [challengeTxt]});
        } else {
            msg.reply("You are not yet eligible to enter this phase.");
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
    if (phase) {
        if (locked == true) {
            msg.reply("Sorry Phase 2 is currently unavailable, please try again later once the admin unlocks it.")
        }
        else if (phase >= 2) {
            msg.channel.send({embeds: [challengeTxt]});
        } else {
            msg.reply("You are not yet eligible to enter this phase.");
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
        value: `This phase is not available during the test run, hope you enjoyed!`
    },);

    const phase = await checkPhase(msg);
    if (phase) {
        if (locked == true) {
            msg.reply("Sorry Phase 3 is currently unavailable, please try again later once the admin unlocks it.")
        }
        else if (phase >= 3) {
            msg.channel.send({embeds: [challengeTxt]});
        } else {
            msg.reply("You are not yet eligible to enter this phase.");
        }
    };
};

export { phase1, phase2, phase3, lock, unlock, phaseTest };