FROM node:16
WORKDIR /app
# Copiar package.json y package-lock.json
COPY package*.json ./
# Instalar dependencias
RUN npm install
# Copiar el resto de la aplicación
COPY . .
# Exponer el puerto
EXPOSE 3000
# Comando para iniciar la aplicación
CMD ["node", "src/app.js"]