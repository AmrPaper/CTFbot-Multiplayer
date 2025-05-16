import { Player } from "./progress-schema.js";
import { checkUsers, upsertPlayer } from "./utility.js";

async function reset(msg) {
    const userExists = await checkUsers(msg.author.id);
    if (userExists) {
        await upsertPlayer({
            id: msg.author.id,
            name: msg.author.globalName,
            currentPhase: 1
        });
        msg.reply("User data reset successfully!");
    } else {
        msg.reply("User does not exist. No changes were made.");
    }
}

async function join(msg) {
    const userExists = await checkUsers(msg.author.id);
    if (!userExists) {
        await upsertPlayer({
            id: msg.author.id,
            name: msg.author.globalName,
            currentPhase: 1
        });

        const role = msg.guild.roles.cache.find((role) => role.name === "[ARG] Player");
        if (role) {
            try {
                const member = await msg.guild.members.fetch(msg.author.id);
                await member.roles.add(role);
                console.log(`${msg.author.globalName} has joined the ARG!`);
            } catch (error) {
                console.log(`Error: ${error}`);
            }
        }

        msg.reply("New user registered successfully!");
    } else {
        msg.reply("User already exists. No changes were made.");
    }
}

async function leave(msg) {
    const userExists = await checkUsers(msg.author.id);
    if (userExists) {
        await Player.deleteOne({ _id: msg.author.id });

        const role = msg.guild.roles.cache.find((role) => role.name === "[ARG] Player");
        if (role) {
            try {
                const member = await msg.guild.members.fetch(msg.author.id);
                await member.roles.remove(role);
                console.log(`${msg.author.globalName} has left the ARG!`);
            } catch (error) {
                console.log(`Error: ${error}`);
            }
        }

        msg.reply("User removed successfully. Sorry to see you go 👋.");
    } else {
        msg.reply("User does not exist. No changes were made.");
    }
}

async function remove(msg, args) {
    const senderRoles = msg.member.roles.cache.map(r => r.name);
    if (senderRoles.includes("[ARG] Organiser")) {
        let id = args[0].match(/\d+/)[0];
        const userExists = await checkUsers(id);

        if (userExists) {
            await Player.deleteOne({ _id: id });

            const role = msg.guild.roles.cache.find((role) => role.name === "[ARG] Player");
            if (role) {
                try {
                    const member = await msg.guild.members.fetch(id);
                    await member.roles.remove(role);
                } catch (error) {
                    console.log(`Error: ${error}`);
                }
            }

            msg.reply("User removed successfully.");
        } else {
            msg.reply("User does not exist. No changes were made.");
        }
    } else {
        msg.reply("You do not have the permission to perform this operation.");
    }
}

async function add(msg, args) {
    const senderRoles = msg.member.roles.cache.map(r => r.name);
    if (senderRoles.includes("[ARG] Organiser")) {
        let id = args[0].match(/\d+/)[0];
        const userExists = await checkUsers(id);
        const member = await msg.guild.members.fetch(id);

        if (!userExists) {
            await upsertPlayer({
                id: id,
                name: member.user.globalName,
                currentPhase: 1
            });

            const role = msg.guild.roles.cache.find((role) => role.name === "[ARG] Player");
            if (role) {
                try {
                    await member.roles.add(role);
                } catch (error) {
                    console.log(`Error: ${error}`);
                }
            }

            msg.reply("User added successfully. Welcome welcome 👋");
        } else {
            msg.reply("User already exists. No changes were made.");
        }
    } else {
        msg.reply("You do not have the permission to perform this operation.");
    }
}

export { join, reset, leave, remove, add };
