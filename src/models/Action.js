// src/models/Action.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Action = sequelize.define('Action', {
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  technicianId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  issueId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timeSpent: {
    type: DataTypes.INTEGER, // minutos
    allowNull: true,
  }
});

module.exports = Action;