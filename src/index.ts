import express, {Request, Response} from 'express';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`)
});

app.get('/', (req: Request, res: Response)=>{
    res.send(`<h1>Students Edgar's API</h1>
        <h3>Already existing Endpoints:<h3>
        <ul>
            <li>/getAllStudents</li>
            <li>/getById?id=</li>
            <li>/getByName?name=</li>
            <li>/createStudent</li>
            <li>/deleteStudent/:id</li>
            <li>/updateStudentName/:id</li>
        </ul>`);
});

interface Students {
    id: number,
    name: string,
    active: boolean
}

let students: Students[] = [
    {id: 1, name: 'Edgar', active: true},
    {id: 2, name: 'Juan', active: true},
    {id: 3, name: 'Jose', active: true}
];

/// get All Students

app.get('/getAllStudents', (req: Request, res: Response)=>{
    const activeStudents = students.filter((student)=> student.active === true);
    res.json({activeStudents});
})

// getById

app.get('/getById', (req: Request, res: Response)=>{
    const id = Number(req.query.id);
    if(isNaN(id)){
        res.status(400).json({msj: `Id must be a number`})
        return;
    }
    const student = students.find((element) => element.id === id);
    
    if(!student){
        res.status(404).json({msj: `Student by id ${id} not found`})
        return;
    };

    
    res.json(student);
})

// getByName

app.get('/getByName', (req: Request, res: Response)=>{
    const name = req.query.name;
    const student = students.find((element) => element.name === name);

    if(!student){
        res.status(404).json({msj: `Student by name ${name} not found`})
    };

    res.json(student);

})

//createStudent

app.post('/createStudent', (req: Request, res: Response)=>{
    try{
        const { name, active } = req.body;
    
        if (!name || typeof active !== 'boolean'){
            res.status(400).json({msj: 'Some data are missing'})
            return;
        }
    
        const studetExists = students.some((student)=> student.name.toLowerCase() === name.toLowerCase())
    
        if (studetExists){
            res.status(400).json({msj: `Student ${name} already exists. Enter other name.`});
            return;
        }
        
        const newId = students.length > 0 ? students[students.length - 1].id + 1 : 1;
        const newStudent: Students = {id: newId, name, active};
        students.push(newStudent);
        res.status(201).json(`New student ${newStudent.name} was added sucessfully!`)
    }catch{
        res.status(500).json({msj: `There was an error in the request`})
    }
})

// deleteStudent

app.patch('/deleteStudent/:id', (req: Request, res: Response)=>{
    try{
        const studentId = parseInt(req.params.id);
        const student = students.find((s)=> s.id === studentId);

        if(!student){
            res.status(400).json({msj: 'Student not found'});
            return;
        }
        student.active = false;

        res.json({msj: `Student with id ${studentId} have been deleted`})

    }catch{
        res.status(500).json({msj: `There was an error in the request`})
    }
});


// updateStudentName

app.patch('/updateStudentName/:id', (req: Request, res: Response) => {
    try {
        const studentId = parseInt(req.params.id);
        const student = students.find((s) => s.id === studentId);

        if(!student){
            res.status(400).json({msj: 'Student not found'});
            return;
        }
        student.name = req.body.name;
        res.json({msj: `Change student name with id ${studentId} to ${student.name}`})

       
    } catch {
        res.status(500).json({msj: `There was an error in the request`})
   }
});
