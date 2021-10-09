[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-f059dc9a6f8d3a56e377f745f24479a46679e63a5d9fe6f495e02850cd0d8118.svg)](https://classroom.github.com/online_ide?assignment_repo_id=5848439&assignment_repo_type=AssignmentRepo)
## [Programmierung und Design von WebApplications mit HTML5, CSS3 und JavaScript](https://lsf.uni-regensburg.de/qisserver/rds?state=verpublish&status=init&vmfile=no&publishid=158883&moduleCall=webInfo&publishConfFile=webInfo&publishSubDir=veranstaltung) ##

WiSe 2021/2022

Leitung: Dr. Friedrich Wünsch, Louis Ritzkowski

# Assignan - Economy-simulation for a high-fantasy village #
![Wappen_Assignan](https://user-images.githubusercontent.com/78024843/135888069-ba547cb3-434b-4fe1-b509-3309e808759e.PNG)

Maximilian Graml

### Beschreibung ###
!!! Design wird in Chrome verschoben - bitte nur in Firefox öffnen !!!

Die programmierte Website ermöglicht die Berechnung (vereinfachter) wirtschaftlicher Vorgänge in einem mittelalterlichen oder Fantasy-Dorf. Durch verschiedene Gebäude, welche auch nachträglich manuell hinzugefügt werden können, erhält das Dorf wöchentlich auf Basis der existierenden Gebäude bzw. Einkommensquellen automatisch berechnete Einkommen, aber auch Ausgaben durch die notwendige Versorgung der Dorfbewohner. Mithilfe der Save/Load Buttons können die Speicherstände gesichert, potentiell auch außerhalb verändert und dann wieder hochgeladen werden.
### Umsetzung ###
Das Programm wurde mithilfe von Dexie umgesetzt, um eine einfache Handhabung der Daten innerhalb der Datenbank zu erreichen.
### Steuerung ###
Eine ausführliche Anleitung bzw. Beschreibung der Funktionsweisen befindet sich innerhalb der Website als Popup, wenn man den Mond-Button anklickt oder F1 drückt. Auch alle anderen Funktionen können via Tastatur aufgerufen werden.
### Wichtige Klassen/Dateien ###
Die Struktur der Website baut sich wie folgt auf:

Die Hauptseite wird durch index.html im Hauptverzeichnis erstellt, welche die Dateien im src Ordner einbindet. 
Im src Ordner befinden sich data/reference_database.json, welche geladen werden kann, falls keine Datenbank im Browser-Cache existiert, das Bild des Wappen im images Ordner und die CSS sowie JS Dateien in den jeweiligen Ordnern.

Die CSS Dateien sind einerseits modifizierte Versionen aus der CSS-Übung im css/assignan Ordner und neue css Dateien für Elemente der eigentlichen Website (css/main.ss) und das Popup-Manual (css/manual.css).

Die js Dateien teilen sich auf auf den js/comp Unterordner mit der transition.js, welche die allgemeine Steuerung der Buttons übernimmt und die database.js aufruft, welche alle Datenbank-Verwaltungsaufgaben übernimmt und damit die zentralste Datei im Repository darstellt. Im anderen Unterordner js/design befinden sich die Skripte, welche das Aussehen der umliegenden GameBox festlegen.
### Designentscheidungen ###
Aufgrund des oben eingefügten Wappens beschränkte ich mich bei den verwendeten Farben größtenteils auf die Wappenfarben gelb und blau. Um alle Features mit praktischer Oberfläche bedienen zu können, wurde die eigene Version der Oberfläche der Gamebox, aus der Übung letzte Woche, verwendet, wobei das Steuerkreuz entfernt wurde.