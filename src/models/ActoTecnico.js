// src/models/ActoTecnico.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Incidencia = require('./Incidencia');

const ActoTecnico = sequelize.define('ActoTecnico', {
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  tecnico: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

// Relación: Una incidencia puede tener muchos actos técnicos
ActoTecnico.belongsTo(Incidencia, { foreignKey: 'incidenciaId' });
Incidencia.hasMany(ActoTecnico, { foreignKey: 'incidenciaId' });

module.exports = ActoTecnico;