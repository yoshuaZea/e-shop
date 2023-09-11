import React, { useReducer } from 'react'
import PedidoContext from './PedidoContext'
import PedidoReducer from './PedidoReducer'

import {
    SELECCIONAR_CLIENTE,
    SELECCIONAR_PRODUCTO,
    CANTIDAD_PRODUCTO,
    ACTUALIZAR_TOTAL
} from '../../types/pedidos'

const PedidoState = ({ children }) => {

    // State de pedido
    const initialState = {
        cliente: {},
        productos: [],
        total: 0
    }

    // Utilizar el reducer
    const [ state, dispatch ] = useReducer(PedidoReducer, initialState)

    
    // FUNCIONES
    const agregarCliente = cliente => {
        dispatch({
            type: SELECCIONAR_CLIENTE,
            payload: cliente
        })
    }

    const agregarProducto = productosSleccionados => {

        // Validar si existe un producto y tiene atributo cantidad para no eliminarlo
        let nuevoState
        if(state.productos.length > 0){
            // Tomar del segundo arreglo, una copia para asignarlo al primero
            nuevoState = productosSleccionados.map(producto => {
                const nuevoObjeto = state.productos.find(productoState => productoState.id === producto.id)

                return {
                    ...producto,
                    ...nuevoObjeto
                }
            })

        } else {
            nuevoState = productosSleccionados
        }

        dispatch({
            type: SELECCIONAR_PRODUCTO,
            payload: nuevoState
        })
    }

    // Modificar las cantidades de los productos
    const cantidadProductos = nuevoProducto => {
        dispatch({
            type: CANTIDAD_PRODUCTO,
            payload: nuevoProducto
        })
    }

    // Actualizar total
    const actualizarTotal = () => {
        dispatch({
            type: ACTUALIZAR_TOTAL
        })
    }

    return (
        <PedidoContext.Provider
            value={{
                cliente: state.cliente,
                productos: state.productos,
                total: state.total,
                agregarCliente,
                agregarProducto,
                cantidadProductos,
                actualizarTotal
            }}
        >
            {children}
        </PedidoContext.Provider>
    )
}

export default PedidoState