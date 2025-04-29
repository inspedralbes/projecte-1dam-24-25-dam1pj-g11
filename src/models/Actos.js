// src/models/Acto.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Incidencia = require('./Incidencia');

const Acto = sequelize.define('Acto', {
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  responsable: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

// Establecer la relación con Incidencia
Acto.belongsTo(Incidencia);
Incidencia.hasMany(Acto, { 
  onDelete: 'CASCADE',
  hooks: true
});

module.exports = Acto;