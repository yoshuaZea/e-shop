import React from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import Producto from '../components/Producto'
import { useQuery } from '@apollo/client'
import { OBTENER_PRODUCTOS } from '../types'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Productos = () => {

    // Query para produtos
    const { client, data, loading, error } = useQuery(OBTENER_PRODUCTOS)

    // Routing next
    const router = useRouter()

    // Proteger que no accedamos a data antes de tener resultados
    if(loading) return <Spinner />
    
    // Si no hay respuesta
    if(!data){
        client.clearStore()
        router.push('/login')
        return <Spinner />
    }

    return (
        <Layout>
        {
            loading ? (
                <>
                    <Spinner text="Cargando productos..." />
                </>
            ) : (
                <>
                    <div className="flex flex-col justify-center items-center sm:flex-row sm:justify-between">
                        <h1 className="text-2xl text-indigo-800 font-medium">Productos</h1>
                        <Link href="/nuevo-producto">
                            <a className="bg-indigo-800 hover:bg-indigo-900 font-bold uppercase text-xs text-white rounded py-1 px-2 shadow-md focus:outline-none focus:shadow-none self-center lg:w-auto">Nuevo producto</a>
                        </Link>
                    </div>

                    <div className="flex flex-col mt-10">
                        <div className="-my-2 overflow-x-auto">
                            <div className="py-2 align-middle inline-block min-w-full">
                                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Producto
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Precio
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Existencia
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fechas
                                                </th>
                                                <th scope="col" className="relative px-6 py-3">
                                                    <span className="sr-only">Edit</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {
                                                data.obtenerProductos.map(producto => (
                                                    <Producto 
                                                        key={producto.id}
                                                        producto={producto}
                                                    />
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    </Layout>
    )
}
 
export default Productos;