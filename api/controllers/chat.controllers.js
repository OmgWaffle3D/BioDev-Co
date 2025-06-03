import axios from "axios";

const API_ENDPOINT = process.env.API_ENDPOINT;
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
