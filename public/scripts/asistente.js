const chatHistory = document.getElementById("chat-history");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const uploadButton = document.querySelector(".upload-btn");

// Create hidden file input
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.style.display = "none";
fileInput.accept = ".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.csv,.xlsx,.xls";
document.body.appendChild(fileInput);

// Session storage key for chat history
const CHAT_HISTORY_KEY = "chatHistory";

// Load chat history when page loads
document.addEventListener("DOMContentLoaded", loadChatHistory);

sendButton?.addEventListener("click", sendMessage);
uploadButton?.addEventListener("click", () => fileInput.click());
fileInput?.addEventListener("change", handleFileUpload);

userInput?.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

// Controla el botón de soporte
document.addEventListener('DOMContentLoaded', function () {
    const btnSoporte = document.getElementById('btn-soporte');

    btnSoporte?.addEventListener('click', () => {
        window.location.href = '../pages/soporte.html';
    });
});

async function sendMessage() {
    const userMessage = userInput.value;
    if (!userMessage) return;

    displayMessage(userMessage, "user");
    userInput.value = "";

    try {
        const aiResponse = await getChatCompletion(userMessage);
        displayMessage(aiResponse, "ai");
    } catch (error) {
        console.error("Error:", error);
        displayMessage("Sorry, I encountered an error.", "ai");
    }
}

function displayMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(`${sender}-message`);
    messageDiv.textContent = message;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    // Save message to session storage
    saveChatHistory(message, sender);
}

// Function to save chat history to session storage
function saveChatHistory(message, sender) {
    try {
        const history = JSON.parse(sessionStorage.getItem(CHAT_HISTORY_KEY)) || [];
        history.push({
            message: message,
            sender: sender,
            timestamp: new Date().toISOString()
        });
        sessionStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error("Error saving chat history:", error);
    }
}

// Function to load chat history from session storage
function loadChatHistory() {
    try {
        const history = JSON.parse(sessionStorage.getItem(CHAT_HISTORY_KEY)) || [];
        history.forEach(entry => {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add(`${entry.sender}-message`);
            messageDiv.textContent = entry.message;
            chatHistory.appendChild(messageDiv);
        });
        if (history.length > 0) {
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    } catch (error) {
        console.error("Error loading chat history:", error);
    }
}

// Function to clear chat history (optional - you can add a button for this)
function clearChatHistory() {
    sessionStorage.removeItem(CHAT_HISTORY_KEY);
    chatHistory.innerHTML = "";
}

async function getChatCompletion(message) {
    const API_ENDPOINT = "/api/chat/completions";

    const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
    };

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No estás autenticado');
    }

    const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        alert("El archivo es demasiado grande. Máximo 5MB permitido.");
        return;
    }

    try {
        // Show loading message
        displayMessage(`📎 Subiendo archivo: ${file.name}...`, "user");
        
        const result = await uploadFile(file);
        
        // Show success message
        displayMessage(`✅ Archivo "${result.originalName}" subido exitosamente`, "ai");
        
        // Clear the file input
        fileInput.value = "";
        
    } catch (error) {
        console.error("Error uploading file:", error);
        displayMessage("❌ Error al subir el archivo: " + error.message, "ai");
    }
}

async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No estás autenticado');
    }

    const response = await fetch("/api/chat/upload", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}