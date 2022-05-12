# Home Assisant Import

Hi, welcome to my attempt at importing data into Home Assistant. The Goal is to import data from

- Domoticz with P1/DMSR data (Version: 2020.2 (build 12497) Build Hash: c8f1e167e-modified)
- SMA Inverter with Solar production data (version unknown)

At this point the import tool is usable, nut you have to be somethat of a techy to get the options right.

[![CI](https://github.com/Johanbos/home-assistant-import/actions/workflows/release.yml/badge.svg)](https://github.com/Johanbos/home-assistant-import/actions/workflows/release.yml)


## Home Assistant Community Add-on: SQLite Web
This tool relies fully on the <a href="https://community.home-assistant.io/t/home-assistant-community-add-on-sqlite-web/68912" target="blank">Home Assistant Community Add-on: SQLite Web</a>. You need to have this installed and know a bit about SQL-queries before continuing.

ALWAYS create a backup before experimenting.
      
## Importing SMA CSV

A specific configuration of the SMA CVS file is supported at this moment. Follow the tools instructions to create an import script. You can get your export from your SMA webportal. Carefully select the starting date, as the export may give random values if the unit had no values.

## Importing Domoticz Meter & Multimeter values

Any Meter & Multimeter values can be imported from Domoticz database file. Export the database directly from the dashboard. 

## Why not an Home Assistant add-on?

Creating an Electron app was on my cool-list. I just needed to try this one out :)
I could refactor everything into a Home Assistant add-on. That would make importing history even easier.
