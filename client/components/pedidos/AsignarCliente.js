import React, { useState, useEffect, useContext } from 'react'
import PedidoContext from '../../context/pedidos/PedidoContext'
import Spinner from '../Spinner'
import Select from 'react-select'
import { useQuery } from '@apollo/client'
import { OBTENER_CLIENTES } from '../../types'

const AsignarCliente = () => {
    // State dle componente
    const [cliente, setCliente] = useState([])

    // Context de pedidos
    const pedidoContext = useContext(PedidoContext)
    const { agregarCliente } = pedidoContext

    useEffect(() => {
        agregarCliente(cliente)
    }, [cliente])

    // Query para obtener mis clientes
    const { data, loading, error } = useQuery(OBTENER_CLIENTES)

    // Seleccionar cliente
    const seleccionarCliente = cliente => {
        setCliente(cliente)
    }
   
    if(loading) return <Spinner text="Cargando clientes..." />

    const { obtenerClientesVendedor } = data

    return (
        <>
            <p className="mt-10 my-2 bg-indigo-100 border-l-4 border-indigo-800 text-indigo-700 p-2 text-sm font-bold rounded-r">
                1. Selecciona un cliente para el pedido
            </p>
            <Select 
                options={ obtenerClientesVendedor }
                onChange={ cliente => seleccionarCliente(cliente) }
                getOptionValue={ opciones => opciones.id }
                getOptionLabel={ opciones => `${opciones.nombre} ${opciones.apellido}` }
                placeholder="Selecciona uno o varios artículos..."
                noOptionsMessage={ () => 'Sin resultados' }
            />
        </>
    )
}
 
export default AsignarCliente