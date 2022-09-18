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
        invalidEmail: 'Dirección de correo inválida'
    },
    game: {
        gameNotFound: 'La sala a la que se intenta unir no existe',
        creationError: 'Hubo un error creando la sala de juego'
    }
};

module.exports = {
    errors: errorMessages
}