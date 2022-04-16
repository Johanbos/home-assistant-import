// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
document.getElementById('openFile').onclick = async (event) => {
    event.preventDefault();
    openFile();
    
}

async function openFile(filePath) {
    const message = await window.electronAPI.openFile(filePath);
    document.getElementById('message').innerHTML = message;
}

