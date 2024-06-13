import { BaseInteraction, StringSelectMenuInteraction } from "discord.js";
import { getState } from "robo.js";
import { insertOrUpdateIfExist } from "../utils/db";

export default (interaction: BaseInteraction) => {
	if (!interaction.isStringSelectMenu()) return;
    if(interaction.customId === 'timezone') {
        const timezone = interaction.values[0];
        const userID = getState(interaction.user.id);
        if (!userID){
            interaction.reply({content: 'No target user detected, try again.', ephemeral: true});
            return;
        }
        insertOrUpdateIfExist(interaction.user.id, userID, timezone);
        interaction.reply({content: `Saved timezone: \`${timezone}\` for <@${userID}>`, ephemeral: true});
    }
}
