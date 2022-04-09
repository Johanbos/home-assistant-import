module.exports = {
    packagerConfig: {},
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            platforms: ['darwin', 'linux'],
            config: {
                repository: {
                    owner: 'Johanbos',
                    name: 'home-assistant-import'
                },
                prerelease: true
            }
        }
    ],
    makers: [
        {
            "name": "@electron-forge/maker-squirrel",
            "config": {
                "name": "home-assistant-import"
            }
        },
        {
            "name": "@electron-forge/maker-zip",
            "platforms": [
                "darwin"
            ]
        },
        {
            "name": "@electron-forge/maker-deb",
            "config": {}
        },
        {
            "name": "@electron-forge/maker-rpm",
            "config": {}
        }
    ],
}

