import React, { useState, useEffect } from 'react'
import { formatearDinero } from '../helpers'
import { useMutation } from '@apollo/client'
import { ACTUALIZAR_PEDIDO, ELIMINAR_PEDIDO, OBTENER_PEDIDOS_VENDEDOR } from '../types'
import Swal from 'sweetalert2'

const Pedido = ({ detallesPedido }) => {

    // Destructuring
    const { id, cliente_id, cliente_id: { nombre, apellido, email, empresa, telefono } , total, estado, pedido } = detallesPedido

    // State del componente
    const [estadoPedido, setEstadoPedido] = useState(estado)
    const [clase, setClase] = useState('')
    const [alert, setAlert] = useState({ type: 'error', message: ''})

    // Mutation para actualizar el pedido
    const [ actualizarPedido ] = useMutation(ACTUALIZAR_PEDIDO)
    const [ eliminarPedido ] = useMutation(ELIMINAR_PEDIDO, {
        update(cache){
            // Obtener de caché los datos 
            const { obtenerPedidosVendedor } = cache.readQuery({
                query: OBTENER_PEDIDOS_VENDEDOR
            })

            // Reescribir
            cache.writeQuery({
                query: OBTENER_PEDIDOS_VENDEDOR,
                data: {
                    obtenerPedidosVendedor: obtenerPedidosVendedor.filter(pedido => pedido.id !== id)
                }
            })
        }
    })

    useEffect(() => {
        if(estadoPedido){
            setEstadoPedido(estadoPedido)
        }
        clasePedido()
    }, [estadoPedido])

    // Función que modifica el color de acuerdo con su estado
    const clasePedido = () => {
        if(estadoPedido === 'PENDIENTE'){
            setClase('border-yellow-500')
        } else if(estadoPedido === 'COMPLETADO') {
            setClase('border-green-500')
        } else {
            setClase('border-red-800')
        }
    }

    const cambiarEstadoPedido = async nuevoEstado => {
        try {

            const { data } = await actualizarPedido({
                variables: {
                    id,
                    input: {
                        estado: nuevoEstado,
                        cliente_id: cliente_id.id
                    }
                }
            })

            setEstadoPedido(data.actualizarPedido.estado)

            Swal.fire({
                icon: 'success',
                text: `Estado de pedido actualizado`,
                showConfirmButton: false,
                timer: 3000
            })
            
        } catch (error) {
            setAlert({
                ...alert,
                message: error.message
            })
        }
    }

    const eliminarPedidoIndividual = id => {
        Swal.fire({
            title: '¿Deseas eliminar este pedido?',
            text: "Un pedido eliminado no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3730a3',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Si, elimínalo!',
            cancelButtonText: 'Cancelar'
          }).then(async (result) => {
              if (result.isConfirmed) {
                try {

                    // Eliminar por id
                    const { data } = await eliminarPedido({
                        variables: {
                            id
                        }
                    })

                    // Mostrar alerta
                    Swal.fire({
                        title: 'Eliminado!',
                        icon: 'success',
                        text: data.eliminarPedido,
                        showConfirmButton: false,
                        timer: 3000
                    })
                    
                } catch (error) {
                    setAlert({
                        ...alert,
                        message: error.message
                    })
                }
            }
          })
    }

    // Mostrar mensajes
    const showAlert = () => {
        // Eliminar mensaje
        setTimeout(() => {
            setAlert({ type: 'error', message: '' })
        }, 3500)

        if(alert.type == 'success'){
            return (
                <div className="col-span-2 border-l-4 mt-5 border-green-500 bg-green-100 px-4 py-2 text-green-700 shadow-sm">
                    <p className="text-sm text-center font-medium">{ alert.message }</p>
                </div>
            )
        } else {
            return (
                <div className="col-span-2 border-l-4 mt-5 border-red-500 bg-red-100 px-4 py-2 text-red-500 shadow-sm">
                    <p className="text-sm text-center font-medium">{ alert.message }</p>
                </div>
            )
        }
    }

    return (
        <div className={`${clase} border-t-4 bg-white rounded-lg p-6 md:grid md:grid-cols-2 md:gap-4 shadow-md mb-7`}>

            { alert.message && showAlert() }

            <h2 className="text-indigo-800 font-bold col-span-2">Pedido: { id }</h2>
            <div>
                <h2 className="font-bold text-indigo-800">Cliente: { nombre } { apellido } </h2>

                <div className="mt-4">
                    {
                        email && 
                        <p className="text-sm text-gray-900 font-medium flex row items-center mb-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="pl-2">{ email }</span>
                        </p>
                    }
                    {
                        telefono && 
                        <p className="text-sm text-gray-900 font-medium flex row items-center mb-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="pl-2">{ telefono }</span>
                        </p>
                    }
                    {
                        empresa && 
                        <p className="text-sm text-gray-900 font-medium flex row items-center mb-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="pl-2">{ empresa }</span>
                        </p>
                    }
                </div>
                
                <p className=" text-indigo-800 font-bold mt-5">Estado del pedido:</p>

                <select
                    className="mt-2 appearance-none bg-indigo-100 border border-indigo-100 text-indigo-800 p-2 text-center rounded leading-tight focus:outline-none focus:bg-indigo-200 focus:border-indigo-100 uppercase text-sm font-bold"
                    defaultValue={estadoPedido}
                    onChange={ e => cambiarEstadoPedido(e.target.value) }
                >
                    <option value="COMPLETADO">COMPLETADO</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CANCELADO">CANCELADO</option>
                </select>
            </div>
            <div>
                <h2 className="text-indigo-800 font-bold">Resumen del pedido</h2>

                {
                    pedido.map(articulo => (
                        <div className="mt-4" key={articulo.id}>
                            <p className="text-sm text-gray-900 font-medium">Producto: { articulo.nombre }</p>
                            <p className="text-sm text-gray-500">Precio: $ { formatearDinero(articulo.precio) }</p>
                            <p className="text-sm text-gray-500">Cantidad: { articulo.cantidad }</p>
                        </div>
                    ))
                }

                <p className="text-gray-900 mt-3 font-bold">
                    Total a pagar: 
                    <span className="font-light text-gray-500"> $ { formatearDinero(total) }</span>
                </p>

                <button
                    className="flex items-center mt-4 bg-red-800 px-5 py-2 text-white rounded leading-tight uppercase text-xs font-bold focus:outline-none shadow-md"
                    onClick={ () => eliminarPedidoIndividual(id) }
                ><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Eliminar</button>

            </div>
        </div>
    )
}
 
export default Pedido