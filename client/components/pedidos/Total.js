import React, { useContext } from 'react'
import PedidoContext from '../../context/pedidos/PedidoContext'
import { formatearDinero } from '../../helpers'

const Total = () => {

    // Utilizar el context, funciones y valores
    const { total } = useContext(PedidoContext)

    return ( 
        <div className="flex items-center mt-5 justify-between bg-indigo-100 border-l-4 border-indigo-800 text-indigo-700 p-2 text-sm font-bold rounded-r">
            <h2 className="text-indigo-800 text-lg">Total a pagar:</h2>
            <p className="text-indigo-800 text-lg">$ { formatearDinero(total) }</p>
        </div>
    )
}
 
export default Total