import React from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import Pedido from '../components/Pedido'
import { useQuery } from '@apollo/client'
import { OBTENER_PEDIDOS_VENDEDOR } from '../types'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Pedidos = () => {

    // Query para produtos
    const { client, data, loading, error } = useQuery(OBTENER_PEDIDOS_VENDEDOR)

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
                    <Spinner text="Cargando pedidos..." />
                </>
            ) : (
                <>
                    <div className="flex flex-col justify-center items-center sm:flex-row sm:justify-between">
                            <h1 className="text-2xl text-indigo-800 font-medium">Pedidos</h1>
                            <Link href="/nuevo-pedido">
                                <a className="bg-indigo-800 hover:bg-indigo-900 font-bold uppercase text-xs text-white rounded py-1 px-2 shadow-md focus:outline-none focus:shadow-none self-center lg:w-auto">Nuevo pedido</a>
                            </Link>
                        </div>

                    <div className="flex flex-col mt-10">
                        {
                            data.obtenerPedidosVendedor.length > 0 ? (
                                data.obtenerPedidosVendedor.map(pedido => (
                                    <Pedido 
                                        key={pedido.id}
                                        detallesPedido={pedido}
                                    />
                                ))
                            ) : (
                                <div className="bg-white text-center text-indigo-800 py-5 text-sm">Aún no tienes ningún pedido</div>
                            )
                        }
                    </div>
                </>
            )
        }
    </Layout>
    )
}
 
export default Pedidos