import React, { useContext } from 'react'
import PedidoContext from '../../context/pedidos/PedidoContext'
import ProductoResumen from './ProductoResumen'

const ResumenPedido = () => {
    // Context de pedidos
    const pedidoContext = useContext(PedidoContext)
    const { productos } = pedidoContext

    return ( 
        <>
            <p className="mt-10 my-2 bg-indigo-100 border-l-4 border-indigo-800 text-indigo-700 p-2 text-sm font-bold rounded-r">
                3. Ajusta las cantidades de cada producto
            </p>

            { 
                productos.length > 0 ? (
                    productos.map(producto => (
                        <ProductoResumen 
                            key={producto.id}
                            producto={producto}
                        />
                    ))
                ) : (
                    <p className="mt-5 text-sm text-center text-indigo-800"> Aún no hay productos</p>
                )
            }
        </>
    )
}
 
export default ResumenPedido