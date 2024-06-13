import type { CommandConfig, CommandOptions, CommandResult } from 'robo.js'
import { type CommandInteraction, type AutocompleteInteraction, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { getOwnTimezone, getUser } from '../../utils/db';
import { compareTimezones } from '../../utils/humanise';
import moment from 'moment-timezone';

export const config: CommandConfig = {
  description: 'Gets the timezones of user(s)',
  options: [
    {
      name: 'user',
      description: 'The user to get the timezone of',
      type: 'user',
      required: false,
    },
    {
      name: 'hidden',
      description: 'Whether or not the message response should only be visible to you or not. Defaults to true.',
      type: 'boolean',
      required: false,
    }
  ]
}

export default async (interaction: ChatInputCommandInteraction): Promise<CommandResult> => {
  const user = interaction.options.getUser('user') || interaction.user;
  let info;
  let own;
  if(interaction.options.getUser('user')){
    info = await getUser(user.id, interaction.user.id);
    own = await getOwnTimezone(interaction.user.id);
  } else {
    own = await getOwnTimezone(interaction.user.id);
    if(own !== undefined){
      info = [own];
    }
  }

  let message: string[] = [];
  if (info === undefined){
    interaction.reply({content: "⚠ No timezone found for that user.", ephemeral: true});
    return;
  } else if (info.length > 1){
    message.push("⚠ You and the target user have set their timezone as different ones. Update if appropriate.");
  }

  // create an embed with the timezone information, also fetch the user's timezone and make a comparison
  const embed = new EmbedBuilder()
    .setTitle(`Timezone for ${user.displayName}`)
    .setColor("#00b0f4")
    .setFooter({
      text: "Add Zoner to your own personal apps today!",
    })
    .setTimestamp();

  if(info.length === 1){
    embed.addFields({
      name: "Timezone",
      value: `The timezone for <@${user.id}> is \`${info[0].timezone}\` set by <@${info[0].submitter}>.`,
      inline: true,
    });
  } else {
    let setBySelf = info.find((i: { submitter: string; }) => i.submitter === user.id);
    let setByOther = info.find((i: { submitter: string; }) => i.submitter !== user.id);
    embed.addFields({
      name: "Timezone",
      value: `The timezone for <@${user.id}> is \`${setBySelf.timezone}\` set by <@${setBySelf.submitter}>.`,
      inline: true,
    });
    if (setByOther.timezone !== setBySelf.timezone) {
      embed.addFields({
        name: "Alternative Timezone",
        value: `You set a different timezone for <@${user.id}> which is \`${setByOther.timezone}\`.`,
        inline: true,
      });
    }
  }

  if(own !== undefined){
    embed.addFields({
      name: "Comparison",
      value: `You are ${compareTimezones(info[0].timezone, own.timezone)}\nIt is currently \`${moment().tz(info[0].timezone).format('LLL')}\``,
      inline: false,
    });
  } else {
    message.push("⚠ You have not set your timezone. Set it with `/timezone set`.");
  }

  interaction.reply({content: message.join("\n"), embeds: [embed], ephemeral: interaction.options.getBoolean('hidden') ?? true});
}