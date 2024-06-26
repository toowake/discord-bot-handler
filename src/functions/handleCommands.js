const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');



module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        const clientId = process.env.ID.toString();
        client.commandArray = [];
        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
        }

        const rest = new REST({
            version: '9'
        }).setToken(process.env.TOKEN.toString());

        (async () => {
            try {
                console.log('[ CLIENT ] Started refreshing application (/) commands.');

                await rest.put(
                    Routes.applicationCommands(clientId), {
                        body: client.commandArray
                    },
                );

                console.log('[ CLIENT ] Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    };
};