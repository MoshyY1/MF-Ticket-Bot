const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { TOKEN } = require('../config.json');

module.exports = async (client) => {
    const rest = new REST({ version: '10' }).setToken(TOKEN || process.env.token);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(client.user.id, client.guilds.cache.id),
            { body: client.commands.toJSON() }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }

    console.log(`${client.user.tag} is now online!`);

    setInterval(async () => {
        const guildName = client.guilds.cache.size > 0 ? client.guilds.cache.first().name : "";
        const activities = [`${guildName} | fasterr99 💝 fasterr99`, "fasterr99 💝 fasterr99"];
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];

        await client.user.setActivity(randomActivity);
    }, 10000); // 10 saniye (0x3e80'den 10'a çevrildi)
};
