@REM Maven Wrapper startup script for Windows
@echo off
setlocal
set "MVNW_DIR=%~dp0"
set "MVNW_MAVEN_HOME=%MVNW_DIR%.mvn\wrapper\apache-maven-3.9.9"
set "MVNW_ZIP=%MVNW_DIR%.mvn\wrapper\apache-maven-3.9.9-bin.zip"
if exist "%MVNW_MAVEN_HOME%\bin\mvn.cmd" goto run
echo Maven is not installed; downloading Apache Maven 3.9.9...
if not exist "%MVNW_DIR%.mvn\wrapper" mkdir "%MVNW_DIR%.mvn\wrapper"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; Invoke-WebRequest 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.9/apache-maven-3.9.9-bin.zip' -OutFile '%MVNW_ZIP%'; Expand-Archive -LiteralPath '%MVNW_ZIP%' -DestinationPath '%MVNW_DIR%.mvn\wrapper' -Force"
if errorlevel 1 exit /b 1
:run
call "%MVNW_MAVEN_HOME%\bin\mvn.cmd" %*
endlocal
