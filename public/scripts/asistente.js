const chatHistory = document.getElementById("chat-history");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

sendButton?.addEventListener("click", sendMessage);

userInput?.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
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