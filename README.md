# Óptica Francesca - Sistema Integral

Aplicación web desarrollada con el stack MERN adaptado (React + Express + MongoDB) para la gestión de turnos de Óptica Francesca. Diseñada para enfocarse en la fluidez de interfaz, performance, estampa de marca y automatización de procesos internos.

## 🚀 Características
- Landing page hiper-optimizada con Tailwind CSS
- Sistema de selección de turnos sincronizado dinámicamente
- Base de Datos persistente en MongoDB (Prevención de sobre-suscripciones a horarios ocupados)
- Panel de Administrador Integrado seguro mediante autenticación de variables de entorno
- Modales personalizados y control dinámico de validaciones pasadas.

## 📱 Tecnologías
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, React Router.
- **Backend:** Node.js, Express, Mongoose, Dotenv.
- **Base de Datos:** MongoDB Atlas.

## 🛠️ Instalación y Uso (Desarrollador)
1. Ejecutar `npm install`
2. Configurar en tu archivo `.env` el respectivo `MONGODB_URI` y el `ADMIN_PASSWORD`
3. Encender Front-End: `npm run dev`
4. Encender Back-End: `npm run server`
