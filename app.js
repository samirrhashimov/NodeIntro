import express from 'express';
import fs from 'fs';

const app = express();
const PORT = 3200;
const DB_PATH = './database/db.json';

app.use(express.json());

const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return data ? JSON.parse(data) : { students: [] };
  } catch (error) {
    return { students: [] };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// 1. GET all students
app.get('/students', (req, res) => {
  const db = readDB();
  res.status(200).json({
    success: true,
    message: 'Bütün tələbələr əldə edildi',
    data: db.students,
    count: db.students.length
  });
});

// 2. GET student by ID
app.get('/students/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (Number.isNaN(index) || index < 1) {
    return res.status(400).json({ success: false, message: 'Yanlış index' });
  }

  const db = readDB();
  const idx = index - 1;

  if (idx < 0 || idx >= db.students.length) {
    return res.status(404).json({ success: false, message: `Index: ${index} ilə tələbə tapılmadı` });
  }

  res.status(200).json({ success: true, message: 'Tələbə uğurla tapıldı', data: db.students[idx] });
});

// 3. POST student
app.post('/students', (req, res) => {
  const { name, surname, age, isStudent } = req.body;
  const db = readDB();
  const newStudent = {
    name,
    surname,
    age,
    isStudent: isStudent !== undefined ? isStudent : true
  };

  db.students.push(newStudent);
  writeDB(db);

  res.status(201).json({ success: true, message: 'Tələbə uğurla əlavə edildi', data: newStudent });
});

// 4. DELETE student
app.delete('/students/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (Number.isNaN(index) || index < 1) {
    return res.status(400).json({ success: false, message: 'Yanliş index' });
  }

  const db = readDB();
  const idx = index - 1;

  if (idx < 0 || idx >= db.students.length) {
    return res.status(404).json({ success: false, message: `${index} ID-li ilə tələbə tapılmadı` });
  }

  const deletedStudent = db.students.splice(idx, 1)[0];
  writeDB(db);

  res.status(200).json({ success: true, message: 'Tələbə silindi', data: deletedStudent });
});

// 5. PUT student
app.put('/students/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  const { name, surname, age, isStudent } = req.body;
  const db = readDB();
  if (Number.isNaN(index) || index < 1) {
    return res.status(400).json({ success: false, message: 'Yanliş index' });
  }

  const studentIndex = index - 1;

  if (studentIndex < 0 || studentIndex >= db.students.length) {
    return res.status(404).json({ success: false, message: `Index: ${index} ilə tələbə tapılmadı` });
  }

  db.students[studentIndex] = {
    name,
    surname,
    age,
    isStudent
  };

  writeDB(db);

  res.status(200).json({ success: true, message: 'Tələbə yeniləndi', data: db.students[studentIndex] });
});


app.patch('/students/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  const updates = req.body;

  const db = readDB();

  if (Number.isNaN(index) || index < 1) {
    return res.status(400).json({ success: false, message: 'Yanliş index' });
  }

  const studentIndex = index - 1;

  if (studentIndex < 0 || studentIndex >= db.students.length) {
    return res.status(404).json({ success: false, message: `${index} ID-li tələbə tapılmadı` });
  }

  db.students[studentIndex] = {
    ...db.students[studentIndex],
    ...updates
  };

  writeDB(db);

  res.status(200).json({ success: true, message: 'Tələbə yeniləndi', data: db.students[studentIndex] });
});

app.listen(PORT, () => {
  console.log(`🚀 Server run http://localhost:${PORT}`);
});