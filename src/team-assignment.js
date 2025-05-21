import { ChannelType } from "discord.js";
import { Player, Team } from "./progress-schema.js";
import { upsertPlayer } from "./utility.js";

async function registerTeam(msg) {
    const senderRoles = msg.member.roles.cache.map(r => r.name);
    const playerRole = msg.guild.roles.cache.find(r => r.name === '[ARG] Player');

    if (!senderRoles.includes("[ARG] Organiser")) {
        return msg.reply("You do not have permission to use this command, please contact an organiser.");
    }

    const match = msg.content.match(/\$registerteam\s+\"([^\"]+)\"\s+(#[A-Fa-f0-9]{6})\s+((<@!?\d+>\s*){1,3})/);
    if (!match) return msg.reply("Usage: $registerteam \"Team Name\" #hexcolor @user1 @user2 (up to 3)");

    const [, teamName, colourCode, userMentions] = match;
    const mentionedUsers = Array.from(msg.mentions.users.values());

    const existingTeam = await Team.findOne({ name: teamName });
    if (existingTeam) return msg.reply("A team with that name already exists, please try another one.");

    for (const usr of mentionedUsers) {
        const player = await Player.findById(usr.id);
        if (player && player.team) return msg.reply(`${usr.tag} is already in a team.`);
    }

    const role = await msg.guild.roles.create({
        name: teamName,
        color: colourCode,
        mentionable: false,
        position: playerRole.position + 1,
        hoist: true,
        reason: `Team role for ${teamName}`
    });

    const channel = await msg.guild.channels.create({
        name: teamName.toLowerCase().replace(/\s+/g, "-"),
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: msg.guild.roles.everyone,
                deny: ["ViewChannel"]
            },
            {
                id: role.id,
                allow: ["ViewChannel", "SendMessages"]
            }
        ]
    });

    let category = msg.guild.channels.cache.find(c => c.name === "Team Channels" && c.type === "GUILD_CATEGORY");
    console.log(category);

    if (!category) {
        category = await msg.guild.channels.create({
            name: "Team Channels",
            type: ChannelType.GuildCategory
        });
    };

    channel.setParent(category.id);

    const memberIDs = mentionedUsers.map(u => u.id);

    const newTeam = await Team.create({
        name: teamName,
        members: memberIDs,
        roleID: role.id,
        channelID: channel.id,
        colour: colourCode
    });

    for (const usr of mentionedUsers) {
        await upsertPlayer({
            id: usr.id,
            name: usr.globalName,
            team: newTeam._id
        });

        const member = await msg.guild.members.fetch(usr.id);
        await member.roles.add(role);
    }

    msg.reply(`Team **${teamName}** created with ${mentionedUsers.map(u => u.tag).join(", ")}`);
}

async function addMember(msg) {
    const senderRoles = msg.member.roles.cache.map(r => r.name);
    if (!senderRoles.includes("[ARG] Organiser")) {
        return msg.reply("You do not have permission to use this command, please contact an organiser.");
    }

    const match = msg.content.match(/\$addmember\s+\"([^\"]+)\"\s+<@!?(\d+)>/);
    if (!match) return msg.reply("Usage: $addmember \"Team Name\" @user");

    const [, teamName, userId] = match;
    const user = await msg.guild.members.fetch(userId);
    if (!user) return msg.reply("User not found in this Server.");

    const team = await Team.findOne({ name: teamName });
    if (!team) return msg.reply("Team not found.");
    if (team.members.length >= 3) return msg.reply("This team is already full.");

    const player = await Player.findById(userId);
    if (player && player.team) return msg.reply("This user is already in a team.");

    team.members.push(userId);
    await team.save();

    await upsertPlayer({
        id: userId,
        name: user.globalName,
        team: team._id
    });

    const role = await msg.guild.roles.fetch(team.roleID);
    await user.roles.add(role);

    msg.reply(`Added ${user.user.tag} to **${team.name}**.`);
}

async function removeMember(msg) {
    const senderRoles = msg.member.roles.cache.map(r => r.name);
    if (!senderRoles.includes("[ARG] Organiser")) {
        return msg.reply("You do not have permission to use this command, please contact an organiser.");
    }

    const match = msg.content.match(/\$removemember\s+\"([^\"]+)\"\s+<@!?(\d+)>/);
    if (!match) return msg.reply("Usage: $removemember \"Team Name\" @user");

    const [, teamName, userId] = match;
    const user = await msg.guild.members.fetch(userId);
    if (!user) return msg.reply("User not found in this guild.");

    const team = await Team.findOne({ name: teamName });
    if (!team) return msg.reply("Team not found.");
    if (!team.members.includes(userId)) return msg.reply("This user is not part of that team.");

    team.members = team.members.filter(id => id !== userId);
    await team.save();

    await upsertPlayer({
        id: userId,
        name: user.globalName,
        team: null
    });

    const role = await msg.guild.roles.fetch(team.roleID);
    await user.roles.remove(role);

    msg.reply(`Removed ${user.user.tag} from **${team.name}**.`);
}

async function deleteTeam(msg) {
    const senderRoles = msg.member.roles.cache.map(r => r.name);
    if (!senderRoles.includes("[ARG] Organiser")) {
        return msg.reply("You do not have permission to use this command, please contact an organiser.");
    }

    const match = msg.content.match(/\$deleteteam\s+\"([^\"]+)\"/);
    if (!match) return msg.reply("Usage: $deleteteam \"Team Name\"");

    const [, teamName] = match;
    const team = await Team.findOne({ name: teamName });
    if (!team) return msg.reply("Team not found.");

    try {
        const role = await msg.guild.roles.fetch(team.roleID);
        if (role) await role.delete("Deleting team role");

        const channel = await msg.guild.channels.fetch(team.channelID);
        if (channel) await channel.delete("Deleting team channel");
    } catch (err) {
        console.error("Error deleting role/channel:", err);
    }

    for (const memberId of team.members) {
        await upsertPlayer({
            id: memberId,
            team: null
        });

        try {
            const guildMember = await msg.guild.members.fetch(memberId);
            const role = await msg.guild.roles.fetch(team.roleID);
            if (role && guildMember.roles.cache.has(role.id)) {
                await guildMember.roles.remove(role);
            }
        } catch {
            // Ignore fetch errors
        }
    }

    await Team.deleteOne({ _id: team._id });

    msg.reply(`🗑️ Team **${teamName}** and its records have been deleted.`);
}

export { registerTeam, addMember, removeMember, deleteTeam };