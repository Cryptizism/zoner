import { setState, type CommandConfig, type CommandOptions, type CommandResult } from 'robo.js'
import type { CommandInteraction, AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js'
import { getAllCountries, getCountry, getTimezonesForCountry } from 'countries-and-timezones';
import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { insertOrUpdateIfExist } from '../../utils/db';

export const config: CommandConfig = {
  description: 'Gets the timezones of user(s)',
  options: [
    {
      name: 'country',
      description: 'The country you live in',
      type: 'string',
      required: true,
      autocomplete: true
    },
    {
      name: 'user',
      description: 'Set the timezone of someone else, this will only be visible to you. Defaults to you.',
      type: 'user',
      required: false
    }
  ]
}

const countries = Object.values(getAllCountries()).map((country: {name: string, id: string}) => ({
  name: country.name,
  value: country.id
}));

export const autocomplete = (interaction: AutocompleteInteraction) => {
    const countryQuery = interaction.options.get("country")?.value as string;
    const filtered = countries.filter((country) => country.name.toLowerCase().startsWith(countryQuery.toLowerCase()));

    return interaction.respond(filtered.map((country) => ({ name: country.name, value: country.value })).splice(0, 25));
};

export default async (interaction: ChatInputCommandInteraction): Promise<CommandResult> => {
  const country = interaction.options.get("country")?.value as string;
  const user = interaction.options.getUser('user') || interaction.user;
  const timezones = getTimezonesForCountry(country);

  if (!timezones || timezones.length === 0) {
    interaction.reply({content: 'No timezones found for that country', ephemeral: true});
    return;
  } else if (timezones.length === 1) {
    insertOrUpdateIfExist(interaction.user.id, user.id, timezones[0].name);
    interaction.reply({content: `Saved timezone: \`${timezones[0].name}\` for <@${user.id}>`, ephemeral: true});
    return;
  }

  // Filter out duplicate offsets
  const uniqueTimezones = timezones.filter((timezone, index, self) =>
    index === self.findIndex((t) => t.utcOffset === timezone.utcOffset)
  );

  const select = new StringSelectMenuBuilder()
    .setCustomId('timezone')
    .setPlaceholder('Select a timezone')
    .addOptions(uniqueTimezones.map((timezone) => ({
      label: `${timezone.name} (UTC${timezone.utcOffsetStr})`,
      value: timezone.name
    })));

  const row = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(select);

    setState(interaction.user.id, user.id)

    interaction.reply({content: 'Please select a timezone for that country!', ephemeral: true, components: [row]});
}
