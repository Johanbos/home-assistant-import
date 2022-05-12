// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// assign clicks
document.getElementById('openFile').onclick = async (event) => {
    event.preventDefault();
    openFile();
}
const inputs = Array.from(document.getElementsByTagName('input')).concat(Array.from(document.getElementsByTagName('select')));
inputs.forEach(element => {
    element.onchange = async (event) => {
        event.preventDefault();
        openFile(document.getElementById('filePath').innerHTML);
    }
});

async function openFile(filePath = null) {
    const metadata_id = document.getElementById('metadataId').value;
    const entityId = document.getElementById('entityId').value;
    const options = {
        existingDataMode: document.getElementById('existingDataMode').value,
        transformValueMode: document.getElementById('transformValueMode').value,
        validateData: document.getElementById('validateData').value,
    };
    const response = await window.electronAPI.createImport(filePath, metadata_id, entityId, options);
    console.log('openFile', response);
    document.getElementById('message').innerHTML = response.message;
    document.getElementById('error').innerHTML = '';
    document.getElementById('filePath').innerHTML = response.filePath;
    document.getElementById('result').value = response.script;

    // Display error if any
    if (response.error) {
        document.getElementById('error').innerText = JSON.stringify(response.error, null, '\t');
        console.error(response.error);
    }

    // Add entity options
    if (response.entities) {
        var entityIdElement = document.getElementById('entityId');

        // Clear current options
        const selectedIndex = entityIdElement.selectedIndex < 0 ? 0 : entityIdElement.selectedIndex;
        entityIdElement.options.length = 0;

        // Add new options
        response.entities.forEach((element) => {
            var option = document.createElement("option");
            option.value = element.EntityID;
            option.text = `${element.DeviceName} (${element.TotalValues} values, from ${element.StartDate} with ${element.MinValues} to ${element.EndDate} with ${element.MaxValues})`;
            entityIdElement.add(option);
        });

        // reselect option 
        entityIdElement.selectedIndex = selectedIndex;
    }
}

// KickStart; 
//openFile(`C:\\Users\\johan\\Desktop\\test.db`);