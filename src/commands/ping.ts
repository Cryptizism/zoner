import type { CommandConfig } from 'robo.js'
import type { CommandInteraction  } from 'discord.js'

export const config: CommandConfig = {
	description: 'Replies with Pong!'
}

export default (interaction: CommandInteraction) => {
	return interaction.reply({content: 'Pong!', ephemeral: true})
}