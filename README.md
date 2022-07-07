# Home Assistant Import

Hi, welcome to my attempt at importing data into Home Assistant. The Goal is to import data from

- Domoticz with P1/DMSR data (Version: 2020.2 (build 12497) Build Hash: c8f1e167e-modified)
- SMA Inverter with Solar production data (version unknown)

At this point the import tool is usable, but you have to be somethat of a techy to get the options right.

[![CI](https://github.com/Johanbos/home-assistant-import/actions/workflows/release.yml/badge.svg)](https://github.com/Johanbos/home-assistant-import/actions/workflows/release.yml)


## Home Assistant Community Add-on: SQLite Web
This tool relies fully on the <a href="https://community.home-assistant.io/t/home-assistant-community-add-on-sqlite-web/68912" target="blank">Home Assistant Community Add-on: SQLite Web</a>. You need to have this installed and know a bit about SQL-queries before continuing.

ALWAYS create a backup before experimenting.

## Importing Domoticz Meter & Multimeter values

Any Meter & Multimeter values can be imported from Domoticz database file. Export the database directly from the dashboard. 

![image](https://user-images.githubusercontent.com/6775602/168067633-f0381250-c1fd-4b48-9380-1b314eee517b.png)
  
## Importing SMA CSV

A specific configuration of the SMA CVS file is supported at this moment. Follow the tools instructions to create an import script. You can get your export from your SMA webportal. Carefully select the starting date, as the export may give random values if the unit had no values.

![image](https://user-images.githubusercontent.com/6775602/168069333-ce77a5b3-f079-4861-983e-0957296efafa.png)

### SMA CSV specifications

SMA has a pretty bespoke specification, so in [deviceSma.js](https://github.com/Johanbos/home-assistant-import/blob/main/src/core/deviceSma.js) a lot or lines are being skipped and it has a custom dateformat. Only first two columns matter, the date and TotWhOut.

```
sep=,
Version CSV3|Tool WebUI|Linebreaks CR/LF|Delimiter comma

,SN: 1234567890,SN: 1234567890,SN: 1234567890,SN: 1234567890
,SUNNY TRIPOWER 4.0,SUNNY TRIPOWER 4.0,SUNNY TRIPOWER 4.0,SUNNY TRIPOWER 4.0
,1234567890,1234567890,1234567890,1234567890
,Metering.TotWhOut,Metering.GridMs.TotWhOut,Metering.GridMs.TotWhIn,TotVal.TotCsmp
,Analog,Analog,Analog,Analog
DD.MM.YYYY hh:mm:ss,[Wh],[Wh],[Wh],[Wh]
13.09.2019 02:00:00,0,0,0,NaN
14.09.2019 02:00:00,14450,0,0,NaN
```

## Importing generic CSV

A [request](https://github.com/Johanbos/home-assistant-import/issues/12) has been made to create a generic cvs importer. I have not started on this yet. The configurable parts would be:

- delimiter (if not a comma :D)
- lines to skip
- columns to read (date & value)
- dateformat

## Why not an Home Assistant add-on?

Creating an Electron app was on my cool-list. I just needed to try this one out :)
I could refactor everything into a Home Assistant add-on. That would make importing history even easier.
