# Check24Challange
## Primitive Executionsstruktur
- Die html/css Dateien in public fungieren als der FrontEnd page-frame, der direkt mit dem javascript in script displayed wird
- Die Dateien im Script Folder interagieren dann mit dem WebServer in server js. Ein node.js Server, der Express verwendet. 
- Für komplizierte Operationen habe ich c++ Programme geschrieben, die im logic folder liegen und die vom node.js server als .exe ausgeführt werden
## Ausführen der Dateien 
-Die Website läuft am Localhost 127.0.0.1 am Port 5500 und kann aufgerufen werden, sobald der server.js mit node ausgeführt wird. 
-Zu beachten ist dabei, dass server.js für komplexere funktionen .exe Dateien lädt, die eventuell bei Rechnern anderer Systeme nicht funktionieren. Sollten hierbei Probleme auftreten, dann bitte die .cpp Dateien neu kompilieren und gegebenfalls die Dateiendungen ".exe" im node.js Programm anpassen. 
-Ansonsten sollte alles "OutOfTheBox" funktionabel sein und ich wünsche viel Spaß beim Testen :)

