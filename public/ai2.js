document.getElementById('send-btn').addEventListener('click', async () => {
    const userMessage = document.getElementById('user-input').value;
    if (!userMessage) return;

    // Display the user's message in the chatbox
    displayMessage(userMessage, 'user');

    // Send the message to the backend
    const response = await fetch('/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();

    // Display the chatbot's response in the chatbox
    displayMessage(data.reply, 'bot');

    // Clear the input field
    document.getElementById('user-input').value = '';
  });

  function displayMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);

    // Scroll to the bottom of the chatbox
    chatBox.scrollTop = chatBox.scrollHeight;
  }