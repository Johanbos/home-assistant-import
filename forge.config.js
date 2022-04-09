module.exports = {
    "makers": [
        {
            "name": "@electron-forge/maker-squirrel",
            "config": {
                "name": "naive_photo_dare_co7bu"
            }
        },
        {
            "name": "@electron-forge/maker-zip",
            "platforms": [
                "darwin"
            ]
        },
        {
            "name": "@electron-forge/maker-rpm",
            "config": {}
        }
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'Johan Bos',
                    name: 'Home Assistant Import'
                },
                prerelease: true
            }
        }
    ]
}

