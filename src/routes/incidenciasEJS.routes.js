// src/routes/incidenciasEJS.routes.js modificado
const express = require('express');
const router = express.Router();
const Incidencia = require('../models/Incidencia');

// Listar incidencias (GET)
router.get('/', async (req, res) => {
    try {
        const incidencias = await Incidencia.findAll();
        res.render('incidencias/list', { incidencias });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al recuperar incidencias');
    }
});

// Form para crear una incidencia (GET)
router.get('/new', async (req, res) => {
    try {
        res.render('incidencias/new');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el formulario');
    }
});

// Crear incidencia (POST)
router.post('/create', async (req, res) => {
    try {
        const { titulo, descripcion, estado, prioridad, tipo, tecnico } = req.body;
        await Incidencia.create({ 
            titulo, 
            descripcion, 
            estado, 
            prioridad, 
            tipo, 
            tecnico 
        });
        res.redirect('/incidencias'); // Vuelve al listado
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear la incidencia');
    }
});

// Ver detalles de una incidencia (GET)
router.get('/:id', async (req, res) => {
    try {
        // Intenta primero encontrar la incidencia y loguea el resultado
        console.log(`Buscando incidencia con ID: ${req.params.id}`);
        const incidencia = await Incidencia.findByPk(req.params.id);
        
        if (!incidencia) {
            console.log(`Incidencia con ID ${req.params.id} no encontrada`);
            return res.status(404).send('Incidencia no encontrada');
        }
        
        console.log(`Incidencia encontrada: ${JSON.stringify(incidencia)}`);
        
        // Renderizar la vista con los datos
        res.render('incidencias/detail', { 
            incidencia
        });
    } catch (error) {
        console.error('Error al cargar los detalles de la incidencia:', error);
        res.status(500).send(`Error al cargar los detalles de la incidencia: ${error.message}`);
    }
});

// Form para editar una incidencia (GET)
router.get('/:id/edit', async (req, res) => {
    try {
        const incidencia = await Incidencia.findByPk(req.params.id);
        if (!incidencia) return res.status(404).send('Incidencia no encontrada');
        res.render('incidencias/edit', { incidencia });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el formulario de edición');
    }
});

// Actualizar incidencia (POST)
router.post('/:id/update', async (req, res) => {
    try {
        const { prioridad, tipo, tecnico } = req.body;
        const incidencia = await Incidencia.findByPk(req.params.id);
        if (!incidencia) return res.status(404).send('Incidencia no encontrada');
        
        incidencia.prioridad = prioridad;
        incidencia.tipo = tipo;
        incidencia.tecnico = tecnico;
        
        await incidencia.save();
        res.redirect('/incidencias');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la incidencia');
    }
});

// Eliminar incidencia (GET, por simplicidad)
router.get('/:id/delete', async (req, res) => {
    try {
        const incidencia = await Incidencia.findByPk(req.params.id);
        if (!incidencia) return res.status(404).send('Incidencia no encontrada');
        
        // Eliminar la incidencia
        await incidencia.destroy();
        
        res.redirect('/incidencias');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la incidencia');
    }
});

module.exports = router;