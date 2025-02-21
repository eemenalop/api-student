"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
    res.send(`<h1>Students Edgar's API</h1>
        <h3>Already existing Endpoints:<h3>
        <ul>
            <li>/students</li>
            <li>/getById?id=</li>
            <li>/getByName?name=</li>
            <li>/createStudent</li>
            <li>/deleteStudent/:id</li>
        </ul>`);
});
let students = [
    { id: 1, name: 'Edgar', active: true },
    { id: 2, name: 'Juan', active: true },
    { id: 3, name: 'Jose', active: true }
];
/// get All Students
app.get('/getAllStudents', (req, res) => {
    const activeStudents = students.filter((student) => student.active === true);
    res.json({ activeStudents });
});
// getById
app.get('/getById', (req, res) => {
    const id = Number(req.query.id);
    if (isNaN(id)) {
        res.status(400).json({ msj: `Id must be a number` });
        return;
    }
    const student = students.find((element) => element.id === id);
    if (!student) {
        res.status(404).json({ msj: `Student by id ${id} not found` });
        return;
    }
    ;
    res.json(student);
});
// getByName
app.get('/getByName', (req, res) => {
    const name = req.query.name;
    const student = students.find((element) => element.name === name);
    if (!student) {
        res.status(404).json({ msj: `Student by name ${name} not found` });
    }
    ;
    res.json(student);
});
//createStudent
app.post('/createStudent', (req, res) => {
    try {
        const { name, active } = req.body;
        if (!name || typeof active !== 'boolean') {
            res.status(400).json({ msj: 'Some data are missing' });
            return;
        }
        const studetExists = students.some((student) => student.name.toLowerCase() === name.toLowerCase());
        if (studetExists) {
            res.status(400).json({ msj: `Student ${name} already exists. Enter other name.` });
            return;
        }
        const newId = students.length > 0 ? students[students.length - 1].id + 1 : 1;
        const newStudent = { id: newId, name, active };
        students.push(newStudent);
        res.status(201).json(`New student ${newStudent.name} was added sucessfully!`);
    }
    catch (_a) {
        res.status(500).json({ msj: `There was an error in the request` });
    }
});
app.put('/deleteStudent/:id', (req, res) => {
    try {
        const studentId = parseInt(req.params.id);
        const student = students.find((s) => s.id === studentId);
        if (!student) {
            res.status(400).json({ msj: 'Student not found' });
            return;
        }
        student.active = false;
        res.json({ msj: `Student with id ${studentId} have been deleted` });
    }
    catch (_a) {
        res.status(500).json({ msj: `There was an error in the request` });
    }
});
