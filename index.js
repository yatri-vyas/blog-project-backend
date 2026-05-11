const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = './db.json';

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// Users
app.get('/users', (req, res) => {
  const db = readDB();
  res.json(db.users);
});

app.get('/users/:id', (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

app.post('/users', (req, res) => {
  const db = readDB();
  const newUser = { ...req.body, id: Date.now().toString() };
  db.users.push(newUser);
  writeDB(db);
  res.json(newUser);
});

// Blogs
app.get('/blogs', (req, res) => {
  const db = readDB();
  res.json(db.blogs);
});

app.get('/blogs/:id', (req, res) => {
  const db = readDB();
  const blog = db.blogs.find(b => b.id === req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
});

app.post('/blogs', (req, res) => {
  const db = readDB();
  const newBlog = { ...req.body, id: Date.now().toString() };
  db.blogs.push(newBlog);
  writeDB(db);
  res.json(newBlog);
});

app.put('/blogs/:id', (req, res) => {
  const db = readDB();
  const index = db.blogs.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Blog not found" });
  db.blogs[index] = { ...db.blogs[index], ...req.body };
  writeDB(db);
  res.json(db.blogs[index]);
});

app.delete('/blogs/:id', (req, res) => {
  const db = readDB();
  db.blogs = db.blogs.filter(b => b.id !== req.params.id);
  writeDB(db);
  res.json({ message: 'Deleted' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));