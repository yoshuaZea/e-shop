import React, { useState, useEffect, useContext } from 'react'
import Layout from '../components/Layout'
import AsignarCliente from '../components/pedidos/AsignarCliente'
import AsignarProductos from '../components/pedidos/AsignarProductos'
import ResumenPedido from '../components/pedidos/ResumenPedido'
import Total from '../components/pedidos/Total'
import PedidoContext from '../context/pedidos/PedidoContext'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { useMutation } from '@apollo/client'
import { NUEVO_PEDIDO, OBTENER_PEDIDOS_VENDEDOR } from '../types'

const NuevoPedido = () => {

    // State del componente
    const [alert, setAlert] = useState({ type: 'error', message: ''})

    // Utilizar el context, funciones y valores
    const pedidoContext = useContext(PedidoContext)
    const { cliente, productos, total } = pedidoContext
    
    // Mutation para crear pedido
    const [ nuevoPedido ] = useMutation(NUEVO_PEDIDO, {
        // Actualizar el caché existente para agregar el nuevo registro
        update(cache, { data: { nuevoPedido } }) {
            // Obtener objeto de cache que se desea actualizar
            const { obtenerPedidosVendedor } = cache.readQuery({
                query: OBTENER_PEDIDOS_VENDEDOR
            })

            // Reescribir el caché (el caché nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_PEDIDOS_VENDEDOR,
                data: {
                    obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido]
                }
            })
        }
    })
    
    // Routing
    const router = useRouter()

    // Validar pedido
    const validarPedido = () => {
        return !productos.every(producto => producto.cantidad > 0) || total === 0 || cliente.length === 0 ? ' opacity-50 cursor-not-allowed ' : '' 
    }

    const validarPedidoForm = e => {
        e.preventDefault()

        const validacion = !productos.every(producto => producto.cantidad > 0) || total === 0 || cliente.length === 0 ? false : true 

        if(validacion){
            crearNuevoPedido()
        } else {

        }
    }

    // Función para crear nuevo producto
    const crearNuevoPedido = async () => {
        // Eliminar atributos de un objeto
        const pedido2 = productos.map(( { existencia, nombre, precio, ...producto } ) => producto)

        //  Crear un nuevo objeto
        const pedido = productos.map(producto => {
            return { 
                        id: producto.id, 
                        cantidad: producto.cantidad
                    }
        })

        const { id } = cliente

        try {

            const { data } = await nuevoPedido({ 
                variables: {
                    input: {
                        cliente_id: id,
                        total,
                        pedido,
                        estado: "PENDIENTE"
                    }
                }
            })

            // Usuario creado exitosamente
            setAlert({
                type: 'success',
                message: `Pedido registrado exitosamente`
            })

            Swal.fire({
                icon: 'success',
                text: `Pedido registrado exitosamente`,
                showConfirmButton: false,
                timer: 3000
            })

            // Redireccionar a login
            setTimeout(() => {
                router.push('/pedidos')
            }, 3000)

        } catch (error) {
            setAlert({
                ...alert,
                message: error.message
            })
        }
    }

    // Mostrar mensajes
    const showAlert = () => {
        // Eliminar mensaje
        setTimeout(() => {
            setAlert({ type: 'error', message: '' })
        }, 3500)

        if(alert.type == 'success'){
            return (
                <div className="border-l-4 mt-5 border-green-500 bg-green-100 px-4 py-2 text-green-700 shadow-sm">
                    <p className="text-sm text-center font-medium">{ alert.message }</p>
                </div>
            )
        } else {
            return (
                <div className="border-l-4 mt-5 border-red-500 bg-red-100 px-4 py-2 text-red-500 shadow-sm">
                    <p className="text-sm text-center font-medium">{ alert.message }</p>
                </div>
            )
        }
    }

    return ( 
        <Layout>
            <h1 className="text-2xl text-indigo-800 font-medium mb-4">Nuevo pedido</h1>

            <div className="flex justify-center">
                <div className="w-full max-w-lg">
                    <form
                        className="bg-white rounded shadow-md px-8 py-6"
                        autoComplete="off"
                        onSubmit={ validarPedidoForm }
                    >   

                        <AsignarCliente />

                        <AsignarProductos />

                        <ResumenPedido />          

                        <Total />              

                        { alert.message && showAlert() }

                        <button 
                            type="submit"
                            className={`rounded bg-indigo-800 w-full mt-5 p-2 text-white uppercase hover:bg-indigo-900 cursor-pointer focus:outline-none focus:shadow-outline disabled:opacity-50 ${validarPedido()}`}
                            disabled={ (alert.message && 'disabled')}
                            // onClick={ () => crearNuevoPedido() }
                        >Registrar pedido</button>
                    </form>
                </div>
            </div>
        </Layout>
    )
}
 
export default NuevoPedido;