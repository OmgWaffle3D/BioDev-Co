# Documentación del Backend - BioDev-Co / Mawi

Esta documentación proporciona una visión general del backend de la plataforma Mawi, un sistema de biomonitorización que permite a los EcoRangers y administradores gestionar datos biológicos, usuarios y otros recursos relacionados con la biodiversidad.

## Índice

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Configuración del Servidor](#configuración-del-servidor)
3. [Base de Datos](#base-de-datos)
4. [API Endpoints](#api-endpoints)
5. [Middlewares](#middlewares)
6. [Controladores](#controladores)
7. [Autenticación y Seguridad](#autenticación-y-seguridad)
8. [Manejo de Archivos](#manejo-de-archivos)
9. [Integración con IA](#integración-con-ia)
10. [Requisitos y Dependencias](#requisitos-y-dependencias)
11. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)

## Estructura del Proyecto

El backend está organizado en una estructura de carpetas que sigue el patrón MVC (Modelo-Vista-Controlador) adaptado para una API REST:

```
BioDev-Co/
├── api/
│   ├── controllers/     # Controladores para manejar la lógica de negocio
│   ├── db/              # Configuración de la base de datos
│   ├── middleware/      # Middlewares para procesar peticiones
│   ├── routes/          # Definición de rutas de la API
│   ├── uploads/         # Carpeta para archivos subidos por usuarios
│   └── utils/           # Utilidades y funciones auxiliares
├── public/              # Archivos estáticos servidos directamente
├── .env                 # Variables de entorno (no incluido en el repo)
├── index.js             # Punto de entrada de la aplicación
├── ca.pem               # Certificado para conexión segura a DB
└── package.json         # Dependencias y scripts
```

## Configuración del Servidor

El servidor está implementado utilizando Express.js, un framework web para Node.js. La configuración principal se encuentra en el archivo `index.js`:

```javascript
// Configuración básica del servidor Express
const app = express();

// Configuración de CORS para permitir peticiones desde dominios específicos
app.use(
  cors({
    // Configuración flexible que permite localhost y dominios de producción
  })
);

// Procesamiento de datos JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Acceso a archivos subidos
app.use("/api/uploads", express.static(path.join(__dirname, "api/uploads")));

// Rutas de la API
app.use("/api", indexRoutes);

// Puerto del servidor (definido en variables de entorno o 4000 por defecto)
const port = process.env.PORT || 4000;
```

## Base de Datos

La aplicación utiliza MySQL como sistema de gestión de base de datos. La conexión se configura en el archivo `api/db/db.js` utilizando el módulo `mysql2`. Se establece una conexión segura utilizando SSL:

```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem"),
  },
});
```

El sistema utiliza un pool de conexiones para gestionar eficientemente las consultas a la base de datos.

### Principales tablas de la base de datos:

- **usuarios**: Almacena información de los usuarios registrados
- **registros**: Contiene los registros de biomonitorización
- **biomas**: Información sobre los diferentes biomas disponibles
- **anteproyectos**: Almacena los anteproyectos enviados por los usuarios
- **convocatorias**: Contiene información sobre las convocatorias disponibles
- **niveles_completados**: Almacena el progreso de los usuarios en el componente de gamificación

## API Endpoints

La API está organizada en grupos de rutas según su función y nivel de acceso:

### Rutas Públicas

- **POST /api/login**: Autenticación de usuarios
- **POST /api/register**: Registro de nuevos usuarios

### Rutas Protegidas (requieren token)

- **POST /api/records**: Crear un nuevo registro de biomonitorización
- **GET /api/biomas**: Obtener listado de biomas disponibles
- **POST /api/chat/completions**: Obtener respuestas del asistente IA
- **POST /api/chat/upload**: Subir archivos para procesamiento con IA
- **GET /api/convocatorias**: Obtener listado de convocatorias
- **POST /api/convocatorias**: Crear una nueva convocatoria
- **GET /api/anteproyectosuser**: Obtener anteproyectos del usuario actual
- **POST /api/anteproyectos**: Crear un nuevo anteproyecto

### Rutas Protegidas para Administradores

- **GET /api/registros**: Obtener todos los registros
- **GET /api/usuarios**: Obtener todos los usuarios
- **GET /api/anteproyectos**: Obtener todos los anteproyectos
- **GET /api/ecorangers**: Obtener listado de EcoRangers
- **POST /api/biomas**: Crear un nuevo bioma
- **GET /api/usuarios/pendientes**: Obtener usuarios con estado pendiente
- **POST /api/usuarios/estado**: Actualizar el estado de un usuario
- **PUT /api/usuarios/:id**: Actualizar información de un usuario
- **DELETE /api/usuarios/:id**: Eliminar un usuario

### Rutas de Gamificación

- **GET /api/game/users/:id**: Obtener información de usuario y nivel
- **PUT /api/game/users/:id**: Actualizar nivel de un usuario

## Middlewares

El sistema utiliza varios middlewares para procesar peticiones antes de llegar a los controladores:

### verificarToken

Valida el token JWT (JSON Web Token) proporcionado en los encabezados de las peticiones:

```javascript
export const verificarToken = (req, res, next) => {
  // Extrae y verifica el token
  // Si es válido, agrega id y rol del usuario al objeto req
  // Si no es válido, devuelve error 401
};
```

### verificarAdmin

Restringe el acceso a rutas que requieren privilegios de administrador:

```javascript
export const verificarAdmin = (req, res, next) => {
  // Comprueba si el usuario tiene rol 'admin'
  // Si no, devuelve error 403
};
```

### multerConfig

Configura el manejo de archivos subidos utilizando multer:

- **upload**: Configurado para imágenes de perfil y registros
- **chatUpload**: Configuración más flexible para archivos enviados al chat

## Controladores

Los controladores implementan la lógica de negocio de la aplicación y están organizados por funcionalidad:

### user.controllers.js

Gestiona todas las operaciones relacionadas con usuarios:

- Registro y autenticación
- Gestión de perfiles
- Aprobación/rechazo de usuarios
- Manejo de registros, biomas, anteproyectos y convocatorias

### chat.controllers.js

Implementa la integración con servicios de IA:

- Procesa mensajes y obtiene respuestas del modelo de lenguaje
- Maneja la subida de archivos para su análisis con IA

### game.controllers.js

Gestiona la funcionalidad de gamificación:

- Obtiene información de usuarios y sus niveles
- Actualiza niveles completados

## Autenticación y Seguridad

El sistema utiliza JSON Web Tokens (JWT) para la autenticación y autorización:

1. **Generación de Token**: Al iniciar sesión correctamente, se genera un token con la información del usuario
2. **Verificación de Token**: El middleware `verificarToken` valida cada petición a rutas protegidas
3. **Control de Acceso**: El middleware `verificarAdmin` restringe el acceso basado en roles

Las contraseñas se almacenan de forma segura utilizando hashing con bcrypt.

## Manejo de Archivos

El sistema permite subir diferentes tipos de archivos:

- **Fotos de perfil**: Imágenes de usuario almacenadas en `/api/uploads/`
- **Imágenes de registros**: Archivos relacionados con registros de biomonitorización
- **Archivos para IA**: Documentos y archivos que se procesan con el asistente IA

La configuración de multer establece límites de tamaño y tipos de archivo permitidos.

## Integración con IA

El backend se integra con un servicio externo de IA para proporcionar asistencia mediante chat:

```javascript
export const getChatCompletion = async (req, res) => {
  // Envía los mensajes al servicio de IA
  // Procesa y devuelve la respuesta
};
```

La API se conecta a un endpoint externo que proporciona el modelo de lenguaje.

## Requisitos y Dependencias

El proyecto requiere:

- **Node.js**: v14 o superior
- **MySQL**: v8 o superior

Principales dependencias:

- **express**: Framework web para Node.js
- **mysql2**: Cliente MySQL para Node.js con soporte para promesas
- **jsonwebtoken**: Implementación de JWT para autenticación
- **bcryptjs**: Biblioteca para hashing de contraseñas
- **multer**: Middleware para manejo de archivos multipart/form-data
- **cors**: Middleware para habilitar CORS
- **axios**: Cliente HTTP para realizar peticiones a servicios externos
- **dotenv**: Para cargar variables de entorno

## Configuración de Variables de Entorno

La aplicación requiere un archivo `.env` con las siguientes variables:

```
# Configuración del servidor
PORT=4000
FRONTEND_URL=http://localhost:5500

# Configuración de la base de datos
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PORT=3306
DB_PASSWORD=your-db-password
DB_DATABASE=your-db-name

# Seguridad
JWT_SECRET=your-jwt-secret-key

# API externas
API_KEY=your-ai-service-api-key
```

---

Esta documentación proporciona una visión general del backend de la plataforma Mawi. Para más detalles sobre implementaciones específicas, consulte los archivos de código fuente correspondientes.

Última actualización: Junio 2025
