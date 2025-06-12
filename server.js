// server.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EVENTS_FILE = path.join(__dirname, 'events.json');
const USERS_FILE  = path.join(__dirname, 'users.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // serve index.html, auth.html etc.

// Eventos
app.get('/api/events', (req, res) => {
  res.json(readJson(EVENTS_FILE));
});
app.post('/api/events', (req, res) => {
  const evs = readJson(EVENTS_FILE);
  evs.push(req.body);
  writeJson(EVENTS_FILE, evs);
  res.json(evs);
});
app.delete('/api/events/:id', (req, res) => {
  let evs = readJson(EVENTS_FILE);
  evs = evs.filter(e => e.id !== req.params.id);
  writeJson(EVENTS_FILE, evs);
  res.json(evs);
});

// Usuários (já deve existir users.json ou crie vazio "[]")
app.get('/api/users', (req, res) => {
  res.json(readJson(USERS_FILE));
});
app.post('/api/users', (req, res) => {
  const us = readJson(USERS_FILE);
  us.push(req.body);
  writeJson(USERS_FILE, us);
  res.json(us);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
