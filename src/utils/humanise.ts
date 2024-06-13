import { getTimezone } from "countries-and-timezones";

export const compareTimezones = (timezone1Name: string, timezone2Name: string): string => {
    // Get timezone objects for both timezones
    const timezone1 = getTimezone(timezone1Name);
    const timezone2 = getTimezone(timezone2Name);

    if (!timezone1 || !timezone2) {
        return "Invalid timezone names provided.";
    }

    // Calculate offsets in hours
    const offset1Hours = timezone1.utcOffset / 60;
    const offset2Hours = timezone2.utcOffset / 60;

    // Calculate the time difference in hours
    const timeDifference = offset2Hours - offset1Hours;

    // Determine if timezone1 is ahead or behind timezone2
    let differenceString;
    if (timeDifference > 0) {
        differenceString = `ahead of \`${timezone2Name}\` by \`${timeDifference} hours\``;
    } else if (timeDifference < 0) {
        differenceString = `behind \`${timezone2Name}\` by \`${Math.abs(timeDifference)} hours\``;
    } else {
        differenceString = `in the same time as \`${timezone2Name}\``;
    }

    return differenceString;
}