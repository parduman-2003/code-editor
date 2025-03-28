// Built-in functions details (Array, String)
const builtInFunctions = {
    array: {
        keywords: ["array", "arrays", "all"],
        description: "JavaScript Array methods let you manipulate arrays effectively.",
        methods: {
            push: "Adds one or more elements to the end of an array. Example:\n\nlet arr = [1, 2];\narr.push(3); // [1, 2, 3]",
            pop: "Removes the last element from an array. Example:\n\nlet arr = [1, 2, 3];\narr.pop(); // [1, 2]",
            sort: "Sorts the elements of an array in place. Example:\n\nlet arr = [3, 1, 2];\narr.sort(); // [1, 2, 3]",
            concat: "Merges two or more arrays into one. Example:\n\nlet arr1 = [1];\nlet arr2 = [2, 3];\narr1.concat(arr2); // [1, 2, 3]",
            splice: "Adds/removes elements at a specified index. Example:\n\nlet arr = [1, 2, 3];\narr.splice(1, 1); // [1, 3]"
        }
    },
    string: {
        keywords: ["string", "strings", "all"],
        description: "JavaScript String methods allow you to manipulate and inspect strings.",
        methods: {
            split: "Splits a string into an array of substrings. Example:\n\nlet str = 'a,b,c';\nstr.split(','); // ['a', 'b', 'c']",
            slice: "Extracts a section of a string and returns it as a new string. Example:\n\nlet str = 'hello';\nstr.slice(1, 3); // 'el'",
            toUpperCase: "Converts a string to uppercase. Example:\n\nlet str = 'hello';\nstr.toUpperCase(); // 'HELLO'",
            toLowerCase: "Converts a string to lowercase. Example:\n\nlet str = 'HELLO';\nstr.toLowerCase(); // 'hello'",
            replace: "Replaces a specified value with another value in a string. Example:\n\nlet str = 'hello world';\nstr.replace('world', 'JavaScript'); // 'hello JavaScript'"
        }
    }
};

// Function to handle built-in functions
function getBuiltInFunctionDetails(userInput) {
    userInput = correctSpelling(userInput).toLowerCase();

    // Iterate through categories (array, string, etc.)
    for (const [key, value] of Object.entries(builtInFunctions)) {
        if (value.keywords.some(keyword => userInput.includes(keyword))) {
            // Check if a specific method is mentioned
            for (const [method, description] of Object.entries(value.methods)) {
                if (userInput.includes(method)) {
                    return `Details for ${method}():\n\n${description}`;
                }
            }
            // If no specific method is mentioned, return all methods
            return `${value.description}\nAvailable Methods:\n- ${Object.keys(value.methods).join(", ")}`;
        }
    }

    return "I couldn't find a matching function. Please specify if you're asking about Array, String, or Number methods.";
}

// Function to correct common spelling errors
function correctSpelling(input) {
    const corrections = {
        bult: "built",
        functon: "function",
        aray: "array",
        strng: "string",
        arrayy: "array"
    };

    const words = input.split(" ");
    const correctedWords = words.map(word => corrections[word] || word);
    return correctedWords.join(" ");
}

// Flexible Function Creation
function createFunction(userInput) {
    // Correct spelling errors for flexible input handling
    userInput = correctSpelling(userInput).toLowerCase();

    // Check if "create" and "function" exist in the input
    if (userInput.includes("create") && userInput.includes("function")) {
        // Attempt to find the function name after specific keywords
        const possibleName = userInput.match(/name (\w+)/i) || userInput.match(/function (\w+)/i);
        if (possibleName) {
            const functionName = possibleName[1]; // Extract the function name
            return `Here's your function:\n\nfunction ${functionName}() {\n    // Add your logic here\n}\n`;
        } else {
            return "It seems you want to create a function, but I couldn't find a valid name. Please provide a name.";
        }
    }
    return null; // No valid "create function" request found
}

// Greeting rules
const rules = [
    { keywords: ["hello", "hi", "hlo"], response: "Hi there! How can I help you?" },
    { keywords: ["how are you", "how r u", "hw are you"], response: "I'm just a bot, but I'm doing great! How about you?" },
    { keywords: ["bye", "goodbye", "see you"], response: "Goodbye! Have a great day!" },
    { keywords: ["help", "assist", "support"], response: "Sure, let me know what you need help with." },
    { keywords: ["your name", "who are you", "what is your name"], response: "I'm ChatBot, your virtual assistant!" }
];

// Default response
const defaultResponse = "I'm not sure how to respond to that. Can you try asking something else?";

// Function to find the best response based on keywords
function getBotResponse(userInput) {
    userInput = userInput.toLowerCase();
    
    // Start by checking for function creation requests
    const createFunctionResponse = createFunction(userInput);
    if (createFunctionResponse) {
        return createFunctionResponse;
    }
    // After that, check for rule-based responses
    for (let rule of rules) {
        if (rule.keywords.some(keyword => userInput.includes(keyword))) {
            return rule.response;
        }
    }

    // Then check for built-in function queries
    const builtInResponse = getBuiltInFunctionDetails(userInput);
    if (builtInResponse) {
        return builtInResponse;
    }
    // If no match, return the default response
    return defaultResponse;
}


// Chat UI - HTML Elements
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");

// Function to add messages to the chat
function addMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", sender === "bot" ? "bot-message" : "user-message");
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}

// Handle user input and display response
function handleUserInput() {
    const input = userInput.value.trim();
    if (input) {
        addMessage(input, "user");
        const response = getBotResponse(input);
        setTimeout(() => addMessage(response, "bot"), 500); // Simulate bot typing delay
        userInput.value = ""; // Clear input field
    }
}

// Event listeners for user input
sendButton.addEventListener("click", handleUserInput);
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") handleUserInput();
});
