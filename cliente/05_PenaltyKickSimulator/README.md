# Instrucciones de juego

## Porteria (Posiciones)

[00][01][02][03][04]  
[05][06][07][08][09]  
[10][11][12][13][14]  

## Marcador

[][][][][] - [][][][][]  

1. Al empezar la partida, cuando el primer jugador seleccione el lugar de disparo 
debe de guardarse pero NO MOSTRARSE, ademas, segun el lugar donde se chute hay una probabilidad de fallarla el disparo

# Probabilidades de acierto

[50][65][70][65][50]  
[65][75][90][75][65]  
[60][65][80][65][60]  

2. El segundo jugador, cuando seleccione el lugar de parada debe comprobarse si se ha parado

# Imprimir resultados

- Cuando el lanzador mete gol se pinta en la posicion de lanzamiento '⚽' y se pinta en el marcador '🟢'

- Si el portero acierta la trayectoria se pinta '🧤' y se pinta en el marcador '🔴'

- Si el tiro cae en la posibilidad de fallo se pinta '❌'

# Ejemplo de gol

[🟢][][][][] - [][][][][]  

[00][01][02][03][04]  
[05][06][07][⚽][09]  
[10][11][12][13][14]  

# Ejemplo de parada

[🟢][][][][] - [🔴][][][][]  

[00][01][02][03][04]  
[05][06][07][08][09]  
[10][🧤][12][13][14]  

# Ejemplo de fallo

[🟢][🔴][][][] - [🔴][][][][]  

[00][01][02][03][❌]  
[05][06][07][08][09]  
[10][11][12][13][14]  

- Despues de cada chute se debe verificar si algun jugador ha ganado