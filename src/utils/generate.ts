import sqlite3 from 'sqlite3'
// Open a connection to the database file, if the file does not exist, it will be created
const db = new sqlite3.Database('store/timezones.db');

// Create the submissions table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS timezones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        submitter VARCHAR(19),
        user VARCHAR(19),
        timezone TEXT
    )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
            return false;
        } else {
            return true;
        }
    });
});

// Close the database connection
db.close();