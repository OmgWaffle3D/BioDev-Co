// Cargar variables de entorno desde el archivo .env
import "dotenv/config";
import express from "express";
import indexRoutes from "./api/routes/index.routes.js";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configurar CORS flexible
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Permitir sin origin (Postman, curl, etc.)

    // Permitir cualquier localhost o 127.0.0.1 en cualquier puerto (para Go Live)
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }

    // Permitir producción (origins permitidos)
    const allowedOrigins = [
      'https://biodev-co-3.onrender.com',
      'https://biodev-co.onrender.com',
      'http://localhost:5500',       // por si quieres forzar localhost:5500 también
      'http://127.0.0.1:5500',       // por si quieres forzar 127.0.0.1:5500 también
      process.env.FRONTEND_URL
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Si no está permitido → error
    return callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true
}));

// Permitir que la aplicación procese datos JSON en solicitudes entrantes
app.use(express.json());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Configurar una ruta específica para acceder a archivos subidos
app.use("/api/uploads", express.static(path.join(__dirname, "api/uploads")));

// Utilizar las rutas de la API definidas en indexRoutes
app.use("/api", indexRoutes);

// Definir el puerto en el que se ejecutará el servidor
const port = process.env.PORT || 4000;

// Iniciar el servidor y mostrar un mensaje en la consola
app.listen(port, () => console.log(`Server running on port ${port}`));