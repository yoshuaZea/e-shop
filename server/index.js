const { ApolloServer } = require('apollo-server')
const typeDefs = require('./db/schemas')
const resolvers = require('./db/resolvers')
const connectDB = require('./config/db')
const jwt = require('jsonwebtoken')
const cors = require('cors')
require('dotenv').config({ path: '.env' })

/** TERMINOLOGÍA GRAPHQL
 * Se define en 4 claves importantes para entender y comprender su funcionamiento:
 * 
 * Query - Permite leer los registros, forma de extraer la información existente desde la BD, equivalente a un SELECT de SQL o un GET de una REST API
 *      INPUT - Parametros que recibe para el query
 * 
 * Mutation - Se utiliza para Actualizar, Eliminar y Crear registros, equivalente a un UPDATE, DELETE, CREATE de SQL o un POST, PUT/PATCH, DELETE de una REST API
 * 
 * Schema - Describe los tipos de objetos, querys y datos de la aplicación, forma de los datos, debe ser similar a la estructura de la BD
 * 
 * Resolver - Se encarga de la comunicación entre el servidor y la base de datos, funciones que son responsables de retornar los valores que existen en el Schema, 
 * las funciones que van relacionadas con el schema (los nombren entre schema y resolver deben ser iguales) * 
 */

// Conectar a la base de datos de mongo
connectDB()

// Definir un dominio(s) para las peticiones en un arreglo
const whiteList = process.env.FRONTEND_URL.split(', ');

// Opciones de CORS para dar acceso o no a los endpoint
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true

    // origin: (origin, callback) => {
    //     // Revisar si la petición viene de un servidor que está en whiteList
    //     const existe = whiteList.some(dominio => dominio === origin);

    //     if(existe){
    //         callback(null, true);
    //     } else {
    //         callback(new Error('No permitido por CORS'), false);
    //     }
    // },
    // methods: "GET,POST"
}

// Crear el servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    cors: corsOptions, // Habilitar CORS
    context: ({ req }) => {
        const token = req.headers['authorization'] || ''

        if(token){
            try {
                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY)

                return {
                    usuario
                }
            } catch (error) {
                // console.log('Error al validar JWT')
                // console.log(error.message)
                throw new Error('Error al validar token - ' + error.message)
            }
        }
    }
})

// Iniciar el servidor
server.listen().then( ({ url }) => {
    console.log(`Servidor ejecutándose en la URL ${url}`)
})