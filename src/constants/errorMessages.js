const errorMessages = {
    auth: {
        invalidCredentials: 'Usuario o contraseña incorrectos',
        invalidToken: 'Token no válido'
    },
    commons: {
        mandatory: 'Campo obligatorio',
        environmentSpecific: (variableName) =>  `Variable de entorno ${variableName} no encontrada`,
        environmentGeneric: 'Variable de entorno no encontrada',
        invalidRange: (variableName) => `Rango invalido (${variableName})`
    },
    player: {
        existingEmail: 'Esa dirección de correo ya se encuentra registrada',
        invalidEmail: 'Dirección de correo inválida',
        playerNotFound: 'El jugador no existe'
    },
    game: {
        gameNotFound: 'La sala no existe',
        creationError: 'Hubo un error creando la sala de juego',
        missingConfirmations: 'Hay jugadores que aun no estan listos',
        notPermission: 'No tiene permisos para iniciar el juego',
        gameFull: 'La sala esta llena'
    }
};

module.exports = {
    errors: errorMessages
}