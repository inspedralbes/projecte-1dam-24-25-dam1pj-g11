// src/routes/actionsEJS.routes.js
const express = require('express');
const router = express.Router();
const Action = require('../models/Action');
const Issue = require('../models/Issue');
const User = require('../models/User');

// Formulario para añadir actuación
router.get('/create/:issueId', async (req, res) => {
  try {
    const issueId = req.params.issueId;
    const issue = await Issue.findByPk(issueId, {
      include: [
        { model: User, as: 'Creator' },
        { model: Department }
      ]
    });
    
    if (!issue) return res.status(404).send('Incidencia no encontrada');
    
    res.render('actions/create', { issue });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el formulario');
  }
});

// Crear actuación (POST)
router.post('/create', async (req, res) => {
  try {
    const { description, issueId, timeSpent } = req.body;
    
    // En producción, technicianId vendría de la sesión
    const technicianId = req.body.technicianId || 2; // ID del técnico de ejemplo
    
    if (description.length < 20) {
      const issue = await Issue.findByPk(issueId, {
        include: [
          { model: User, as: 'Creator' },
          { model: Department }
        ]
      });
      
      return res.render('actions/create', { 
        issue, 
        error: 'La descripción debe tener al menos 20 caracteres',
        formData: req.body 
      });
    }
    
    await Action.create({
      description,
      issueId,
      technicianId,
      timeSpent: timeSpent || 0,
      date: new Date()
    });
    
    // Actualizar estado de la incidencia si está abierta
    const issue = await Issue.findByPk(issueId);
    if (issue && issue.status === 'open') {
      issue.status = 'in_progress';
      await issue.save();
    }
    
    res.redirect(`/issues/${issueId}/close`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear la actuación');
  }
});

module.exports = router;