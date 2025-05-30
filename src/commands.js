import {EmbedBuilder} from "discord.js";

function help(msg) {
    const cmdList = new EmbedBuilder()
    .setTitle("Help!")
    .setDescription("A list of all currently available commands.")
    .setColor("#0099ff")
    .setFooter({text: "Powered by Paper 🧻",})
    .addFields({
        name: "$welcome",
        value: "Provides you with a welcome message that contains the outlines of the CTF.",
        inline: false,
    },{
        name: "$intro",
        value: "Provides you with a brief introduction to the CTF's storyline.",
        inline: false,
    },{
        name: "$join",
        value: "Registers you as a new member to the CTF!",
        inline: false,
    },{
        name: "$reset",
        value: "Resets your progress within the CTF.",
        inline: false,
    },{
        name: "$leave",
        value: "Removes you from the CTF.",
        inline: false,
    },{
        name: "$phase#",
        value: "Provides you with the files for the specified challenge, replace the # with the number of the stage you're currently on.\n For example using $phase2 will give you the files for the second stage!",
        inline: false,
    },{
        name: "$submit",
        value: "Allows you to submit the flag to complete the challenge you're currently on and unlock the next one!\n Use case: $submit PaperCTF={myFlag}",
        inline: false,
    },);

    msg.channel.send({embeds: [cmdList]});
}

function welcome(msg) {
    const welcomeMessage = new EmbedBuilder()
    .setTitle("Welcome!")
    .setDescription("Welcome the first PaperCTF brought to you by ISS-SUDAN\n Please do try to be respectful throughtout the event and stick to the guidelines outlined below!")
    .setColor("#0099ff")
    .setFooter({text: "Powered by Paper 🧻",})
    .addFields({
        name: "CTF Guidelines",
        value: `**1.** Participate in the designated channels for general discussions and challenge-specific discussions.\n
        **2.** Submit flags in the correct format (that being PaperCTF={flag-text-here}).\n
        **3.** Respect Others' Progress. Communication is allowed between players though please avoid spoilers and don't share explicit solutions with others.\n
        **4.** Research on the go! You're allowed to google anything and everything you want, using AI tools is prohibited.\n
        **5.** Take it as an opportunity to learn something exciting though there is no harm in competition. Have fun!\n`,
        inline: false,
    },{
        name:"Need Help?",
        value:"You can always run the $help command for a list of all the available commands that Quigga is equipped with, though if you encounter any problems throughout your play or hit a wall, don't hesitate to contact any of the organizers about anything!"
    });

    msg.channel.send({embeds: [welcomeMessage]});
};

function intro(msg) {
    const storyIntro = new EmbedBuilder()
    .setTitle("Case Brief: Missing Person - Etti Morales")
    .setDescription("Detectives,\n\nYou’ve been assigned to investigate the disappearance of Etti Morales, a 21-year-old college student who hasn't been seen for days. Etti was known to stay in her room most of the time, rarely going out. Though when a friend of her's went to visit, her room's door was unlocked, and it room was empty, and there's been no sign of her since.\n\n Her phone is off, and there's no recent activity on her social media. Friends and professors describe her as a quiet, focused student with no history of trouble.\n\n Your first step is to investigate her dorm room and belongings. As of now, this appears to be a routine missing person’s case, but be thorough—details can easily be overlooked.\n Good luck, Detectives.")
    .setColor("#0099ff")
    .setFooter({text: "Powered by Paper 🧻",});

    msg.channel.send({embeds: [storyIntro]});
};

async function init(msg) {
    const member = await msg.guild.members.fetch(msg.author.id);

    if (member.permissions.has("ADMINISTRATOR")) {
        try {
            const playerRole = await msg.guild.roles.create({
                name: '[ARG] Player',
                color: '#0000FF',
                mentionable: true,
            });
    
            const organiserRole = await msg.guild.roles.create({
                name: '[ARG] Organiser',
                color: '#FF0000',
                mentionable: true,
                position: playerRole.position + 1
            });
                
            msg.reply("Player and Organiser roles successfully created!");
        } catch (error) {
            console.log(`Error: ${error}`);
            msg.reply("There was an error creating the roles, please try again.");
        }
    } else {
        msg.reply("You do not have permission to initialise the bot.");
    }
    
}

export { welcome, intro, help, init };