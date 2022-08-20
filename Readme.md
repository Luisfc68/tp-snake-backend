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


## ¿Como levantar el juego en local?
1. `a`
2. Crear archivo .env con las variables de entorno especificadas en la sección anterior.
3. `npm run dev`