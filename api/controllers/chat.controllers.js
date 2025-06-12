// Importa axios para realizar peticiones HTTP y path para manejar rutas de archivos
import axios from "axios";
import path from "path";

// URL del servicio de IA para obtener respuestas del chat
const API_ENDPOINT = "http://10.14.255.61/v1/chat/completions";
// Clave de API almacenada en variables de entorno por seguridad
const API_KEY = process.env.API_KEY;

// Controlador para obtener respuestas del modelo de IA
export const getChatCompletion = async (req, res) => {
    try {
        // Extrae el modelo y los mensajes de la solicitud
        const { model, messages } = req.body;
        
        // Realiza petición al servicio de IA
        const response = await axios.post(API_ENDPOINT, {
            model: model || "gpt-3.5-turbo", // Usa modelo especificado o GPT-3.5 por defecto
            messages: messages // Array de mensajes del chat
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}` // Incluye la clave de API para autenticación
            }
        });
        
        // Devuelve los datos de respuesta del modelo al cliente
        res.json(response.data);
    } catch (error) {
        // Registra el error en la consola para depuración
        console.error("Error connecting to LLM:", error.message);
        // Envía respuesta de error al cliente
        res.status(500).json({ 
            error: "Failed to get response from AI", 
            details: error.message 
        });
    }
};

// Controlador para manejar la subida de archivos relacionados con el chat
export const uploadChatFile = async (req, res) => {
    try {
        // Verificar que se subió un archivo (lo procesa multer antes de llegar aquí)
        if (!req.file) {
            return res.status(400).json({ 
                error: "No file uploaded" 
            });
        }

        // Responder con información del archivo subido
        res.status(200).json({
            success: true,
            message: "Archivo subido exitosamente",
            filename: req.file.filename, // Nombre generado por multer
            originalName: req.file.originalname // Nombre original del archivo
        });

    } catch (error) {
        // Registra el error en la consola para depuración
        console.error("Error uploading file:", error.message);
        // Envía respuesta de error al cliente
        res.status(500).json({ 
            error: "Failed to upload file", 
            details: error.message 
        });
    }
};
