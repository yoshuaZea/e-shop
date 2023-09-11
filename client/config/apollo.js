import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'node-fetch'

// Para autneticación y modificar headers
import { setContext } from 'apollo-link-context'

// Crear enlace a donde conectarse
const httpLink = new createHttpLink({
    uri: 'https://api-tienda.api-byte.com/',
    fetch
})

// Permitir modificar los headers para authorization
const authLink = setContext((_, { headers }) => {

    // Leer el storage para el token
    const token = localStorage.getItem('token_crm')

    return {
        headers: {
            ...headers,
            'authorization' : token ? `Bearer ${token}` : '' 
        }
    }
})

// HttpLink permite conectarse al servidor apollo
// InMemoryCache para manejar el cache

const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
})

export default client