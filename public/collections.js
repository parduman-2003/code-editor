const collectionList = document.getElementById("collection-list");
const collectionSection = document.getElementById("collection-section");
const editorSection = document.getElementById("editor-section");
const outputSection = document.getElementById("output-section");

// Fetch collections from the backend
fetch('/my-collection')
    .then(response => response.json())
    .then(data => {
        if (data.favorites && data.favorites.length > 0) {
            data.favorites.forEach(favorite => {
                const listItem = document.createElement("li");
                listItem.classList.add("collection-item");

                // Create a card for each collection
                listItem.innerHTML = `
                    <div class="collection-card">
                        <h3> ${favorite._id}</h3>
                        <button class="preview-btn" onclick="previewCollection('${favorite._id}')"><i class="fa-solid fa-eye"></i></button>
                        <div class="collection-details">
                            <p><strong>HTML:</strong> ${favorite.html.substring(0, 100)}...</p>
                            <p><strong>CSS:</strong> ${favorite.css.substring(0, 100)}...</p>
                            <p><strong>JS:</strong> ${favorite.js.substring(0, 100)}...</p>
                              <p><strong>Output:</strong>
                            <div class='out-del'>  
                           <button onclick="viewOutput('${favorite._id}')"> Output</button></p> 
                            <!-- Delete button -->
                        <button class="delete-btn" onclick="deleteCollection('${favorite._id}')"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                        </div>
                     
                    </div>
                `;
                listItem.setAttribute('data-id', favorite._id);
                collectionList.appendChild(listItem);
            });
        } else {
            collectionList.innerHTML = '<p>No collections found.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching collections:', error);
        alert('Error fetching collections.');
    });

// Function to delete a collection
function deleteCollection(id) {
    // Send DELETE request to the server
    fetch(`/collection/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const collectionItem = document.querySelector(`.collection-item[data-id="${id}"]`);
            if (collectionItem) {
                collectionItem.remove();
            }
            alert('Collection deleted successfully.');
        } else {
            alert('Error deleting collection.');
        }
    })
    .catch(error => {
        console.error('Error deleting collection:', error);
        alert('Error deleting collection.');
    });
}

// Function to preview the collection content
function previewCollection(id) {
    // Hide the collection section and show the editor section
    collectionSection.style.display = 'none';
    editorSection.style.display = 'block';

    fetch(`/collection/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const htmlCode = document.getElementById("html-code");
                const cssCode = document.getElementById("css-code");
                const jsCode = document.getElementById("js-code");

                if (htmlCode && cssCode && jsCode) {
                    // Dynamically update the editor with the collection content
                    htmlCode.value = data.collection.html;
                    cssCode.value = data.collection.css;
                    jsCode.value = data.collection.js;
                    updateOutput();  // Call to update output immediately
                } else {
                    console.error("One or more required elements are missing in the DOM.");
                }
            } else {
                alert('Error previewing collection.');
            }
        });
        
}

// Function to view the output of a collection
function viewOutput(id) {
    // Hide the collection section and show the output section
    collectionSection.style.display = 'none';
    outputSection.style.display = 'block';

    fetch(`/collection/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const iframe = document.getElementById("result");
                iframe.srcdoc = `
                    <style>${data.collection.css}</style>
                    ${data.collection.html}
                    <script>${data.collection.js}<\/script>
                `;
            } else {
                alert('Error displaying output.');
            }
        });
        
}

// Function to update the output iframe based on the content of the text areas
function updateOutput() {
    const htmlCode = document.getElementById("html-code").value;
    const cssCode = document.getElementById("css-code").value;
    const jsCode = document.getElementById("js-code").value;

    const iframe = document.getElementById("result");

    if (iframe) {
        iframe.srcdoc = `
            <style>${cssCode}</style>
            ${htmlCode}
            <script>${jsCode}<\/script>
        `;
    } else {
        console.error("Iframe not found.");
    }
}

// Function to show the collection list again
function showCollections() {
    collectionSection.style.display = 'block'; // Show the collection list
    editorSection.style.display = 'none'; // Hide the editor section
    outputSection.style.display = 'none'; // Hide the output section
}

// Function to show the code editor section
function showEditor() {
    collectionSection.style.display = 'none'; // Hide the collection list
    editorSection.style.display = 'block'; // Show the editor section
}
document.addEventListener('DOMContentLoaded', () => {
    const htmlTab = document.getElementById('html-tab');
    const cssTab = document.getElementById('css-tab');
    const jsTab = document.getElementById('js-tab');

    const htmlCode = document.getElementById('html-code');
    const cssCode = document.getElementById('css-code');
    const jsCode = document.getElementById('js-code');

    // Function to handle tab switching
    function switchTab(tab, textarea) {
        // Hide all textareas and remove the active class from all tabs
        [htmlCode, cssCode, jsCode].forEach((area) => area.classList.add('hidden'));
        [htmlTab, cssTab, jsTab].forEach((btn) => btn.classList.remove('active'));

        // Show the selected textarea and set the clicked tab as active
        textarea.classList.remove('hidden');
        tab.classList.add('active');
    }

    // Event listeners for tab clicks
    htmlTab.addEventListener('click', () => switchTab(htmlTab, htmlCode));
    cssTab.addEventListener('click', () => switchTab(cssTab, cssCode));
    jsTab.addEventListener('click', () => switchTab(jsTab, jsCode));
});
document.getElementById("export-btn").addEventListener("click", () => {
    const htmlCode = document.getElementById("html-code").value;
    const cssCode = document.getElementById("css-code").value;
    const jsCode = document.getElementById("js-code").value;

    // Save the data to localStorage
    localStorage.setItem("exportedHtml", htmlCode);
    localStorage.setItem("exportedCss", cssCode);
    localStorage.setItem("exportedJs", jsCode);

    // Redirect to the editor page
    window.location.href = "/";
});
