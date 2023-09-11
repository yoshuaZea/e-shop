import React from 'react'
import moment from 'moment'
import 'moment/locale/es'
import Swal from 'sweetalert2'
import { formatearDinero } from '../helpers'
import { useMutation } from '@apollo/client'
import Router from 'next/router'
import { ELIMINAR_PRODUCTO, OBTENER_PRODUCTOS} from '../types'

const Producto = ({ producto }) => {

    const { id, nombre, precio, existencia, creado, modificado } = producto

    // Mutation para eliminar
    const [ eliminarProducto ] = useMutation(ELIMINAR_PRODUCTO, {
        // Actualizar el caché existente para agregar el nuevo registro
        update(cache){
            // Obtener objeto de cache que se desea actualizar
            const { obtenerProductos } = cache.readQuery({
                query: OBTENER_PRODUCTOS
            })

            // Reescribir el caché (el caché nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: obtenerProductos.filter(producto => producto.id !== id)
                }
            })
        }
    })

    // Eliminar producto
    const borrarProducto = id => {
        Swal.fire({
            title: '¿Deseas eliminar este producto?',
            text: "Un producto eliminado no se puede recuperar",
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
                    const { data } = await eliminarProducto({
                        variables: {
                            id
                        }
                    })

                    // Mostrar alerta
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarProducto,
                        'success'
                    )
                } catch (error) {
                    console.log(error)
                }
            }
          })
    }

    // Editar producto
    const editarProducto = id => {
        Router.push({
            pathname: '/editar-producto/[id]',
            query: { id }
        })
    }

    return ( 
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            SKU: { id }
                        </div>
                        <div className="text-sm text-gray-500">
                            {nombre}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">$ { formatearDinero(precio) }</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-left">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                    { existencia }
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="text-sm font-medium text-gray-900">
                    Creado el { moment(creado, 'x').format('DD [de] MMMM [de] YYYY') }
                </div>
                <div className="text-sm text-gray-500">
                    Modificado hace { moment.duration(moment() - modificado).humanize() }
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a 
                    className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                    onClick={ () => editarProducto (id) }
                ><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </a>
                <a 
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={ () => borrarProducto(id) }
                ><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </a>
            </td>
        </tr>
    )
}
 
export default Producto