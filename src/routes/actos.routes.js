// src/routes/actos.routes.js
const express = require('express');
const router = express.Router();
const Acto = require('../models/Acto');
const Incidencia = require('../models/Incidencia');

// Añadir un nuevo acto a una incidencia
// Cambiamos la ruta para que sea exactamente como se llama desde el formulario
router.post('/incidencias/:incidenciaId/actos', async (req, res) => {
    try {
        const { incidenciaId } = req.params;
        const { descripcion, responsable } = req.body;
        
        // Buscar la incidencia
        const incidencia = await Incidencia.findByPk(incidenciaId);
        if (!incidencia) {
            return res.status(404).send('Incidencia no encontrada');
        }
        
        // Contar los actos existentes
        const actos = await Acto.findAll({ where: { IncidenciaId: incidenciaId } });
        if (actos.length >= 3) {
            return res.status(400).send('La incidencia ya tiene el máximo de 3 actos permitidos');
        }
        
        // Crear el acto
        const acto = await Acto.create({
            descripcion,
            responsable,
            IncidenciaId: incidenciaId
        });
        
        res.redirect(`/incidencias/${incidenciaId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al añadir acto');
    }
});

// Eliminar un acto
router.get('/actos/:id/delete', async (req, res) => {
    try {
        const acto = await Acto.findByPk(req.params.id);
        if (!acto) {
            return res.status(404).send('Acto no encontrado');
        }
        
        const incidenciaId = acto.IncidenciaId;
        await acto.destroy();
        
        res.redirect(`/incidencias/${incidenciaId}`);
    } catch (error) {
        res.status(500).send('Error al eliminar el acto');
    }
});

module.exports = router;