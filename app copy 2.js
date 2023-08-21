const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.urlencoded({
    extended: true
}));

const session = require('express-session');

app.use(session({
    secret: 'mi-secreto',
    resave: false,
    saveUninitialized: true
}));





// Crear la conexión con la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'discotelapatrona',
});

// Establecer la conexión con la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        return;
    }
    console.log('Conexión a la base de datos establecida');
});

// Configuración de la carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'assets')));

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.render('index');
});

// Agregar más rutas y controladores según las necesidades de tu proyecto
// Por ejemplo:
app.post('/login', (req, res) => {
    const { correo, contraseña } = req.body;
    // Aquí puedes realizar la lógica de autenticación con la base de datos y manejo de sesiones
});

// Ruta para el inicio de sesión
app.get('/sesion.html', (req, res) => {
    res.render('sesion', {
        mensajeError: null
    });
});

app.get('/usuarios.html', (req, res) => {
    res.render('usuarios');
});


// Ruta para el inicio de sesión
app.post('/iniciar-sesion', (req, res) => {
    const { email, password } = req.body;
  
    const query = 'SELECT * FROM Empleados WHERE email = ? AND password = ?';
    const values = [email, password];
  
    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Error al realizar la consulta:', error);
        res.render('sesion', {
          mensajeError: 'Error al iniciar sesión.'
        });
      } else {
        if (results.length > 0) {
          // El usuario ha iniciado sesión correctamente
          const nombreUsuario = results[0].nombre;
          const tipoUsuario = results[0].TipoCuenta; // Usar el nombre correcto del campo
  
          if (tipoUsuario === 'administrador') {
            // Redireccionar a la página de administrador
            res.render('pagina-administrador', {
              nombreUsuario
            });
          } else if (tipoUsuario === 'empleado') {
            // Redireccionar a la página de empleado
            res.render('bienvenido', {
              nombreUsuario
            });
          }
        } else {
          // Las credenciales son incorrectas
          res.render('sesion', {
            mensajeError: 'Credenciales incorrectas.'
          });
        }
      }
    });
  });
  

// Ruta para administrar estudiantes
app.get('/agregar-productos', (req, res) => {
    const query = 'SELECT * FROM usuarios';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los usuarios:', error);
            res.status(500).send('Error al obtener los usuarios.');
        } else {
            res.render('administrar_estudiantes', {
                usuarios: results
            });
        }
    });
});


app.get('/registrar-producto', (req, res) => {
    // Realiza una consulta para obtener información necesaria, como clientes y empleados
    const clientesQuery = 'SELECT * FROM Clientes';
    const empleadosQuery = 'SELECT * FROM Empleados';
  
    connection.query(clientesQuery, (errorClientes, resultsClientes) => {
        if (errorClientes) {
            console.error('Error al obtener los clientes:', errorClientes);
            res.status(500).send('Error al obtener los clientes.');
        } else {
            connection.query(empleadosQuery, (errorEmpleados, resultsEmpleados) => {
                if (errorEmpleados) {
                    console.error('Error al obtener los empleados:', errorEmpleados);
                    res.status(500).send('Error al obtener los empleados.');
                } else {
                    // Renderiza la página para registrar productos consumidos
                    res.render('registrar_producto', {
                        clientes: resultsClientes,
                        empleados: resultsEmpleados,
                        mensaje: null // Puedes personalizar un mensaje de éxito si es necesario
                    });
                }
            });
        }
    });
});









// Ruta para manejar el registro de usuarios
app.post('/registrar', (req, res) => {
    const { nombre, email, password, tipo } = req.body;

    // Verifica el valor del campo "tipo" y asigna el tipo de cuenta correspondiente
    let tipoCuenta = '';
    if (tipo === 'empleado') {
        tipoCuenta = 'empleado';
    } else if (tipo === 'administrador') {
        tipoCuenta = 'administrador';
    }

    const query = 'INSERT INTO Empleados (nombre, email, password, TipoCuenta) VALUES (?, ?, ?, ?)';
    const values = [nombre, email, password, tipoCuenta];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al guardar el usuario:', error);
            res.send('Error al registrar el usuario.');
        } else {
            console.log('Usuario registrado exitosamente.');
            res.send('Usuario registrado exitosamente.');
        }
    });
});



// ... Importa los módulos necesarios y configura la base de datos ...

// Ruta para mostrar la lista de productos del inventario
app.get('/inventario-productos', (req, res) => {
    const query = 'SELECT * FROM InventarioProductos';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener el inventario de productos:', error);
            res.status(500).send('Error al obtener el inventario de productos.');
        } else {
            res.render('inventario_productos', { productos: results });
        }
    });
});

// Ruta para mostrar el formulario de agregar producto al inventario
app.get('/agregar-producto', (req, res) => {
    res.render('agregar_producto'); // Asegúrate de tener un archivo EJS llamado "agregar_producto"
});

// Ruta para procesar la adición de productos al inventario
app.post('/agregar-producto', (req, res) => {
    const { nombre, precio, cantidad } = req.body;

    // Insertar el nuevo producto en la base de datos
    const query = 'INSERT INTO InventarioProductos (NombreProducto, PrecioProducto, CantidadStock) VALUES (?, ?, ?)';
    const values = [nombre, precio, cantidad];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al agregar el producto:', error);
            // Manejar el error de alguna manera
            res.redirect('/inventario-productos'); // Redirigir de nuevo a la lista de productos
        } else {
            console.log('Producto agregado exitosamente.');
            // Redirigir a la lista de productos después de agregar
            res.redirect('/inventario-productos');
        }
    });
});

// Ruta para mostrar el formulario de editar producto
// Ruta para editar un producto
app.get('/editar-producto/:id', (req, res) => {
    const productoID = req.params.id;

    const query = 'SELECT * FROM InventarioProductos WHERE IDProducto = ?';
    connection.query(query, [productoID], (error, results) => {
        if (error) {
            console.error('Error al obtener el producto:', error);
            res.status(500).send('Error al obtener el producto.');
        } else {
            const producto = results[0];
            res.render('editar_producto', { producto });
        }
    });
});

// Ruta para guardar cambios en un producto editado
app.post('/editar-producto/:id', (req, res) => {
    const productoID = req.params.id;
    const { nombre, precio, cantidad } = req.body;

    const query = 'UPDATE InventarioProductos SET NombreProducto = ?, PrecioProducto = ?, CantidadStock = ? WHERE IDProducto = ?';
    const values = [nombre, precio, cantidad, productoID];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al editar el producto:', error);
            res.status(500).send('Error al editar el producto.');
        } else {
            console.log('Producto editado exitosamente.');
            res.redirect('/inventario-productos');
        }
    });
});


// Ruta para eliminar producto
app.get('/eliminar-producto/:id', (req, res) => {
    const productId = req.params.id;
    const query = 'DELETE FROM InventarioProductos WHERE IDProducto = ?';
    connection.query(query, [productId], (error, results) => {
        if (error) {
            console.error('Error al eliminar el producto:', error);
            res.status(500).send('Error al eliminar el producto.');
        } else {
            res.redirect('/inventario-productos');
        }
    });
});

// Manejar la finalización del servidor y cerrar la conexión con la base de datos
process.on('SIGINT', () => {
    connection.end((err) => {
        if (err) {
            console.error('Error al cerrar la conexión con la base de datos:', err.message);
        }
        process.exit();
    });
});

// Ruta para obtener la lista de clientes
app.get('/clientes', (req, res) => {
    const query = 'SELECT * FROM Clientes';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener la lista de clientes:', error);
            res.status(500).send('Error al obtener la lista de clientes.');
        } else {
            res.render('clientes', { clientes: results });
        }
    });
});

// Continúa con el resto de las rutas y configuraciones según tu proyecto

// Ruta para agregar un nuevo cliente
app.get('/agregar-cliente', (req, res) => {
    res.render('agregar_cliente');
});

app.post('/agregar-cliente', (req, res) => {
    const { nombre, telefono, correo, otrosDetalles } = req.body;

    const query = 'INSERT INTO Clientes (Nombre, Telefono, CorreoElectronico, OtrosDetalles) VALUES (?, ?, ?, ?)';
    const values = [nombre, telefono, correo, otrosDetalles];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al agregar el cliente:', error);
            res.status(500).send('Error al agregar el cliente.');
        } else {
            console.log('Cliente agregado exitosamente.');
            res.redirect('/clientes');
        }
    });
});




app.get('/editar-cliente/:id', (req, res) => {
    const idCliente = req.params.id;
    const query = 'SELECT * FROM Clientes WHERE IDCliente = ?';
    
    connection.query(query, [idCliente], (error, results) => {
        if (error || results.length === 0) {
            console.error('Error al obtener el cliente:', error);
            res.status(500).send('Error al obtener el cliente.');
        } else {
            res.render('editar_cliente', { cliente: results[0] });
        }
    });
});



// Ruta para editar un cliente
// app.get('/editar-cliente/:id', (req, res) => {
//     const idCliente = req.params.id;
//     const query = 'SELECT * FROM Clientes WHERE IDCliente = ?';
    
//     connection.query(query, [idCliente], (error, results) => {
//         if (error || results.length === 0) {
//             console.error('Error al obtener el cliente:', error);
//             res.status(500).send('Error al obtener el cliente.');
//         } else {
//             res.render('editar_cliente', { cliente: results[0] });
//         }
//     });
// });


app.post('/editar-cliente/:id', (req, res) => {
    const idCliente = req.params.id;
    const { nombre, telefono, correo, otros } = req.body;

    const query = 'UPDATE Clientes SET Nombre = ?, Telefono = ?, CorreoElectronico = ?, OtrosDetalles = ? WHERE IDCliente = ?';
    const values = [nombre, telefono, correo, otros, idCliente];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al editar el cliente:', error);
            res.status(500).send('Error al editar el cliente.');
        } else {
            console.log('Cliente editado exitosamente.');
            res.redirect('/clientes'); // Redirige a la lista de clientes después de editar
        }
    });
});

// Ruta para eliminar un cliente
app.get('/eliminar-cliente/:id', (req, res) => {
    const idCliente = req.params.id;
    const query = 'DELETE FROM Clientes WHERE IDCliente = ?';
    
    connection.query(query, [idCliente], (error) => {
        if (error) {
            console.error('Error al eliminar el cliente:', error);
            res.status(500).send('Error al eliminar el cliente.');
        } else {
            console.log('Cliente eliminado exitosamente.');
            res.redirect('/clientes'); // Asegúrate de que la redirección sea correcta
        }
    });
});


// Ruta para mostrar el formulario de realizar venta
app.get('/realizar-venta', (req, res) => {
    // Obtener clientes y productos del inventario desde la base de datos
    const clientesQuery = 'SELECT * FROM Clientes';
    const productosQuery = 'SELECT * FROM InventarioProductos';

    connection.query(clientesQuery, (errorClientes, resultsClientes) => {
        if (errorClientes) {
            console.error('Error al obtener los clientes:', errorClientes);
            res.status(500).send('Error al obtener los clientes.');
        } else {
            connection.query(productosQuery, (errorProductos, resultsProductos) => {
                if (errorProductos) {
                    console.error('Error al obtener los productos:', errorProductos);
                    res.status(500).send('Error al obtener los productos.');
                } else {
                    res.render('realizar_venta', {
                        clientes: resultsClientes,
                        productos: resultsProductos
                    });
                }
            });
        }
    });
});

// Ruta para procesar la venta y guardar en la base de datos
app.post('/guardar-venta', (req, res) => {
    const { cliente, productos } = req.body;
    const fechaVenta = new Date();
    let totalVenta = 0;

    // Calcular el total de la venta sumando el precio de los productos seleccionados
    // Agregar lógica para calcular la cantidad y sumar los precios

    // Insertar la venta en la base de datos
    const query = 'INSERT INTO Ventas (IDCliente, IDEmpleado, FechaVenta, TotalVenta, DetallesVenta) VALUES (?, ?, ?, ?, ?)';
    const values = [cliente, /* IDEmpleado */, fechaVenta, totalVenta, /* DetallesVenta */];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al guardar la venta:', error);
            res.status(500).send('Error al guardar la venta.');
        } else {
            console.log('Venta registrada exitosamente.');
            res.redirect('/ventas'); // Redirigir a la página de ventas o a donde desees
        }
    });
});






// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
