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

document.getElementById('createImport').onclick = async (event) => {
    event.preventDefault();
    const entityId = document.getElementById('entityId').value;
    createImport(entityId);
}

async function openFile(filePath) {
    const response = await window.electronAPI.openFile(filePath);
    document.getElementById('message').innerHTML = response.message;
    document.getElementById('filePath').innerHTML = response.filePath;
    
    if (response.error) {
        console.error(response.error);
    }
    if (response.entities) {
        console.log(response.entities);

        var entityId = document.getElementById('entityId');
        response.entities.forEach((element) => {
            var option = document.createElement("option");
            option.value = element.EntityID;
            option.text = `${element.DeviceName} (${element.TotalValues} values, from ${element.StartDate} with ${element.MinValues} to ${element.EndDate} with ${element.MaxValues})`;
            console.log(element, option);
            entityId.add(option);
        });
    }
}

async function createImport(entityId) {
    const response = await window.electronAPI.createImport(entityId);
    console.log(response);
}

// KickStart; 
//openFile(`C:\\Users\\johan\\Desktop\\test.db`);
openFile(`C:\\Users\\johan\\Desktop\\SUNNY_TRIPOWER_4.0_3006315744_Daily_2022_03_25_10_34_25.csv`);