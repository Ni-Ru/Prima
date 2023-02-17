# Prima Wise 22/23


## Infos 
- **Titel:** Deadbolt
- **Author** Nic Rubner
- **Jahr & Saison** Wintersemester 22/23
- **Studiengang & Semester** Medieninformatik 5
- **Kurs** "Prototyping interactive media-applications and games" (PRIMA)
- **Dozent** Prof. Jirka Dell'Oro-Friedl

## Links
- **[Spiel](https://ni-ru.github.io/Prima/prima/deadbolt/index.html)**
- **[Code](https://github.com/Ni-Ru/Prima/tree/main/prima/deadbolt)**
- **[Konzept](https://github.com/Ni-Ru/Prima/blob/main/prima/deadbolt/Deadbolt_Konzept.pdf)**

## Steuerung
- **A, D:** nach links und rechts laufen.
- **E** mit der Umgebung interagieren (Treppen oder Türen - leuchten gelb auf wenn man mit ihnen Interagieren kann).
- **Leertaste** wechseln des ausgerüsteten Gegenstandes.
- **Rechtsklick** Zielen (nur möglich wenn Steine ausgerüstet sind).
- **Linksklick** Messerangriff/Stein werfen (Je nachdem was ausgerüstet ist, Stein kann nur geworfen werden wenn gleichzeitig gezielt wird).

## Bewertungskriterien
|NR   | Kriterium  |Erläuterung   |
| :------------ | :------------ | :------------ |
|1   |Units and Positions   |Die 0 befindet sich an dem "Spawnpunkt" des Avatars. Die 1 ist die Größe des Avatars und der Gegner. Darauf ist der rest des Leves angepasst. |
|2   |Hierarchy   | Mein Main Branch hat 4 abzweigungen, eine für den Avatar, eine für die Gegner, eine für die Umgebung und eine für die Hintergrundbilder. Jede der Nodes, welche eine Mesh besitzen (außer die Hintergrundnodes) besitzen ein Parentnode durch die die Position der jeweiligen Node festgelegt wird. Dadurch ist es einfacher die einzelnen Meshs zu platzieren, außerdem macht es die Manipulation der Position/Lage der Meshs im Code einfacher. </br> 
|3   |Editor   | Den Editor habe ich zur Levelerstellung verwendet, dazu gehört die Platzierung der Wände, Böden, Gegner und einfügen der Texturen für den Hintergrund zum Beispiel. Der rest wurde Hauptsächlich per Code gemacht. Die Logik zum Beispiel kann nur per Coding implementiert werden. |
|4   |Scriptcomponents   |Ich habe einige Scriptcomponents verwendet, ein Scriptcomponent zum beispiel allein für Umgebung mit der man interagieren kann ("InteractComponent"). Dieses Component war also hauptsächlich für Türen und Treppen, sobald der Avatar in die Nähe einer Tür kommt wird das ScriptComponent der Tür praktisch "geladen", über das Script wird die Tür dann gelb Markiert und man kann mit ihr interagieren. Scriptcomponents sind vor allem nützlich, um Funktionen, die nur an ein bestimmten Node gebunden sind zu implementieren.   |
|5   |Extend  | Ich habe für zwei verschiedene dinge die Klasse SpriteNode erweitert. Einmal für die Gegner und einmal für die Steine. Bei den Steinen zum beispiel war es sehr nützlich, da ich dadurch schon über meinen Code definieren konnte wie ein Stein aussieht und was für Components er haben muss. Später konnte ich die Steine dann ganz einfach in meinem Code dem Branch hinzufügen sobald sie geworfen werden.  |
|6   |Sound   | Ich habe 2 Sounds eingebaut. Einer wird getriggert wenn man über Leertaste sein ausgerüstetes Item wechselt. Der andere wenn ein Stein mit einer Wand/Boden kollidiert. Den sound habe ich am Branch angebracht, wo auch der Listener angebracht ist, dadurch hört man jeden Ton egal wo sich der Avatar befindet gleich.  |
|7   |VUI   | In meinem Interface wird das Inventar angezeigt, in seinem Inventar hat der Spieler ein Messer und Steine. je nachdem welcher Gegenstand ausgerüstet ist wird derjenige Gegenstand im VUI hervorgehoben. Bei den Steinen werden anfangs 3 Bilder von Steinen angezeigt, diese zeigen einfach wie viele Steine noch im Inventar sind.  |
|8   |Event-System   | zum Beispiel beim abspielen von Sounds habe ich Custom Events benutzt. Hierdurch konnte man ganz einfach von überall auf die funktion zugreifen, durch die ein Ton abgespielt werden konnte.  |
|9   |External Data   | In meiner externen JSON lege ich den betrag der Steine fest den man zum spielbeginn hat.   |
|A   |Light   | Ich habe kein Licht verwendet  |
|B   |Physics   | Ich habe rigidbody components und collisions genutzt um zum beispiel bei einer collision eines steines einen Ton abzuspielen. Um den stein zu werfen benutze ich forces die über die position des cursors festgelegt werden. Joints habe ich keine eingebaut.   |
|C   |Net   | Ich habe keine ultiplayer functionality eingebaut.  |
|D  |State Machines   | Ich habe ComponentStateMachines genutzt um das verhalten der gegnern zu steuern. Eingebaut habe ich 2 "JOBS": "IDLE" und "ATTACK"   |
|E   |Animation   | ich habe das animation system von FudgeCore genutzt um eine Animation bei der benutztung von Treppen einzufügen bei der die opacity des Avatars erst in 0.5 Sekunden auf 0 wechselt und anschließend beim "verlassen" der Treppen wird die opacity in 0.5 Sekunden wieder auf 1 gewechselt. Außerdem habe ich verschiedene Sprites für den Avatar eingefügt, davon eine Idle Animation, eine Walk Animation und eine Attack Animation. |