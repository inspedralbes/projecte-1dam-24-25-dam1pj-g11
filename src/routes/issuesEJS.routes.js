// src/routes/issuesEJS.routes.js
const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const User = require('../models/User');
const Department = require('../models/Department');
const Action = require('../models/Action');

// Listar incidencias (admin)
router.get('/', async (req, res) => {
  try {
    // Obtener solo incidencias abiertas, ordenadas por prioridad
    const issues = await Issue.findAll({ 
      where: { status: ['open', 'in_progress'] },
      include: [
        { model: Department },
        { model: User, as: 'Creator' },
        { model: User, as: 'Assignee' }
      ],
      order: [
        // Orden personalizado por prioridad (urgent > high > medium > low)
        [sequelize.literal(`CASE 
          WHEN priority = 'urgent' THEN 1 
          WHEN priority = 'high' THEN 2 
          WHEN priority = 'medium' THEN 3 
          WHEN priority = 'low' THEN 4 
          ELSE 5 END`), 'ASC']
      ]
    });
    res.render('issues/list', { issues });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al recuperar las incidencias');
  }
});

// Formulario para crear incidencia (profesor)
router.get('/create', async (req, res) => {
  try {
    const departments = await Department.findAll();
    const types = Issue.rawAttributes.type.values;
    res.render('issues/create', { departments, types });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el formulario');
  }
});

// Crear incidencia (POST - profesor)
router.post('/create', async (req, res) => {
  try {
    const { title, description, type, departmentId } = req.body;
    
    // En producción, el userId se obtendría de la sesión
    const userId = req.body.userId || 3; // Usuario profesor de ejemplo
    
    const newIssue = await Issue.create({ 
      title, 
      description, 
      type, 
      departmentId,
      createdBy: userId,
      status: 'open',
      priority: 'medium' // Prioridad por defecto, luego la asigna el admin
    });
    
    // Redirigir a la página de confirmación con el ID
    res.render('issues/created', { issueId: newIssue.id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear la incidencia');
  }
});

// Ver formulario para editar incidencia (admin)
router.get('/:id/edit', async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.id);
    if (!issue) return res.status(404).send('Incidencia no encontrada');
    
    const technicians = await User.findAll({ where: { role: 'technician' } });
    const priorities = Issue.rawAttributes.priority.values;
    const types = Issue.rawAttributes.type.values;
    
    res.render('issues/edit', { issue, technicians, priorities, types });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el formulario de edición');
  }
});

// Actualizar incidencia (admin)
router.post('/:id/update', async (req, res) => {
  try {
    const { priority, type, assignedTo } = req.body;
    const issue = await Issue.findByPk(req.params.id);
    
    if (!issue) return res.status(404).send('Incidencia no encontrada');
    
    issue.priority = priority;
    issue.type = type;
    issue.assignedTo = assignedTo;
    
    if (assignedTo && issue.status === 'open') {
      issue.status = 'in_progress';
    }
    
    await issue.save();
    res.redirect('/issues');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar la incidencia');
  }
});

// Ver incidencia para cerrarla (técnico)
router.get('/:id/close', async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.id, {
      include: [
        { model: Department },
        { model: User, as: 'Creator' },
        { model: User, as: 'Assignee' },
        { model: Action }
      ]
    });
    
    if (!issue) return res.status(404).send('Incidencia no encontrada');
    
    res.render('issues/close', { issue });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la incidencia');
  }
});

// Cerrar incidencia (técnico)
router.post('/:id/close', async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.id);
    
    if (!issue) return res.status(404).send('Incidencia no encontrada');
    
    issue.status = 'closed';
    issue.closingDate = new Date();
    
    await issue.save();
    res.redirect('/issues');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cerrar la incidencia');
  }
});

// Formulario para buscar incidencia (seguimiento profesor)
router.get('/track', (req, res) => {
  res.render('issues/track', { issue: null, error: null });
});

// Ver incidencia (seguimiento profesor)
router.post('/track', async (req, res) => {
  try {
    const { issueId } = req.body;
    
    const issue = await Issue.findByPk(issueId, {
      include: [
        { model: Department },
        { model: User, as: 'Creator' },
        { model: User, as: 'Assignee' },
        { 
          model: Action,
          include: [{ model: User, as: 'Technician' }]
        }
      ]
    });
    
    if (!issue) {
      return res.render('issues/track', { 
        issue: null, 
        error: 'Incidencia no encontrada' 
      });
    }
    
    res.render('issues/track', { issue, error: null });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al buscar la incidencia');
  }
});

module.exports = router;