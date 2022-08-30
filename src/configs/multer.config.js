const multerConfig = {
    destination: 'public/images'
}
const supportedMimes = ['image/jpeg', 'image/png'];

module.exports = {
    multerConfig,
    supportedMimes
}
