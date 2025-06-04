# Mawi - Plataforma de Biomonitorización

Mawi es una plataforma web diseñada para asistir en el monitoreo y análisis de datos biológicos, permitiendo a los EcoRangers registrar y analizar información sobre biodiversidad y ecosistemas.

## 🌟 Características

- Sistema de autenticación para usuarios y EcoRangers
- Panel de control intuitivo con múltiples asistentes
- Gestión de biomonitorización
- Sistema de convocatorias y anteproyectos
- Interfaz adaptativa y moderna
- Chat integrado con asistente IA

## 🚀 Tecnologías Utilizadas

- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js, Express
- Base de datos: MySQL
- Integración con IA para asistencia
- Autenticación: JWT

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v8 o superior)
- npm o yarn

## 🛠️ Instalación

1. Clonar el repositorio:

```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

   - Crear archivo `.env` basado en `.env.example`
   - Configurar credenciales de base de datos y API keys

4. Iniciar el servidor:

```bash
npm start
```

## 🎨 Guía de Estilos

### Paleta de Colores

| Color          | Hex     | Uso                           |
| -------------- | ------- | ----------------------------- |
| Verde oscuro   | #2F4D38 | Texto principal, encabezados  |
| Verde claro    | #7DAE5B | Botones y acentos             |
| Naranja tierra | #C7692B | Iconos y elementos destacados |
| Beige claro    | #F5EEDC | Fondos y secciones suaves     |
| Gris claro     | #DAD4C2 | Contenedores y separadores    |

## 📁 Estructura del Proyecto

```
├── api/                  # Backend API
│   ├── controllers/     # Controladores de la aplicación
│   ├── db/             # Configuración de base de datos
│   ├── middleware/     # Middlewares
│   ├── routes/        # Rutas de la API
│   └── service/       # Servicios
├── public/             # Frontend
│   ├── imagenes/      # Recursos estáticos
│   ├── pages/         # Páginas HTML
│   ├── scripts/       # JavaScript del cliente
│   └── styles/        # Hojas de estilo CSS
└── index.js           # Punto de entrada de la aplicación
```

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit de cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Crear Pull Request
