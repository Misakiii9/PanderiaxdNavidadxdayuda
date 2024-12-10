const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db'); // Conexión a la base de datos
const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Ruta para agregar un pedido
app.post('/agregarPedido', (req, res) => {
    const { nombre_pan, precio, cantidad, total, direccion_envio } = req.body;

    // Buscar el ID del pan por su nombre
    const queryPan = 'SELECT id_pan FROM Panes WHERE nombre = ?';
    connection.query(queryPan, [nombre_pan], (err, resultPan) => {
        if (err) {
            console.error('Error al buscar el pan:', err);
            return res.status(500).send('Error al buscar el pan');
        }

        if (resultPan.length === 0) {
            return res.status(404).json({ message: 'Pan no encontrado' });
        }

        const id_pan = resultPan[0].id_pan;

        // Insertar el pedido en la base de datos
        const queryPedido = `
            INSERT INTO Pedidos (id_pan, cantidad, total, direccion_envio) 
            VALUES (?, ?, ?, ?)
        `;
        connection.query(queryPedido, [id_pan, cantidad, total, direccion_envio], (err, resultPedido) => {
            if (err) {
                console.error('Error al agregar pedido:', err);
                return res.status(500).send('Error al agregar pedido');
            }

            res.json({
                message: 'Pedido agregado exitosamente',
                pedido: {
                    id_pedido: resultPedido.insertId,
                    nombre_pan,
                    cantidad,
                    total,
                    direccion_envio
                }
            });
        });
    });
});

// Ruta para obtener los pedidos
app.get('/pedidos', (req, res) => {
    const query = `
        SELECT p.id_pedido, panes.nombre AS nombre_pan, p.cantidad, p.total, p.direccion_envio 
        FROM Pedidos p
        JOIN Panes panes ON p.id_pan = panes.id_pan
    `;
    connection.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener los pedidos:', err);
            return res.status(500).json({ message: 'Error al obtener los pedidos' });
        }

        res.json(result);
    });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
