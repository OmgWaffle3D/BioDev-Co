import axios from "axios";
import path from "path";

const API_ENDPOINT = "http://10.14.255.61/v1/chat/completions";
const API_KEY = process.env.API_KEY;

export const getChatCompletion = async (req, res) => {
    try {
        const { model, messages } = req.body;
        
        const response = await axios.post(API_ENDPOINT, {
            model: model || "gpt-3.5-turbo",
            messages: messages
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error("Error connecting to LLM:", error.message);
        res.status(500).json({ 
            error: "Failed to get response from AI", 
            details: error.message 
        });
    }
};

export const uploadChatFile = async (req, res) => {
    try {
        // Verificar que se subió un archivo
        if (!req.file) {
            return res.status(400).json({ 
                error: "No file uploaded" 
            });
        }

        // Responder con éxito simple
        res.status(200).json({
            success: true,
            message: "Archivo subido exitosamente",
            filename: req.file.filename,
            originalName: req.file.originalname
        });

    } catch (error) {
        console.error("Error uploading file:", error.message);
        res.status(500).json({ 
            error: "Failed to upload file", 
            details: error.message 
        });
    }
};
