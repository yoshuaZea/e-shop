const mongoose = require('mongoose')

const ProductoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    imagen: {
        type: String,
        trim: true
    },
    existencia: {
        type: Number,
        required: true,
        trim: true
    },
    precio: {
        type: Number, 
        required: true,
        trim: true
    },
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    creado: {
        type: Date,
        default: Date.now()
    },
    modificado: {
        type: Date,
        default: Date.now()
    },
})

// Habilitar índice para búsquedas
ProductoSchema.index({ nombre: 'text' })

module.exports = mongoose.model('Producto', ProductoSchema)