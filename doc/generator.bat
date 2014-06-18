@echo off

rmdir /s /q "%~dp0symbols" > nul 2>&1
del /f "%~dp0index.html" "%~dp0files.html" > nul 2>&1

@rem see https://code.google.com/p/jsdoc-toolkit/wiki/CmdlineOptions
java ^
    -jar %~dp0..\extlib\jsdoc-toolkit\jsrun.jar ^
    %~dp0..\extlib\jsdoc-toolkit\app\run.js ^
    %~dp0..\lib\kclv.js ^
    -A ^
    -e=UTF-8 ^
    -d=%~dp0 ^
    -p ^
    -t=%~dp0..\extlib\jsdoc-toolkit\templates\jsdoc
