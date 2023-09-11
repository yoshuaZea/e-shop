// Modelos
const Usuario = require('../models/Usuario')
const Producto = require('../models/Producto')
const Cliente = require('../models/Cliente')
const Pedido = require('../models/Pedido')

// Librerías
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' })

const crearToken = (usuario, secret_key, expiresIn) => {

    const { id, nombre, apellido, email } = usuario

    return jwt.sign({
        id, nombre, apellido, email
    },
        secret_key,
        {
            expiresIn
        }
    )
}

// Resolvers (always an object)
// el ctx es como la sesión donde se aloja los datos de usuario autenticado
const resolvers = {
    Query: {
        obtenerUsuario: async (_, {}, ctx) => {
            return ctx.usuario
        },
        obtenerProductos: async () => {
            try {
                const productos = await Producto.find({ 
                    existencia: { $gt: 0 }
                })

                return productos

            } catch (error) {
                console.log(error)
                throw new Error('Hubo un problema al consultar los productos')
            }
        },
        obtenerProducto: async (_, { id }) => {
            // Revisar si existe
            const producto = await Producto.findById(id)

            if(!producto){
                throw new Error('Producto no encontrado')
            } 

            return producto
        },
        obtenerClientes: async () => {
            try {
                const clientes = await Cliente.find({})

                return clientes

            } catch (error) {
                console.log(error)
                throw new Error('Hubo un problema al consultar los clientes')
            }
        },
        obtenerClientesVendedor: async (_, { },  ctx) => {
            try {
                const vendedor_id = ctx.usuario.id

                const clientes = await Cliente.find({ vendedor_id })

                return clientes

            } catch (error) {
                console.log(error)
                throw new Error('Hubo un problema al consultar los clientes por vendedor')
            }
        },
        obtenerCliente: async (_, { id }, ctx) => {
            // Revisar si existe
            const cliente = await Cliente.findById(id)

            if(!cliente){
                throw new Error('Cliente no encontrado')
            }

            // Quien lo creó puede verlo
            if(cliente.vendedor_id.toString() !== ctx.usuario.id){
                throw new Error('No tienes permiso para ver este cliente')
            }

            return cliente
        },
        obtenerPedidos: async () => {
            try {
                const pedidos = await Pedido.find({})
                                            .populate({
                                                path: 'cliente_id',
                                                model: 'Cliente',
                                                select: ['nombre', 'apellido', 'empresa', 'email', 'telefono']
                                            })
                                            .populate({
                                                path: 'pedido.id',
                                                model: 'Producto',
                                                select: ['nombre', 'precio']
                                            })

                // Ajustar articulos porque se hizo mal la relación del modelo de Pedido con productos
                pedidos.forEach(pedido => {
                    pedido.pedido = pedido.pedido.map(articulo => {
                        return {
                        id: articulo.id._id,
                        nombre: articulo.id.nombre,
                        precio: articulo.id.precio,
                        cantidad: articulo.cantidad
                        }
                    })
                })

                return pedidos

            } catch (error) {
                console.log(error)
                throw new Error('Hubo un problema al consultar los pedidos')
            }
        },
        obtenerPedidosVendedor: async (_, { },  ctx) => {
            try {
                const vendedor_id = ctx.usuario.id

                const pedidosVendedor = await Pedido.find({ vendedor_id })
                                            .populate({
                                                path: 'cliente_id',
                                                model: 'Cliente',
                                                select: ['nombre', 'apellido', 'empresa', 'email', 'telefono']
                                            })
                                            .populate({
                                                path: 'pedido.id',
                                                model: 'Producto',
                                                select: ['nombre', 'precio']
                                            })

                // Ajustar articulos porque se hizo mal la relación del modelo de Pedido con productos
                pedidosVendedor.forEach(pedido => {
                    pedido.pedido = pedido.pedido.map(articulo => {
                        return {
                            id: articulo.id._id,
                            nombre: articulo.id.nombre,
                            precio: articulo.id.precio,
                            cantidad: articulo.cantidad
                        }
                    })                    

                    // console.log(pedido.pedido)
                })

                return pedidosVendedor

            } catch (error) {
                console.log(error)
                throw new Error('Hubo un problema al consultar los pedidos por vendedor')
            }
        },
        obtenerPedido: async (_, { id }, ctx) => {
            // Revisar si existe
            const pedido = await Pedido.findById(id)

            if(!pedido){
                throw new Error('Pedido no encontrado')
            }

            // Quien lo creó puede verlo
            if(pedido.vendedor_id.toString() !== ctx.usuario.id){
                throw new Error('No tienes permiso para ver este pedido')
            }

            return pedido
        },
        obtenerPedidosEstado: async (_, { estado }, ctx) => {
            try {
                const vendedor_id = ctx.usuario.id

                const pedidos = await Pedido.find({ vendedor_id, estado })

                return pedidos

            } catch (error) {
                console.log(error)
                throw new Error('Hubo un problema al consultar los pedidos por estado del vendedor')
            }
        },
        mejoresClientes: async () => {
            const clientes = await Pedido.aggregate([
                { $match: { estado: 'COMPLETADO' } },
                { $group: {
                    _id: '$cliente_id', // Nombre del modelo o campo con relación
                    total: { $sum: '$total' } 
                }}, {
                    // Relación con otra colección
                    $lookup: {
                        from: 'clientes',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'cliente'
                    }
                }, {
                    $sort: { total: -1 } // Ordenar descendente
                }, {
                    $limit: 10
                }
            ])

            return clientes
        },
        mejoresVendedores: async () => {
            const vendedores = await Pedido.aggregate([
                { 
                    $match: { estado: 'COMPLETADO' } 
                }, { 
                    $group: {
                        _id: '$vendedor_id', // Nombre del modelo o campo con relación
                        total: { $sum: '$total' } 
                    }
                }, {
                    // Relación con otra colección
                    $lookup: {
                        from: 'usuarios', 
                        localField: '_id',
                        foreignField: '_id',
                        as: 'vendedor'
                    }
                }, {
                    $sort: { total: -1 } // Ordenar descendente
                }, {
                    $limit: 5
                }
            ])

            return vendedores
        },
        buscarProducto: async (_, { texto }) => {
            const productos = await Producto.find({ 
                $text: { $search: texto },
            }).limit(10)

            return productos
        }
    },
    Mutation: {
        nuevoUsuario: async (_, { input } ) => {

            const { email, password } = input

            // Revisar si el usuario ya está registrado
            const existe = await Usuario.findOne({ email })

            if(existe){
                throw new Error(`El email ${email} ya está registrado`)
            }

            // Hashear password
            const salt = await bcryptjs.genSalt(10)
            input.password = await bcryptjs.hash(password, salt)

            // Guardar en la base de datos
            try {
                const usuario = new Usuario(input)
                usuario.save()

                return usuario

            } catch (error) {
                console.log(error)
                throw new Error('Hubo un problema al crear un nuevo usuario')
            }
        },
        autenticarUsuario: async (_, { input }) => {

            const { email, password } = input

            // Revisar si existe
            const usuario = await Usuario.findOne({ email })

            if(!usuario){
                throw new Error(`El email ${email} no se encuentra registrado`)
            }

            // Revisar si el password es correcto
            const passwordOk = await bcryptjs.compare(password, usuario.password)

            if(!passwordOk){
                throw new Error(`El usuario y/o contraseña son incorrectos`)
            }

            // Crear el token JWT
            return {
                token: crearToken(usuario, process.env.SECRET_KEY, '24h')
            }

        },
        nuevoProducto: async (_, { input }, ctx) => {
            try {
                // Crear producto
                const producto = new Producto(input)

                // Asignar usuario
                producto.usuario_id = ctx.usuario.id

                // Guardarlos en la BD
                const resultado = await producto.save()

                return resultado

            } catch (error) {
                throw new Error('Hubo un problema al crear el producto')
            }
        },
        actualizarProducto: async (_, { id , input }) => {
            // Revisar si existe
            let producto = await Producto.findById(id)

            if(!producto){
                throw new Error('Producto no encontrado')
            }

            // Guardar cambios
            producto = await Producto.findOneAndUpdate({
                _id: id
            }, {
                nombre: input.nombre,
                existencia: input.existencia,
                precio: input.precio,
                modificado: Date.now()
            }, {
                new: true
            })

            return producto
        },
        eliminarProducto: async (_, { id }) => {
            // Revisar si existe
            const producto = await Producto.findById(id)

            if(!producto){
                throw new Error('Producto no encontrado')
            }

            // Eliminar producto
            await Producto.findOneAndDelete({ _id: id })

            return 'Producto eliminado'
        },
        nuevoCliente: async (_, { input }, ctx) => {
            const { email } = input

            // Revisar si el cliente ya está registrado
            const existe = await Cliente.findOne({ email })

            if(existe){
                throw new Error(`El cliente con email ${email} ya está registrado`)
            }

            // Guardar en la base de datos
            try {
                const cliente = new Cliente(input)

                // Asignar vendedor
                cliente.vendedor_id = ctx.usuario.id

                // Guardar cambios
                cliente.save()

                return cliente

            } catch (error) {
                console.log(error)
                throw new Error('Hubo un problema al crear el cliente')
            }
        },
        actualizarCliente: async (_, { id , input }, ctx) => {
            // Revisar si existe
            let cliente = await Cliente.findById(id)

            if(!cliente){
                throw new Error('Cliente no encontrado')
            }

            // Verificar si el vendedor es quien edita
            if(cliente.vendedor_id.toString() !== ctx.usuario.id){
                throw new Error('No tienes permiso para actualizar este cliente')
            }

            // Guardar cambios
            cliente = await Cliente.findOneAndUpdate({
                _id: id
            }, {
                nombre: input.nombre,
                apellido: input.apellido,
                empresa: input.empresa,
                puesto: input.puesto,
                email: input.email,
                telefono: input.telefono || '',
                modificado: Date.now()
            }, {
                new: true
            })

            return cliente
        },
        eliminarCliente: async(_, { id }, ctx) => {
            // Revisar si existe
            const cliente = await Cliente.findById(id)

            if(!cliente){
                throw new Error('Cliente no encontrado')
            }

            // Verificar si el vendedor es quien elimina
            if(cliente.vendedor_id.toString() !== ctx.usuario.id){
                throw new Error('No tienes permiso para eliminar este cliente')
            }

            // Eliminar cliente
            await Cliente.findOneAndDelete({ _id: id })

            return 'Cliente eliminado'
        },
        nuevoPedido: async(_, { input }, ctx) => {
            const { cliente_id } = input

            // Verificar si existe cliente
            const cliente = await Cliente.findById(cliente_id)
            if(!cliente){
                throw new Error('Cliente no encontrado')
            }

            // Verificar si el cliente es del vendedor
            if(cliente.vendedor_id.toString() !== ctx.usuario.id){
                throw new Error('No tienes permiso para venderle a este cliente')
            }

            // Verificar que el stock esté disponible
            for await (const articulo of input.pedido){
                const { id } = articulo
                const producto = await Producto.findById(id)

                if(articulo.cantidad > producto.existencia){
                    throw new Error(`El producto ${producto.nombre} excede la cantidad disponible`)
                } else {
                    // Restar la cantidad a lo disponible
                    producto.existencia = producto.existencia - articulo.cantidad
                    await producto.save()
                }
            }
            
            // Crear nuevo pedido
            const nuevoPedido = new Pedido(input)

            // Asignar el vendedor
            nuevoPedido.vendedor_id = ctx.usuario.id

            // Guardarlo en la base de datos
            await nuevoPedido.save()

            return nuevoPedido
        },
        actualizarPedido: async (_, { id , input }, ctx) => {
            const { cliente_id, pedido } = input

            // Revisar si existe pedido
            let existePedido = await Pedido.findById(id)

            if(!existePedido){
                throw new Error('Pedido no encontrado')
            }

            // Quien lo creó puede verlo
            if(existePedido.vendedor_id.toString() !== ctx.usuario.id){
                throw new Error('No tienes permiso para actualizar este pedido')
            }

            // Verificar si existe cliente
            const cliente = await Cliente.findById(cliente_id)
            if(!cliente){
                throw new Error('Cliente no encontrado')
            }

            // Verificar si el cliente es del vendedor
            if(cliente.vendedor_id.toString() !== ctx.usuario.id){
                throw new Error('No tienes permiso para venderle a este cliente')
            }

            // Verificar que el stock esté disponible
            if(pedido){
                for await (const articulo of pedido){
                    const { id } = articulo
                    const producto = await Producto.findById(id)
    
                    if(articulo.cantidad > producto.existencia){
                        throw new Error(`El producto ${producto.nombre} excede la cantidad disponible`)
                    } else {
                        // Restar la cantidad a lo disponible
                        producto.existencia = producto.existencia - articulo.cantidad
                        await producto.save()
                    }
                }
            }

            // Guardar cambios
            const pedidoActualizado = await Pedido.findOneAndUpdate({
                _id: id
            }, {
                pedido: existePedido.pedido,
                total: existePedido. total,
                cliente_id: input.cliente_id,
                estado: input.estado,
                modificado: Date.now()
            }, {
                new: true
            })

            return pedidoActualizado
        },
        eliminarPedido: async(_, { id }, ctx) => {
            // Revisar si existe
            const pedido = await Pedido.findById(id)

            if(!pedido){
                throw new Error('Pedido no encontrado')
            }

            // Verificar si el vendedor es quien elimina
            if(pedido.vendedor_id.toString() !== ctx.usuario.id){
                throw new Error('No tienes permiso para eliminar este pedido')
            }

            // Eliminar cliente
            await Pedido.findOneAndDelete({ _id: id })

            return 'Pedido eliminado'
        }
    }
}

module.exports = resolvers