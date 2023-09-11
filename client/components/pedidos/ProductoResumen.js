import React, { useState, useEffect, useContext } from 'react'
import PedidoContext from '../../context/pedidos/PedidoContext'
import { formatearDinero } from '../../helpers'

const ProductoResumen = ({ producto }) => {

    const { nombre, precio } = producto

    // State local
    const [cantidad, setCantidad] = useState(0)

    // Context de pedidos
    const pedidoContext = useContext(PedidoContext)
    const { cantidadProductos, actualizarTotal } = pedidoContext

    useEffect(() => {
        actualizarCantidad()
        actualizarTotal()
    }, [cantidad])

    const actualizarCantidad = () => {
        const nuevoProducto = {...producto, cantidad: parseInt(cantidad) }
        cantidadProductos(nuevoProducto)
    }

    return ( 
        <div className="md:flex md:justify-between md:items:center mt-5">
            <div className="md:w-3/4 mb-2 md:mb-0">
                <div className="text-sm font-medium text-gray-900">
                    {nombre}
                </div>
                <div className="text-sm text-gray-500">
                    $ {formatearDinero(precio)}
                </div>
            </div>

            <input 
                type="number"
                className="shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border text-indigo-800 rounded md:ml-4"
                placeholder="Cantidad"
                onChange={ e => setCantidad(parseInt(e.target.value)) }
                value={cantidad}
            />
        </div>
    )
}
 
export default ProductoResumen