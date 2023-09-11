const mongoose = require('mongoose')

const PedidosSchema = mongoose.Schema({
    pedido: {
        type: Array,
        required: true
    },
    total: {
        type: Number, 
        required: true,
        trim: true
    },
    vendedor_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    cliente_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cliente'
    },
    estado: {
        type: String,
        default: 'PENDIENTE'
    },
    creado: {
        type: Date,
        default: Date.now()
    },
    modificado: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Pedido', PedidosSchema)