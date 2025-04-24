// src/app.js
const express = require('express');
require('dotenv').config();
const sequelize = require('./db');
const path = require('path');

// Modelos
const Incidencia = require('./models/Incidencia');

// Rutas para API JSON
const incidenciasRoutes = require('./routes/incidencias.routes');

// Rutas EJS
const incidenciasRoutesEJS = require('./routes/incidenciasEJS.routes');

const app = express();

// Middleware para formularios y JSON
app.use(express.urlencoded({ extended: true })); // para formularios
app.use(express.json()); // para JSON

// Configuración de archivos estáticos
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas EJS
app.use('/incidencias', incidenciasRoutesEJS);

// Rutas API JSON
app.use('/api/incidencias', incidenciasRoutes);

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ruta principal
app.get('/', (req, res) => {
  res.render('index');
});

const port = process.env.PORT || 3000;

(async () => {
  try {
    // Sincronización de la base de datos con force: true para reiniciar las tablas
    await sequelize.sync({ force: true });
    console.log('Base de datos sincronizada');

    // Creamos algunas incidencias de ejemplo
    await Incidencia.create({
      titulo: 'PC no enciende',
      descripcion: 'El ordenador de recepción no enciende desde esta mañana.',
      estado: 'abierta',
      prioridad: 'alta',
      tipo: 'hardware',
      tecnico: 'Juan Pérez'
    });

    await Incidencia.create({
      titulo: 'Problemas con la impresora',
      descripcion: 'La impresora de la oficina 203 se atasca constantemente.',
      estado: 'en_proceso',
      prioridad: 'media',
      tipo: 'hardware',
      tecnico: 'María López'
    });

    await Incidencia.create({
      titulo: 'Error en aplicación de contabilidad',
      descripcion: 'La aplicación de contabilidad muestra un error al intentar generar informes mensuales.',
      estado: 'abierta',
      prioridad: 'critica',
      tipo: 'software'
    });

    await Incidencia.create({
      titulo: 'Wifi intermitente',
      descripcion: 'La conexión wifi en la sala de reuniones es intermitente desde ayer.',
      estado: 'resuelta',
      prioridad: 'media',
      tipo: 'red',
      tecnico: 'Carlos Ruiz'
    });

    // Iniciar servidor
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error al iniciar:", error);
  }
})();