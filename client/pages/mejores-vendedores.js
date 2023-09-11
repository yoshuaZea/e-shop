import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useQuery } from '@apollo/client'
import { MEJORES_VENDEDORES } from '../types'
import { useRouter } from 'next/router'

const MejoresVendedores = () => {
    // Utilizar mutation
    const { client, data, loading, error, startPolling, stopPolling } = useQuery(MEJORES_VENDEDORES)

    /* 
        Con startPolling se crea como un websocket directo con Apollo Server, para que cuando haya un cambio este lo reciba y 
        renderice el componente

        Con stopPolling se detiene la ejecución simultanea
    */

    useEffect(() => {
        // Tiempo real vuelve a consultar la base de datos
        startPolling(1000)

        // Limpia
        return () => {
            stopPolling()
        }

    }, [startPolling, stopPolling])    

    // console.log(data.mejoresVendedores)

    if(loading) return <Spinner text="Cargando gráfica..." />
    
    // Construir objeto 
    const vendedorGrafica = []

    data.mejoresVendedores.map((vendedor, index) => {
        vendedorGrafica[index] = {
            ...vendedor.vendedor[0],
            total: vendedor.total
        }
    })

    return (
        <Layout>
            {
                loading ? (
                    <>
                        <Spinner text="Cargando gráfica..." />
                    </>
                ) : (
                    <>
                        <div className="flex flex-row justify-between">
                            <h1 className="text-2xl text-indigo-800 font-medium">Mejores vendedores</h1>
                        </div>
                        <ResponsiveContainer
                            width={'99%'}
                            height={650}
                        >
                            <BarChart
                                className="mt-10"
                                width={600}
                                height={400}
                                data={vendedorGrafica}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="nombre" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="total" fill="#3730a3" />
                            </BarChart>
                        </ResponsiveContainer>
                    </>
                )
            }
        </Layout>
    )
}
 
export default MejoresVendedores;