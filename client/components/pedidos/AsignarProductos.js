import React, { useState, useEffect, useContext } from 'react'
import PedidoContext from '../../context/pedidos/PedidoContext'
import Spinner from '../Spinner'
import Select from 'react-select'
import { useQuery } from '@apollo/client'
import { OBTENER_PRODUCTOS_PEDIDO } from '../../types'

const AsignarProductos = () => {
    // State dle componente
    const [productos, setProductos] = useState([])

    // Context de pedidos
    const pedidoContext = useContext(PedidoContext)
    const { agregarProducto, actualizarTotal } = pedidoContext

    useEffect(() => {
        agregarProducto(productos)
        actualizarTotal()
    }, [productos])

    // Query para obtener mis productos
    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS_PEDIDO)

    // Seleccionar productos
    const seleccionarProducto = productos => {
        setProductos(productos)
    }
   
    if(loading) return <Spinner text="Cargando productos..." />

    const { obtenerProductos } = data

    return (
        <>
            <p className="mt-10 my-2 bg-indigo-100 border-l-4 border-indigo-800 text-indigo-700 p-2 text-sm font-bold rounded-r">
                2. Selecciona uno o varios productos
            </p>
            <Select 
                options={ obtenerProductos }
                isMulti={true}
                onChange={ productos => seleccionarProducto(productos) }
                getOptionValue={ opciones => opciones.id }
                getOptionLabel={ opciones => `${opciones.nombre} - (${opciones.existencia} disponibles)` }
                placeholder="Selecciona uno o varios artículos..."
                noOptionsMessage={ () => 'Sin resultados' }
            />
        </>
    )
}
 
export default AsignarProductos