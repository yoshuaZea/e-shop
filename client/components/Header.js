import React from 'react'
import { useQuery, gql } from '@apollo/client'
import Spinner from './Spinner'
import { useRouter } from 'next/router'

const OBTENER_USUARIO = gql`
    query obtenerUsuario{
        obtenerUsuario{
            nombre
            apellido
            email
        }
    }
`
const Header = () => {      
    // Query apollo
    const { client, data, loading, error } = useQuery(OBTENER_USUARIO)
    
    // Routing next
    const router = useRouter()

    // Proteger que no accedamos a data antes de tener resultados
    if(loading) return <Spinner />

    // Si no hay información
    if(!data.obtenerUsuario){
        return router.push('/login')
    }

    // Cerrar sesión del usuario
    const cerrarSesion = () => {
        client.clearStore() // Limpiar la caché de apollo
        localStorage.removeItem('token_crm')
        router.push('/login')
    }

    const { nombre } = data.obtenerUsuario

    return (
        <div className="sm:flex sm:justify-between mb-6">
            <p className="text-indigo-800 font-normal mb-5 lg:mb-0">Hola {nombre}</p>
            <button
                type="button"
                className="bg-indigo-800 hover:bg-indigo-900 w-full sm:w-auto font-bold uppercase text-xs text-white rounded py-1 px-2 shadow-md focus:outline-none focus:shadow-none"
                onClick={cerrarSesion}
            >Cerrar sesión</button>
        </div>
    )
}
 
export default Header