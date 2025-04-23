// src/routes/reportsEJS.routes.js
const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const Issue = require('../models/Issue');
const User = require('../models/User');
const Department = require('../models/Department');
const Action = require('../models/Action');

// Informe de técnicos
router.get('/technicians', async (req, res) => {
  try {
    // Obtener todos los técnicos
    const technicians = await User.findAll({
      where: { role: 'technician' },
      include: [
        {
          model: Action,
          attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('Actions.id')), 'totalActions'],
            [Sequelize.fn('SUM', Sequelize.col('Actions.timeSpent')), 'totalTimeSpent']
          ]
        },
        {
          model: Issue,
          as: 'AssignedIssues',
          attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('AssignedIssues.id')), 'totalIssues'],
            [Sequelize.literal(`SUM(CASE WHEN AssignedIssues.status = 'closed' THEN 1 ELSE 0 END)`), 'resolvedIssues']
          ]
        }
      ],
      group: ['User.id']
    });

    res.render('reports/technicians', { technicians });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al generar el informe de técnicos');
  }
});

// Informe de departamentos
router.get('/departments', async (req, res) => {
  try {
    // Obtener estadísticas por departamento
    const departments = await Department.findAll({
      include: [
        {
          model: Issue,
          attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('Issues.id')), 'totalIssues'],
            [Sequelize.literal(`SUM(CASE WHEN Issues.status = 'closed' THEN 1 ELSE 0 END)`), 'resolvedIssues'],
            [Sequelize.literal(`SUM(CASE WHEN Issues.priority = 'urgent' THEN 1 ELSE 0 END)`), 'urgentIssues'],
            [Sequelize.literal(`SUM(CASE WHEN Issues.priority = 'high' THEN 1 ELSE 0 END)`), 'highIssues']
          ]
        }
      ],
      group: ['Department.id']
    });

    res.render('reports/departments', { departments });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al generar el informe de departamentos');
  }
});

module.exports = router;