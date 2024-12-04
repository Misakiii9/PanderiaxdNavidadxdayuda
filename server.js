const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db');
const app = express();
const mysql = require('mysql2');

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Ruta principal
app.get('/', (req, res) => {    
    res.sendFile(__dirname + '/public/index.html');  
});

app.post('/agregarPedido', (req, res) => {
    const { nombre_cliente, direccion_envio_cliente, nombre_pan, cantidad, total, direccion_envio_pedido } = req.body;

    // Primero, agregar el cliente a la base de datos
    const queryCliente = 'INSERT INTO Clientes (nombre, direccion_envio) VALUES (?, ?)';
    connection.query(queryCliente, [nombre_cliente, direccion_envio_cliente], (err, resultCliente) => {
        if (err) {
            console.error('Error al agregar cliente:', err);
            return res.status(500).send('Error al agregar cliente');
        }

        // Obtener el id_cliente generado automáticamente
        const id_cliente = resultCliente.insertId;

        // Buscar el id_pan correspondiente al nombre del pan
        const queryPan = 'SELECT id_pan FROM Panes WHERE nombre = ?';
        connection.query(queryPan, [nombre_pan], (err, resultPan) => {
            if (err) {
                console.error('Error al buscar el pan:', err);
                return res.status(500).send('Error al buscar el pan');
            }

            if (resultPan.length === 0) {
                return res.status(404).send('Pan no encontrado');
            }

            const id_pan = resultPan[0].id_pan;

            // Luego, agregar el pedido con el id_cliente y id_pan
            const queryPedido = 'INSERT INTO Pedidos (id_cliente, id_pan, cantidad, total, direccion_envio) VALUES (?, ?, ?, ?, ?)';
            connection.query(queryPedido, [id_cliente, id_pan, cantidad, total, direccion_envio_pedido], (err, resultPedido) => {
                if (err) {
                    console.error('Error al agregar pedido:', err);
                    return res.status(500).send('Error al agregar pedido');
                }

                res.json({
                    message: 'Pedido y cliente agregados exitosamente',
                    pedido: { id_cliente, id_pan, cantidad, total, direccion_envio: direccion_envio_pedido }
                });
            });
        });
    });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
