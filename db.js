
const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'n0m3l0', 
  database: 'LaDesesperanzaa'
});


connection.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos.');
});


module.exports = connection;
