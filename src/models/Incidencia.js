// src/models/Incidencia.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Incidencia = sequelize.define('Incidencia', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  estado: {
    type: DataTypes.ENUM('abierta', 'en_proceso', 'resuelta', 'cerrada'),
    allowNull: false,
    defaultValue: 'abierta'
  },
  prioridad: {
    type: DataTypes.ENUM('baja', 'media', 'alta', 'critica'),
    allowNull: false,
    defaultValue: 'media'
  },
  tipo: {
    type: DataTypes.ENUM('hardware', 'software', 'red', 'otros'),
    allowNull: false,
    defaultValue: 'otros'
  },
  tecnico: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = Incidencia;