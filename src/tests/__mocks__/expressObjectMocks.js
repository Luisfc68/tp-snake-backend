let req= {}
let res = {
    _status: null,
    _json: null,
    sendFile: function(){
        this._status= 404
        return this
    },
    status: function (code) {
        this._status = code
        return this
        },
    json: function (json) {
        this._json = json
        return this
    },
    send: function () {
        return this
    }
}
let next= {}

module.exports = {req,res,next}