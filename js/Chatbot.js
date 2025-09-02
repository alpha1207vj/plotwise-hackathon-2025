// ================================
// Constants & Selectors
// ================================

// API key for Gemini AI service
const GEMINI_API_KEY = 'AIzaSyCo-z0VkQy8l203AvewO5p-U20zQqpAoW4';

// URL for Gemini AI API, dynamically inserting API key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

// DOM elements for the chat interface
const floatingCloseBtn = document.querySelector('.floating-close-btn'); // button to open chat on mobile
const chatScreen = document.querySelector('.chat-screen'); // main chat container
const closeChatBtn = document.querySelector('.close-chat-btn'); // button to close chat
const chatContainer = document.querySelector('.message-container'); // where messages appear
const sendMessage = document.querySelector('.upload-btn'); // send button (paper plane)
const messageForm = document.querySelector('.message-input'); // footer input container
const inputMessage = document.querySelector('.message-area'); // textarea for user input
const uploadBtn = document.querySelector('.fa-paper-plane'); // icon inside send button

// ================================
// Gemini API Call
// ================================

/**
 * Calls the Gemini AI API with the user's message and returns AI-generated text.
 * @param {string} userMessage - The user's message input.
 * @returns {Promise<string>} - AI response text.
 */
async function callGemini(userMessage) {
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { parts: [{ text: userMessage }] } // structure required by Gemini API
                ]
            })
        });

        const data = await response.json();
        // Extract the AI-generated text from API response
        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error("Error:", error);
        return "Sorry, I'm having trouble responding right now.";
    }
}

// ================================
// UI Helper Functions
// ================================

/**
 * Adds the user's message to the chat container.
 * @param {string} text - User message.
 */
function addUserQuestion(text) {
    let message = document.createElement('p');
    message.className = 'user-question'; // styling for user's messages
    message.textContent = text;
    chatContainer.appendChild(message);
}

/**
 * Adds AI-generated message to the chat container with a typing effect.
 * @param {string} text - AI response.
 */
function addAIMessage(text) {
    let message = document.createElement('p');
    message.className = 'bot-answer'; // styling for AI messages
    message.textContent = '';
    chatContainer.appendChild(message);

    let i = 0;
    // Simulate typing effect by adding one character at a time
    const interval = setInterval(() => {
        if (i < text.length) {
            message.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
            inputMessage.disabled = false; // re-enable input after AI finishes
        }
    }, 30); // 30ms per character
}

/**
 * Displays a temporary loading indicator while waiting for AI response.
 */
function loader() {
    let messageLoader = document.createElement('div');
    messageLoader.className = 'loader';
    chatContainer.appendChild(messageLoader);

    setTimeout(() => {
        if (messageLoader && messageLoader.parentNode) {
            chatContainer.removeChild(messageLoader); // remove loader after 1.5 seconds
        }
    }, 1500);
}

/**
 * Handles sending a message: adds user message, shows loader, calls AI, and displays response.
 */
async function addMessage() {
    if (inputMessage.value && inputMessage.value.trim() !== '') {
        const userText = inputMessage.value.trim();
        inputMessage.value = ''; // clear textarea after sending
        addUserQuestion(userText);
        loader(); // show temporary loader
        inputMessage.disabled = true; // prevent typing until AI responds

        const aiResponse = await callGemini(userText);
        setTimeout(() => {
            addAIMessage(aiResponse); // show AI message with typing effect
        }, 1000); // slight delay for realism
    }
}

// ================================
// Input & Button Behavior
// ================================

// Change send button color dynamically based on whether user has typed text
inputMessage.addEventListener('input', () => {
    if (inputMessage.value.length > 0) {
        uploadBtn.style.color = 'rgb(24,73,214)'; // active color
    } else {
        uploadBtn.style.color = 'rgb(173, 168, 168)'; // inactive color
    }
});

// Keep send button color consistent when input loses focus
inputMessage.addEventListener('blur', () => {
    if (inputMessage.value.length > 0) {
        uploadBtn.style.color = 'rgb(24,73,214)';
    } else {
        uploadBtn.style.color = 'rgb(173, 168, 168)';
    }
});

// Send message when clicking the send button
sendMessage.addEventListener('click', () => {
    addMessage();
});

// Send message on Enter key (without Shift)
inputMessage.addEventListener('keydown', (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // prevent line break
        addMessage();
    }
});

// ================================
// Mobile / Chat Toggle
// ================================

/**
 * Opens chat on mobile and hides floating button.
 */
function mobileOpenChat() {
    floatingCloseBtn.classList.add('hide-toggle');
    chatScreen.classList.remove('hide-toggle');
}

/**
 * Closes chat on mobile and shows floating button.
 */
function mobileCloseChat() {
    floatingCloseBtn.classList.remove('hide-toggle');
    chatScreen.classList.add('hide-toggle');
}

// Mobile vs desktop behavior
if (window.innerWidth <= 480) {
    // On small screens, use mobile open/close functions
    floatingCloseBtn.addEventListener('click', mobileOpenChat);
    closeChatBtn.addEventListener('click', mobileCloseChat);
} else {
    // On desktop, remove mobile-specific events
    floatingCloseBtn.removeEventListener('click', mobileOpenChat);
    closeChatBtn.removeEventListener('click', mobileCloseChat);

    // On desktop, toggle chat visibility with floating button
    floatingCloseBtn.addEventListener('click', () => {
        chatScreen.classList.toggle('hide-toggle');
    });
}

// ================================
// Emoji Picker
// ================================

// Toggle emoji picker visibility
document.querySelector('.emoji-picker').addEventListener('click', () => {
    document.querySelector('em-emoji-picker').classList.toggle('show-emoji-picker');
});

// Initialize EmojiMart picker
const picker = new EmojiMart.Picker({
    theme: "dark",
    skinTonePosition: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
        const { selectionStart: start, selectionEnd: end } = inputMessage;
        inputMessage.setRangeText(emoji.native, start, end, "end"); // insert emoji at cursor
        inputMessage.focus(); // keep focus on textarea
    }
});

// Append picker to the chat input form
messageForm.appendChild(picker);
