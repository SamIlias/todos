import express from 'express';
import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const filePath = path.join(__dirname, 'todos.json');

app.use(cors()); // allow CORS so that frontend can make requests
app.use(express.json());

// POST /todos — save todo
app.post('/todos', async (req, res) => {
  try {
    // const data = req.body; //{ todo: {name: 'name'}}
    const data = req.body; //{ name: todoName, description: todoDescription }

    let todos = [];
    try {
      const fileData = await fsp.readFile(filePath, 'utf-8');
      todos = JSON.parse(fileData);
    } catch (error) {
      console.log(' File does not exist. Create new file.');
    }

    todos.push(data);

    await fsp.writeFile(filePath, JSON.stringify(todos, null, 2));

    res.status(201).json({ message: 'Todo has saved!', todos });
  } catch (error) {
    console.error('An error occured while saving.', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /todos — получить все задачи
app.get('/todos', async (req, res) => {
  try {
    const fileData = await fsp.readFile(filePath, 'utf-8');
    const todos = JSON.parse(fileData);
    res.json(todos);
  } catch (error) {
    res.status(200).json([]); // return empty array if file doesn't exist
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
