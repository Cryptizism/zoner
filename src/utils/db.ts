import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('store/timezones.db');

export const getUser = (user: string, submitter: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM timezones WHERE user = ? AND submitter IN (?,?)`, [user, user, submitter], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

export const getOwnTimezone = (user: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM timezones WHERE user = ? AND submitter = ?`, [user, user], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

export const insertUser = (user: string, submitter: string, timezone: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        db.run(`INSERT INTO timezones (submitter, user, timezone) VALUES (?, ?, ?)`, [submitter, user, timezone], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const updateTimezone = (user: string, timezone: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        db.run(`UPDATE timezones SET timezone = ? WHERE user = ?`, [timezone, user], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const insertOrUpdateIfExist = async (submitter: string, user: string, timezone: string): Promise<void> => {
    const existingUser = await getUser(user, submitter);
    if (existingUser.length > 0) {
        try {
            await updateTimezone(user, timezone);
        } catch (error) {
            console.error('Error updating timezone:', error);
        }
    } else {
        try {
            await insertUser(user, submitter, timezone);
        } catch (error) {
            console.error('Error inserting user:', error);
        }
    }
};
