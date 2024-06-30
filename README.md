# Home Assistant Import with SQL scripts

Hi, welcome to my attempt at importing data into Home Assistant. The Goal is to import data from

- Domoticz with P1/DMSR data (Version: 2020.2 (build 12497) Build Hash: c8f1e167e-modified)
- SMA Inverter with Solar production data (version unknown)

At this point the import tool is usable, but you have to be somewhat of a techy to get the options right. This is not an add-on, but a tool that's creates SQL scripts that import data into Home Assistant. 

[![CI](https://github.com/Johanbos/home-assistant-import/actions/workflows/release.yml/badge.svg)](https://github.com/Johanbos/home-assistant-import/actions/workflows/release.yml)

![image](https://user-images.githubusercontent.com/6775602/177726351-c687a04c-0a07-4c3b-9bf9-7d60b65941c9.png)  
_I could look at these charts like.. forever_ :heart:

## How to start importing
1. This tool relies fully on the <a href="https://community.home-assistant.io/t/home-assistant-community-add-on-sqlite-web/68912" target="blank">Home Assistant Community Add-on: SQLite Web</a>. You need to have this installed and know a bit about SQL-queries before continuing.

2. There is also a thread on the [home-assistant community](https://community.home-assistant.io/t/import-domoticz-history/162489/7) about importing history.

3. ALWAYS create a backup before experimenting.

4. Download a [release](https://github.com/Johanbos/home-assistant-import/releases) for linux or windows, unzip and (for Windows) run `Home Assistant Import.exe`. There is no need to compile the code yourself.

![image](https://user-images.githubusercontent.com/6775602/177728592-cea4aefe-ebbe-4021-9887-c52806bbfebc.png)

5. After starting the application some warnings may appear, because the application is not 'signed'. I have no certificate at the moment. If you trust the application, is up to you. On Windows click 'more info' and the 'Run Anyway'.

![image](https://user-images.githubusercontent.com/6775602/177729704-61005c31-4e3e-496d-b4bd-97f66a2b08d2.png)


6. Follow the steps in the application. Any red text indicates an error and means it will take more time to find out why this is happening.

7. In Home Assistent it is possible to find and edit weird imported data in "Developer tools > Statistics". Find the sensor, click on the graph icon and see "Outliers". There you can adjust values.

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
