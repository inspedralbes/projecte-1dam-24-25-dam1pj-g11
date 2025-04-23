// src/app.js
const express = require('express');
require('dotenv').config();
const sequelize = require('./db');
const path = require('path');

// Importar modelos
const Issue = require('./models/Issue');
const User = require('./models/User');
const Department = require('./models/Department');
const Action = require('./models/Action');

// Definir relaciones
Department.hasMany(User, { foreignKey: 'departmentId' });
User.belongsTo(Department, { foreignKey: 'departmentId' });

Department.hasMany(Issue, { foreignKey: 'departmentId' });
Issue.belongsTo(Department, { foreignKey: 'departmentId' });

User.hasMany(Issue, { foreignKey: 'createdBy', as: 'CreatedIssues' });
Issue.belongsTo(User, { foreignKey: 'createdBy', as: 'Creator' });

User.hasMany(Issue, { foreignKey: 'assignedTo', as: 'AssignedIssues' });
Issue.belongsTo(User, { foreignKey: 'assignedTo', as: 'Assignee' });

Issue.hasMany(Action, { foreignKey: 'issueId' });
Action.belongsTo(Issue, { foreignKey: 'issueId' });

User.hasMany(Action, { foreignKey: 'technicianId' });
Action.belongsTo(User, { foreignKey: 'technicianId' });

// Importar rutas
const issuesRoutesEJS = require('./routes/issuesEJS.routes');
const usersRoutesEJS = require('./routes/usersEJS.routes');
const actionsRoutesEJS = require('./routes/actionsEJS.routes');
const reportsRoutesEJS = require('./routes/reportsEJS.routes');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/issues', issuesRoutesEJS);
app.use('/users', usersRoutesEJS);
app.use('/actions', actionsRoutesEJS);
app.use('/reports', reportsRoutesEJS);

// Ruta principal
app.get('/', (req, res) => {
  res.render('index');
});

const PORT = process.env.PORT || 3000;

// Iniciar servidor
(async () => {
  try {
    await sequelize.sync({ force: true }); // En producción cambiar a force: false
    console.log('Base de datos sincronizada');

    // Crear datos iniciales
    const deptInformatica = await Department.create({ 
      name: 'Informática', 
      description: 'Departamento de informática y tecnología' 
    });
    
    const deptMath = await Department.create({ 
      name: 'Matemáticas', 
      description: 'Departamento de matemáticas' 
    });

    // Crear usuarios de prueba
    const admin = await User.create({
      username: 'admin',
      password: 'admin123', // En producción usar hash
      fullName: 'Administrador',
      email: 'admin@example.com',
      role: 'admin',
      departmentId: deptInformatica.id
    });

    const technician = await User.create({
      username: 'tecnico',
      password: 'tecnico123', // En producción usar hash
      fullName: 'Técnico Soporte',
      email: 'tecnico@example.com',
      role: 'technician',
      departmentId: deptInformatica.id
    });

    const teacher = await User.create({
      username: 'profesor',
      password: 'profesor123', // En producción usar hash
      fullName: 'Profesor Ejemplo',
      email: 'profesor@example.com',
      role: 'teacher',
      departmentId: deptMath.id
    });

    // Crear incidencias de ejemplo
    const issue1 = await Issue.create({
      title: 'Problema con proyector',
      description: 'El proyector del aula 101 no enciende',
      status: 'open',
      priority: 'high',
      type: 'hardware',
      createdBy: teacher.id,
      departmentId: teacher.departmentId,
      assignedTo: technician.id
    });

    const issue2 = await Issue.create({
      title: 'Software no funciona',
      description: 'El software de matemáticas no se instala correctamente',
      status: 'in_progress',
      priority: 'medium',
      type: 'software',
      createdBy: teacher.id,
      departmentId: teacher.departmentId,
      assignedTo: technician.id
    });

    // Crear actuaciones de ejemplo
    await Action.create({
      description: 'Se revisó el proyector y se verificó que está conectado correctamente',
      technicianId: technician.id,
      issueId: issue1.id,
      timeSpent: 30
    });

    await Action.create({
      description: 'Se intentó reinstalar el software sin éxito. Se contactará al proveedor.',
      technicianId: technician.id,
      issueId: issue2.id,
      timeSpent: 45
    });

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
  }
})();