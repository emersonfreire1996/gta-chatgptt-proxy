const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db.json');
let writeChain = Promise.resolve();

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], gains: [], tasks: [], goals: [] }, null, 2));
  }
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeDB(data) {
  // simple promise-chain "lock" to avoid concurrent writes clobbering
  writeChain = writeChain.then(() => new Promise((resolve, reject) => {
    fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8', (err) => err ? reject(err) : resolve());
  }));
  return writeChain;
}

function getCollection(name) {
  const db = readDB();
  if (!db[name]) db[name] = [];
  return { items: db[name], db };
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

module.exports = { readDB, writeDB, getCollection, uid, DB_PATH };
