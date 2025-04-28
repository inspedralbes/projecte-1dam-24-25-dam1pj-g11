// src/routes/incidencias.routes.js
const express = require('express');
const router = express.Router();
const Incidencia = require('../models/Incidencia');

// CREATE
router.post('/', async (req, res) => {
    try {
        const { titulo, descripcion, estado, prioridad, tipo, tecnico } = req.body;
        const incidencia = await Incidencia.create({ 
            titulo, 
            descripcion, 
            estado, 
            prioridad, 
            tipo, 
            tecnico 
        });
        res.status(201).json(incidencia);
    } catch (error) {
        res.status(500).json({ error: 'No se ha podido crear la incidencia' });
    }
});

// READ: todas 
router.get('/', async (req, res) => {
    try {
        const incidencias = await Incidencia.findAll();
        res.json(incidencias);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al recuperar las incidencias' });
    }
});

// READ: una sola
router.get('/:id', async (req, res) => {
    try {
        const incidencia = await Incidencia.findByPk(req.params.id);
        if (!incidencia) return res.status(404).json({ error: 'Incidencia no encontrada' });
        res.json(incidencia);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al recuperar la incidencia' });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const { prioridad, tipo, tecnico } = req.body;
        const incidencia = await Incidencia.findByPk(req.params.id);
        
        if (!incidencia) return res.status(404).json({ error: 'Incidencia no encontrada' });
        
        incidencia.prioridad = prioridad;
        incidencia.tipo = tipo;
        incidencia.tecnico = tecnico;
        
        await incidencia.save();
        res.json(incidencia);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la incidencia' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const incidencia = await Incidencia.findByPk(req.params.id);
        if (!incidencia) return res.status(404).json({ error: 'Incidencia no encontrada' });
        await incidencia.destroy(); 
        res.json({ message: 'Incidencia eliminada correctamente' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar la incidencia' });
    }
});

module.exports = router;