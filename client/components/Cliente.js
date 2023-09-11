import React from 'react'
import moment from 'moment'
import 'moment/locale/es'
import Swal from 'sweetalert2'
import Router from 'next/router'
import { useMutation, gql } from '@apollo/client'
import { ELIMINAR_CLIENTE, OBTENER_CLIENTES } from '../types'

const Cliente = ({ cliente }) => {

    // Destructuring
    const { id, nombre, apellido, email, empresa, puesto, creado } = cliente

    // Mutation para eliminar cliente
    const [ eliminarCliente ] = useMutation(ELIMINAR_CLIENTE, {
        // Actualizar el caché existente para agregar el nuevo registro
        update(cache){
            // Obtener objeto de cache que se desea actualizar
            const { obtenerClientesVendedor } = cache.readQuery({
                query: OBTENER_CLIENTES
            })

            // Reescribir el caché (el caché nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_CLIENTES,
                data: {
                    obtenerClientesVendedor: obtenerClientesVendedor.filter(cliente => cliente.id !== id)
                }
            })
        }
    })

    // Eliminar cliente
    const borrarCliente = id => {
        Swal.fire({
            title: '¿Deseas eliminar este cliente?',
            text: "Un cliente eliminado no se puede recuperar",
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
                    const { data } = await eliminarCliente({
                        variables: {
                            id
                        }
                    })

                    // Mostrar alerta
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarCliente,
                        'success'
                    )
                } catch (error) {
                    console.log(error)
                }
            }
          })
    }

    // Editar cliente
    const editarCliente = id => {
        Router.push({
            pathname: '/editar-cliente/[id]',
            query: { id }
        })
    }

    // Imagenes random
    const imagenes = [
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
        'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
        'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
        'https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
    ]

    const indexRandom = Math.ceil(Math.random(0, imagenes.length) * 5) - 1

    return ( 
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={imagenes[indexRandom]} alt="" />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {nombre} {apellido}
                        </div>
                        <div className="text-sm text-gray-500">
                            {email}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{empresa}</div>
                <div className="text-sm text-gray-500">{puesto}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                    Active
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Hace { moment.duration(moment() - creado).humanize() }
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a 
                    className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                    onClick={ () => editarCliente (id) }
                ><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </a>
                <a 
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={ () => borrarCliente(id) }
                ><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </a>
            </td>
        </tr>
    )
}
 
export default Cliente;