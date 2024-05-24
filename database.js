const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
    "CREATE TABLE users (id TEXT PRIMARY KEY, username TEXT UNIQUE, password TEXT)"
  );
});

module.exports = db;
