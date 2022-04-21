# Home Assisant Import

Hi, welcome to my attempt at importing data into Home Assistant. The Goal is to import data from

- Domoticz with P1/DMSR data (Version: 2020.2 (build 12497) Build Hash: c8f1e167e-modified)
- SMA Inverter with Solar production data (version unknown)

At this point the import tool is not usable, unless you are a developer completing the code yourself ;)

[![CI](https://github.com/Johanbos/home-assistant-import/actions/workflows/release.yml/badge.svg)](https://github.com/Johanbos/home-assistant-import/actions/workflows/release.yml)

## Why not an Home Assistant add-on?

Creating an Electron app was on my cool-list. I just needed to try this one out :)
I could refactor everything into a Home Assistant add-on. That would make importing history even easier.

## Home Assistant Community Add-on: SQLite Web
This tool relies fully on the <a href="https://community.home-assistant.io/t/home-assistant-community-add-on-sqlite-web/68912" target="blank">Home Assistant Community Add-on: SQLite Web</a>. You need to have this installed and know a bit about SQL-queries before continuing.

ALWAYS create a backup before experimenting.
      
## Importing SMA CVS

A specific configuration of the SMA CVS file is supported at this moment. Follow the tools instructions to create an import script.