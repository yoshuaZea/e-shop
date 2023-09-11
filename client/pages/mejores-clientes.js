import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useQuery } from '@apollo/client'
import { MEJORES_CLIENTES } from '../types'

const MejoresClientes = () => {
    // Utilizar mutation
    const { data, loading, error, startPolling, stopPolling } = useQuery(MEJORES_CLIENTES)

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

    if(loading) return <Spinner text="Cargando gráfica..." />

    // Construir objeto 
    const clienteGrafica = []

    data.mejoresClientes.map((cliente, index) => {
        clienteGrafica[index] = {
            ...cliente.cliente[0],
            total: cliente.total
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
                            <h1 className="text-2xl text-indigo-800 font-medium">Mejores clientes</h1>
                        </div>
                        <ResponsiveContainer
                            width={'99%'}
                            height={650}
                        >
                            <BarChart
                                className="mt-10"
                                width={600}
                                height={400}
                                data={clienteGrafica}
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
 
export default MejoresClientes;