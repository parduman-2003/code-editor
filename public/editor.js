const htmlCode = document.getElementById("html-code");
const cssCode = document.getElementById("css-code");
const jsCode = document.getElementById("js-code");
const resultFrame = document.getElementById("result");
const favoriteBtn = document.getElementById("favorite-btn");

const htmlTab = document.getElementById("html-tab");
const cssTab = document.getElementById("css-tab");
const jsTab = document.getElementById("js-tab");

// Function to update the iframe content for HTML, CSS, and JS
function updateOutput() {
    const htmlContent = htmlCode.value;
    const cssContent = `<style>${cssCode.value}</style>`;
    const jsContent = `<script>${jsCode.value}<\/script>`;
    
    const completeContent = `
        ${cssContent}
        ${htmlContent}
        ${jsContent}
    `;
    resultFrame.srcdoc = completeContent;
}

// Event listeners for tab switching
htmlTab.addEventListener("click", () => {
    switchTab(htmlTab, htmlCode);
});

cssTab.addEventListener("click", () => {
    switchTab(cssTab, cssCode);
});

jsTab.addEventListener("click", () => {
    switchTab(jsTab, jsCode);
});

// Function to switch tabs
function switchTab(activeTab, activeTextarea) {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".code-area").forEach(area => area.classList.add("hidden"));

    activeTab.classList.add("active");
    activeTextarea.classList.remove("hidden");
}

// Update the output dynamically for HTML, CSS, and JS
htmlCode.addEventListener("input", updateOutput);
cssCode.addEventListener("input", updateOutput);
jsCode.addEventListener("input", updateOutput);

// Initial setup
updateOutput();

// Function to handle the favorite button click
favoriteBtn.addEventListener("click", () => {
    const htmlContent = htmlCode.value;
    const cssContent = cssCode.value;
    const jsContent = jsCode.value;
    const outputContent = resultFrame.srcdoc;

    // Send the data to the backend to save it in the database
    saveFavorite(htmlContent, cssContent, jsContent, outputContent);
});

// Function to send the data to the backend
function saveFavorite(htmlContent, cssContent, jsContent, outputContent) {
    fetch('/save-favorite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            html: htmlContent,
            css: cssContent,
            js: jsContent,
            output: outputContent
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Code saved to favorites!');
        } else {
            alert('Error saving code.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error saving code.');
    });
}

const myCollectionBtn = document.getElementById("my-collection-btn");
const collectionList = document.getElementById("collection-list");
const editorSection = document.getElementById("editor");
const outputSection = document.getElementById("output");

// Event listener for the "My Collections" button
myCollectionBtn.addEventListener("click", () => {
    fetch('/my-collection')
        .then(response => response.json())
        .then(data => {
            if (data.objectIds) {
                collectionList.innerHTML = '';
                data.objectIds.forEach(id => {
                    const listItem = document.createElement("li");
                    listItem.textContent = id;  // Display each ObjectId
                    collectionList.appendChild(listItem);
                });
            } else {
                alert('No collections found');
            }
        })
        .catch(error => {
            console.error('Error fetching collection:', error);
            alert('Error fetching collections.');
        });
});
document.addEventListener("DOMContentLoaded", () => {
    const exportedHtml = localStorage.getItem("exportedHtml");
    const exportedCss = localStorage.getItem("exportedCss");
    const exportedJs = localStorage.getItem("exportedJs");

    if (exportedHtml || exportedCss || exportedJs) {
        if (exportedHtml) {
            document.getElementById("html-code").value = exportedHtml;
        }
        if (exportedCss) {
            document.getElementById("css-code").value = exportedCss;
        }
        if (exportedJs) {
            document.getElementById("js-code").value = exportedJs;
        }

        // Clear the data from localStorage to avoid duplicates
        localStorage.removeItem("exportedHtml");
        localStorage.removeItem("exportedCss");
        localStorage.removeItem("exportedJs");

        // Update the iframe output
        updateOutput();
    }
});

