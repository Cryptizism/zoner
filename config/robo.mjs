// @ts-check

/**
 * @type {import('robo.js').Config}
 **/
export default {
	clientOptions: {
		intents: ['Guilds', 'GuildMessages', 'GuildMembers',]
	},
	plugins: [],
	type: 'robo',
	experimental: {
		userInstall: true
	},
	logger: {
		level: 'debug'
	}
}
