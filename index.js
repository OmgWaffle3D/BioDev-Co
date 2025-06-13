// Cargar variables de entorno desde el archivo .env
import "dotenv/config";
// Importar Express para crear el servidor web
import express from "express";
// Importar las rutas definidas en el archivo de rutas
import indexRoutes from "./api/routes/index.routes.js";
// Importar función para convertir URLs de archivo a rutas del sistema
import { fileURLToPath } from "url";
// Importar módulo path para manejar rutas de archivos
import path from "path";
// Importar CORS para permitir solicitudes desde diferentes orígenes
import cors from "cors";

// Obtener la ruta del archivo actual (necesario en módulos ES)
const __filename = fileURLToPath(import.meta.url);
// Obtener el directorio del archivo actual
const __dirname = path.dirname(__filename);

// Crear una instancia de la aplicación Express
const app = express();
// Habilitar CORS para todas las solicitudes
app.use(cors());
// Permitir que la aplicación procese datos JSON en solicitudes entrantes
app.use(express.json());
// Servir archivos estáticos desde la carpeta "public"
app.use(express.static("public"));
// Configurar una ruta específica para acceder a archivos subidos
app.use("/api/uploads", express.static(path.join(__dirname, "api/uploads")));
// Utilizar las rutas de la API definidas en indexRoutes
app.use("/api", indexRoutes);

// Definir el puerto en el que se ejecutará el servidor
const port = 4000;
// Iniciar el servidor y mostrar un mensaje en la consola
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));