@echo off
mkdir dist 2>nul
xcopy /E /I /Y css dist\css
xcopy /E /I /Y js dist\js
copy index.html dist\
copy _headers dist\
copy _routes.json dist\
