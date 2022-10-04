# Snake battle 
Este repositorio es el backend para el juego realizado para la materia desarrollo fullstack. Dicho juego consiste en el juego de la serpiente en version multiplayer, el cual incluye un sistema de usuarios, salas y puntajes.

## Variables de entorno

|      Variable      |                                              Descripción                                               | Valor por defecto |
|:------------------:|:------------------------------------------------------------------------------------------------------:|:-----------------:|
|        PORT        |                               Puerto donde se va a levantar el servidor                                |       8080        |
|     JWT_SECRET     |                                Secreto para firmar los tokens de acceso                                |  **OBLIGATORIO**  |
| JWT_REFRESH_SECRET | Secreto para firmar los tokens de refresco (no deberia tener el mismo valor que la variable de arriba) |  **OBLIGATORIO**  |
|      DB_HOST       |                                Dirección del servidor de base de datos                                 |     localhost     |
|      DB_PORT       |                        Puerto del servidor donde está alojada la base de datos                         |       27017       |
|      DB_NAME       |                                       Nombre de la base de datos                                       |       mongo       |
 |     BOARD_SIZE     |                    Cantidad de casillas que va a tener el tablero de ancho y largo                     |  **OBLIGATORIO**  |
| SPEED_UP_INTERVAL  |            Cantidad de ms que va a pasar entre cada aumento de velocidad de las serpientes             |  **OBLIGATORIO**  |
|   MINIMUM_SPEED    |                   Velocidad minima que podran tener las serpientes en ms por casilla                   |  **OBLIGATORIO**  |
|  SPEED_REDUCTION   |              Cantidad de ms que se va a reducir el intervalo en cada aumento de velocidad              |  **OBLIGATORIO**  |
|   INITIAL_SPEED    |                      Cantidad de ms inicial para el movimiento de las serpientes                       |  **OBLIGATORIO**  |


## ¿Como levantar el juego en local?
1. `git clone https://github.com/Luisfc68/tp-snake-backend.git`
2. `cd tp-snake-backend`
3. Crear archivo .env con las variables de entorno especificadas en la sección anterior.
4. `npm run dev`
* NOTA: en este caso los requerimientos son tener instalados node, npm y mongodb

## ¿Como levantar el juego en local usando docker-compose?
1. `git clone https://github.com/Luisfc68/tp-snake-backend.git`
2. `cd tp-snake-backend`
3. Crear archivo .env con las variables de entorno especificadas en la sección anterior.
4. `docker-compose build`
5. `docker-compose up`
* NOTA: en este caso los requerimientos son tener instalados docker y docker-compose

## Endpoints 
El proyecto cuenta con una colección de postman en el archivo `snake.postman-collection.json` donde 
se encuentran las peticiones que se pueden hacer actualmente al sistema. En total cuenta con 12 
endpoints de tres entidades distintas para que pueda interactuar el front end.

## Eventos
Además de los endpoints, el sistema cuenta con una serie de eventos de socket para llevar a cabo 
una comunicación en tiempo real entre cliente y servidor. Estos eventos se dividen entre los 
originados en el cliente que van al servidor y los originados en el servidor que van al cliente
y son los siguientes:
### Eventos servidor -> cliente
|    Evento    |                      Descripcion                      |
|:------------:|:-----------------------------------------------------:|
|  gameStart   |             Inicio formal de una partida              |
|  movements   | Envio de las coordenadas de cada uno de los jugadores |
|    death     |            Muerte de uno de los jugadores             |
| gameFinished |               Muerte del último jugador               |
|  foodSpawn   |       Aparición de una comida para la serpiente       |
|  foodEaten   |        Una serpiente se comio la comida actual        |
### Eventos cliente -> servidor
|     Evento      |                               Descripcion                               |
|:---------------:|:-----------------------------------------------------------------------:|
|    initGame     |      Solicitud de inicio de partida por parte del dueño de la sala      |
|   disconnect    |                        Desconexión de un socket                         |
|  playerConfirm  |          Confirmación de que un jugador esta listo para jugar           |
| changeDirection | Un jugador presionó una tecla para cambiar la dirección de su serpiente |

## Selección de tecnologías
### Base de datos
Se decidió trabajar con MongoDB puesto que el proyecto va a requerir que se estén realizando lecturas
y escrituras en la BD constantemente en períodos de tiempo reducidos en las cuales la transaccionalidad
no es un factor importante. Estos requerimientos hacen que una base de datos NoSql sea la mejor opción.
### Servidor
* **express**: la decisión de usar este framework para la creación de la API es porque aporta una 
experiencia de desarrolo más amigable y rápida que la que pueden ofrecer otras opciones del mercado,
también por la familiaridad de los integrantes del grupo con el mismo. 
* **jsonwebtoken**: puesto que el proyecto expone una API REST se eligió jwt como tecnología para llevar
a cabo la autenticación para incentivar la naturaleza stateless de este tipo de API.
* **consola**: decisión estética. Esta librería es solo para tener una alternativa visualmente más agradable que el `console.log()`
* **multer**: se necesitaba una librería para trabajar con request multipart y multer es la opción más amigable
de la lista de tecnologías recomendadas en la documentación de express.
* **mongoose**: como MongoDB fue la base de datos elegida se decidió trabajar con este ODM para 
abstraernos de una capa más de complejidad.
* **socket.io**: en el proyecto se necesitaba comunicación en tiempo real entre cliente y servidor. Se eligió 
socket.io porque los integrantes ya estamos familiarizados con esta opción y además es sumamente amigable
para el tema de la definición de eventos.
### Test
* **jest**: Es una herramienta de testing facil de utilizar que cuenta con un gran numero de librerias que se pueden emplear
para un desarrollo de los tests mas fluido, ademas de que es la opcion con la que mas experiencia tenemos.

### Cliente
* **Angular**: se eligió este framework para trabajar por familiaridad de los integrantes. Como es el que más conocemos
es en el que no sentimos capaces de generar un mejor desarrollo.
