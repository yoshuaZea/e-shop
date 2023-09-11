// Apollo para querys
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { OBTENER_CLIENTES } from '../types'

// Components
import Spinner from '../components/Spinner'
import Cliente from '../components/Cliente'

// Components
import Layout from '../components/Layout'

export default function Home() {

    // Routing next
    const router = useRouter()

    // Consulta de Apollo
    const { client, data, loading, error } = useQuery(OBTENER_CLIENTES)

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
                        <Spinner text="Cargando clientes..." />
                    </>
                ) : (
                    <>
                        <div className="flex flex-col justify-center items-center sm:flex-row sm:justify-between">
                            <h1 className="text-2xl text-indigo-800 font-medium">Clientes</h1>
                            <Link href="/nuevo-cliente">
                                <a className="bg-indigo-800 hover:bg-indigo-900 font-bold uppercase text-xs text-white rounded py-1 px-2 shadow-md focus:outline-none focus:shadow-none self-center lg:w-auto">Nuevo cliente</a>
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
                                                        Nombre
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Empresa
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Antigüedad
                                                    </th>
                                                    <th scope="col" className="relative px-6 py-3">
                                                        <span className="sr-only">Edit</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {
                                                    data.obtenerClientesVendedor.map(cliente => (
                                                        <Cliente 
                                                            key={cliente.id}
                                                            cliente={cliente}
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