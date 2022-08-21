const errorMessages = {
    auth: {
        invalidCredentials: 'Usuario o contraseña incorrectos',
        invalidToken: 'Token no válido'
    },
    commons: {
        mandatory: 'Campo obligatorio',
        environmentSpecific: (variableName) =>  `Variable de entorno ${variableName} no encontrada`,
        environmentGeneric: 'Variable de entorno no encontrada'
    },
    player: {
        existingEmail: 'Esa dirección de correo ya se encuentra registrada',
        invalidEmail: 'Dirección de correo inválida'
    }
};

module.exports = {
    errors: errorMessages
}