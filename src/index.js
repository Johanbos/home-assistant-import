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
    const response = await window.electronAPI.openFile(filePath);
    console.error(response.error);
    console.log(response.entities);

    document.getElementById('message').innerHTML = response.message;
    document.getElementById('filePath').innerHTML = response.filePath;
    
    var entityId = document.getElementById('entityId');
    response.entities.forEach((element) => {
        var option = document.createElement("option");
        option.value = element.EntityID;
        option.text = `${element.DeviceName} (${element.TotalValues} values, from ${element.StartDate} with ${element.MinValues} to ${element.EndDate} with ${element.MaxValues})`;
        console.log(element, option);
        entityId.add(option);
    });
}

// KickStart; do not check in
openFile(`O:\\OneDrive Johan\\Documents\\Schepenen 8\\Domoticz\\test.db`);