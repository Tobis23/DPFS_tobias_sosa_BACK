const express = require ('express');
var mysql = require ('mysql');
const app = express();
const cors = require('cors');

const conexion = mysql.createConnection({

  host: '127.0.0.1',
  database: 'gimdatabase',
  user:'root',
  password:'',

});

const getConnection = () => {
   return conexion
}

//conexion.connect(function (error){
//    if(error){
//      throw error;
//    }else{
//      console.log('Conexion exitosa')
//    }
//});

//conexion.end();



app.use(express.json());

app.use(cors()) // HABILITANDO CORS GENERAL

// ARRAY CON MIEMBROS
const miembros = [
     {id: 1, user: 'Matias', email:'Matias1@gmail.com', password:'pirata123'},
     {id: 2, user:'Martin', email:'Martin2@gmail.com', password:'cory123'},
     {id: 3, user:'Pablo', email:'Pablo3@gmail.com', password:'kira123'},
];

app.get('/', (req, res) => {
    res.send('Node JS  api');
});


//ENDPOINTS-------------------------------------------------------------------------------------

// GET para recuperar todos los miembros
app.get('/api/miembros', async (req , res)=> {
    conexion.query('SELECT * FROM miembro',(err, rows, fields)=>{
        if(!err){
          res.send(rows);
        }
        else{
          console.log(err)
        }
    }); 
  })

  // GET para recuperar todas las actividades activas
app.get('/api/actividades', async (req , res)=> {
  conexion.query('SELECT * FROM actividades WHERE estado_actividad=1',(err, rows, fields)=>{
      if(!err){
        res.send(rows);
      }
      else{
        console.log(err)
      }
  }); 
})

// GET para recuperar un miembro en particular
app.get('/api/miembros/:id', (req , res)=> {
    const miembro = miembros.find(c => c.id === parseInt(req.params.id));
    if(!miembro) return res.status(404).send('Miembro no encontrado');
    else res.send(miembro);
});

// POST REGISTRO DE NUEVO MIEMBRO API -> MYSQL
app.post('/api/registro_Miembros', (req, res) =>{

  conexion.query("INSERT INTO miembro (user, email, password) VALUES('"+req.body.user+"','"+req.body.email+"','"+req.body.password+"')",(err, rows, fields)=>{
    if(!err){
      res.status(200).send('register successfull');
    }
    else{
      res.status(404).send('Error de carga');
    }
}); 
});

// POST LOGIN VERIFICACION API -> MYSQL
app.post('/api/login_Miembros', (req, res) =>{ 

  conexion.query("SELECT * FROM miembro where user= '"+req.body.user+"' and password='"+req.body.password+"'",(err, rows, fields)=>{
    if(!err){
      res.status(200).send('login successfull');
    }
    else{
      res.status(404).send('Miembro no encontrado');
    }
}); 

    //const miembro = miembros.find(c => (c.user === req.body.user && c.password === req.body.password)); // OPERADOR LOGICO
    //if(!miembro) return res.status(404).send('Miembro no encontrado');
    //else res.status(200).send('login successfull');
});


// DELETE para borrar miembro determinado
app.delete('/api/miembros/:id', (req, res) => {
    const miembro = miembros.find(c => c.id === parseInt(req.params.id));
    if (!miembro) return res.status(404).send ('Miembro no encontrado');

    const index = miembros.index0f(miembro);
    miembros.splice(index, 1);
    res.send(miembro);
});





const port = process.env.port || 80;
app.listen(port,() => console.log(`Escuchando en puerto ${port}...`));