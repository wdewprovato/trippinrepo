// Declare variables ------------------------------------
const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database ------------------------------------
const db = new sqlite3.Database("./data/database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create the locations if it doesn't exist ------------------------------------
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT,
      address TEXT,
      shortaddress TEXT,
      house TEXT,
      street TEXT,
      city TEXT,
      state TEXT,
      postcode TEXT,
      website TEXT,
      wikidata TEXT,
      wikipedia TEXT,
      phone TEXT,
      description TEXT,
      extra TEXT,
      type TEXT,
      option TEXT,
      status INTEGER,
      region TEXT,
      destype TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Create the states table if it doesn't exist ------------------------------------
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS states (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      region TEXT NOT NULL,
      stateabbr TEXT NOT NULL UNIQUE,
      statelong TEXT NOT NULL,
      timezone TEXT NOT NULL,
      utc TEXT NOT NULL
  )`);

  // Insert data in states if table is empty ------------------------------------
  db.get("SELECT COUNT(*) AS count FROM states", (err, row) => {
    if (row.count === 0) {
      const insertQuery = `INSERT INTO states (stateabbr, statelong, region, timezone, utc) VALUES
              ('AK', 'Alaska', 'BFE', 'AKST', 'UTC-09:00'),
              ('HI', 'Hawaii', 'BFE', 'HST', 'UTC-10:00'),
              ('IA', 'Iowa', 'Central', 'CST', 'UTC-06:00'),
              ('MO', 'Missouri', 'Central', 'CST', 'UTC-06:00'),
              ('NE', 'Nebraska', 'Central', 'CST', 'UTC-06:00'),
              ('ND', 'North Dakota', 'Central', 'CST', 'UTC-06:00'),
              ('SD', 'South Dakota', 'Central', 'CST', 'UTC-06:00'),
              ('IL', 'Illinois', 'Midwest', 'CST', 'UTC-06:00'),
              ('MN', 'Minnesota', 'Midwest', 'CST', 'UTC-06:00'),
              ('WI', 'Wisconsin', 'Midwest', 'CST', 'UTC-06:00'),
              ('IN', 'Indiana', 'Midwest', 'EST', 'UTC-05:00'),
              ('MI', 'Michigan', 'Midwest', 'EST', 'UTC-05:00'),
              ('OH', 'Ohio', 'Midwest', 'EST', 'UTC-05:00'),
              ('PA', 'Pennsylvania', 'Midwest', 'EST', 'UTC-05:00'),
              ('KY', 'Kentucky', 'Midwest', 'EST', 'UTC-05:00'),
              ('AZ', 'Arizona', 'Mountain', 'MST', 'UTC-07:00'),
              ('CO', 'Colorado', 'Mountain', 'MST', 'UTC-07:00'),
              ('ID', 'Idaho', 'Mountain', 'MST', 'UTC-07:00'),
              ('MT', 'Montana', 'Mountain', 'MST', 'UTC-07:00'),
              ('NM', 'New Mexico', 'Mountain', 'MST', 'UTC-07:00'),
              ('UT', 'Utah', 'Mountain', 'MST', 'UTC-07:00'),
              ('WY', 'Wyoming', 'Mountain', 'MST', 'UTC-07:00'),
              ('CT', 'Connecticut', 'Northeast', 'EST', 'UTC-05:00'),
              ('DE', 'Delaware', 'Northeast', 'EST', 'UTC-05:00'),
              ('DC', 'District of Columbia', 'Northeast', 'EST', 'UTC-05:00'),
              ('ME', 'Maine', 'Northeast', 'EST', 'UTC-05:00'),
              ('MD', 'Maryland', 'Northeast', 'EST', 'UTC-05:00'),
              ('MA', 'Massachusetts', 'Northeast', 'EST', 'UTC-05:00'),
              ('NH', 'New Hampshire', 'Northeast', 'EST', 'UTC-05:00'),
              ('NJ', 'New Jersey', 'Northeast', 'EST', 'UTC-05:00'),
              ('NY', 'New York', 'Northeast', 'EST', 'UTC-05:00'),
              ('RI', 'Rhode Island', 'Northeast', 'EST', 'UTC-05:00'),
              ('VT', 'Vermont', 'Northeast', 'EST', 'UTC-05:00'),
              ('AL', 'Alabama', 'South', 'CST', 'UTC-06:00'),
              ('AR', 'Arkansas', 'South', 'CST', 'UTC-06:00'),
              ('KS', 'Kansas', 'South', 'CST', 'UTC-06:00'),
              ('LA', 'Louisiana', 'South', 'CST', 'UTC-06:00'),
              ('MS', 'Mississippi', 'South', 'CST', 'UTC-06:00'),
              ('OK', 'Oklahoma', 'South', 'CST', 'UTC-06:00'),
              ('TN', 'Tennessee', 'South', 'CST', 'UTC-06:00'),
              ('TX', 'Texas', 'South', 'CST', 'UTC-06:00'),
              ('FL', 'Florida', 'South', 'EST', 'UTC-05:00'),
              ('GA', 'Georgia', 'South', 'EST', 'UTC-05:00'),
              ('NC', 'North Carolina', 'South', 'EST', 'UTC-05:00'),
              ('SC', 'South Carolina', 'South', 'EST', 'UTC-05:00'),
              ('VA', 'Virginia', 'South', 'EST', 'UTC-05:00'),
              ('WV', 'West Virginia', 'South', 'EST', 'UTC-05:00'),
              ('CA', 'California', 'West', 'PST', 'UTC-08:00'),
              ('NV', 'Nevada', 'West', 'PST', 'UTC-08:00'),
              ('OR', 'Oregon', 'West', 'PST', 'UTC-08:00'),
              ('WA', 'Washington', 'West', 'PST', 'UTC-08:00');`;
      db.run(insertQuery, (err) => {
        if (err) {
          console.error("Error inserting states:", err.message);
        } else {
          console.log("States data inserted successfully!");
        }
      });
    }
  });
});

module.exports = db;