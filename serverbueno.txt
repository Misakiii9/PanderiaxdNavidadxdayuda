const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db'); 
const app = express();
const mysql = require('mysql2');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static('public'));


app.get('/', (req, res) => {    
    res.sendFile(__dirname + '/public/index.html');  
});


app.post('/agregarPedido', (req, res) => {
    const { id_cliente, id_pan, cantidad, total, direccion } = req.body;

   
    const query = 'INSERT INTO Pedidos (id_cliente, id_pan, cantidad, total) VALUES (?, ?, ?, ?)';

    connection.query(query, [id_cliente, id_pan, cantidad, total], (err, result) => {
        if (err) {
            console.error('Error al agregar pedido:', err);
            return res.status(500).send('Error al agregar pedido');
        }

        res.json({ message: 'Pedido agregado exitosamente', id_cliente, id_pan, cantidad, total, direccion });
    });
});

app.get('/obtenerPanes', (req, res) => {
    connection.query('SELECT * FROM Panes', (err, results) => {
        if (err) {
            console.error('Error al obtener panes:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results);  
        }
    });
});

app.post('/agregarPan', (req, res) => {
    const { nombre, cantidad } = req.body;
    const query = 'INSERT INTO Panes (nombre, cantidad) VALUES (?, ?)';
    
    connection.query(query, [nombre, cantidad], (err, result) => {
        if (err) {
            console.error('Error al agregar pan:', err);
            return res.status(500).json({ error: 'Error al agregar pan' });
        }

        res.json({ message: 'Pan agregado exitosamente', nombre, cantidad });
    });
});


app.post('/actualizarPan', (req, res) => {
    const { id_pan, nombre, cantidad } = req.body;

    const query = 'UPDATE Panes SET nombre = ?, cantidad = ? WHERE id_pan = ?';
    
    connection.query(query, [nombre, cantidad, id_pan], (err, result) => {
        if (err) {
            console.error('Error al actualizar pan:', err);
            return res.status(500).send('Error al actualizar pan');
        }
        res.send('Pan actualizado exitosamente');
    });
});

app.post('/borrarPan', (req, res) => {
    const { id_pan } = req.body;

    const query = 'DELETE FROM Panes WHERE id_pan = ?';
    
    connection.query(query, [id_pan], (err, result) => {
        if (err) {
            console.error('Error al borrar pan:', err);
            return res.status(500).send('Error al borrar pan');
        }
        res.send('Pan eliminado exitosamente');
    });
});

app.post('/agregarPedido', (req, res) => {
    const { id_cliente, id_pan, cantidad, total } = req.body;
    const query = 'INSERT INTO Pedidos (id_cliente, id_pan, cantidad, total) VALUES (?, ?, ?, ?)';
    
    connection.query(query, [id_cliente, id_pan, cantidad, total], (err, result) => {
        if (err) {
            console.error('Error al agregar pedido:', err);
            res.status(500).send('Error al agregar pedido');
        } else {
            res.send('Pedido agregado');
        }
    });
});



app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
