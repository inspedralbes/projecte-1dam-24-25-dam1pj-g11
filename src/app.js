// src/app.js
const express = require('express');
const path = require('path');
const sequelize = require('./db');

// Importar rutas
const incidenciasEJSRoutes = require('./routes/incidenciasEJS.routes');

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configurar motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas principales
app.get('/', (req, res) => {
    res.render('index');
});

// Rutas para incidencias
app.use('/incidencias', incidenciasEJSRoutes);

// Manejador de errores 404
app.use((req, res, next) => {
    res.status(404).send('Página no encontrada');
});

// Manejador de errores globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error en el servidor: ' + err.message);
});

// Sincronizar base de datos y arrancar servidor
sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada correctamente');
        app.listen(PORT, () => {
            console.log(`Servidor iniciado en http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error al sincronizar la base de datos:', error);
    });

module.exports = app;