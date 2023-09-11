import { gql } from '@apollo/client'

// AUTENTICACIÓN Y LOGIN
export const AUTENTICAR = gql`
    mutation autenticarUsuario($input: AutenticarInput) {
        autenticarUsuario(input: $input){
            token
        }
    }
`

export const NUEVACUENTA = gql`
    mutation nuevoUsuario($input: UsuarioInput) {
        nuevoUsuario(input: $input){
            id,
            nombre,
            apellido,
            email
        }
    }
`

// CLIENTES
export const OBTENER_CLIENTES = gql`
    query obtenerClientesVendedor {
        obtenerClientesVendedor {
            id
            nombre
            apellido
            email
            empresa
            puesto
            creado
        }
    }
`

export const NUEVO_CLIENTE = gql`
    mutation nuevoCliente($input: ClienteInput){
        nuevoCliente(input: $input){
            id
            nombre
            apellido
            empresa
            puesto
            email
            telefono
        }
    }
`

export const ELIMINAR_CLIENTE = gql`
    mutation eliminarCliente($id: ID!){
        eliminarCliente(id: $id)
    } 
`

export const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput){
        actualizarCliente(id: $id, input: $input){
            id, nombre, apellido, empresa, puesto, email, telefono
        }
    }
`

export const OBTENER_CLIENTE = gql`
    query obtenerCliente($id: ID!){
        obtenerCliente(id: $id){
            id,
            nombre,
            apellido,
            empresa,
            puesto
            email,
            telefono
        }
    }
`

// PRODUCTOS
export const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
        obtenerProductos {
            id
            nombre
            precio
            existencia
            creado
            modificado
        }
    }
`

export const OBTENER_PRODUCTOS_PEDIDO = gql`
    query obtenerProductos {
        obtenerProductos {
            id
            nombre
            precio
            existencia
        }
    }
`

export const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!) {
        obtenerProducto(id: $id) {
            id,
            nombre,
            precio,
            existencia
        }
    }
`

export const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput){
        nuevoProducto(input: $input){
            id,
            nombre,
            existencia,
            precio, 
            creado,
            modificado
        }
    }
`

export const ELIMINAR_PRODUCTO = gql`
    mutation eliminarProducto($id: ID!){
        eliminarProducto(id: $id)
    }
`

export const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput){
        actualizarProducto(id: $id, input: $input){
            id
            nombre
            precio
            existencia
            creado
            modificado
        }
    }
`

// PEDIDOS
export const OBTENER_PEDIDOS = gql`
    query obtenerPedidos {
        obtenerPedidos {
            id
            pedido {
                id
                cantidad
                nombre
                precio
            }
            cliente_id {
                id
                nombre
                apellido
                empresa
                email
                telefono      
            } 
            total
            estado
        }
    }
`

export const OBTENER_PEDIDOS_VENDEDOR = gql`
    query obtenerPedidosVendedor {
        obtenerPedidosVendedor {
            id
            pedido {
                id
                cantidad
                nombre
                precio
            }
            cliente_id {
                id
                nombre
                apellido
                empresa
                email
                telefono      
            } 
            total
            estado
        }
    }
`

export const NUEVO_PEDIDO = gql`
    mutation nuevoPedido($input: PedidoInput){
        nuevoPedido(input: $input){
            id, 
            pedido {
              id
            },
            vendedor_id
            total, 
            creado
          }
    }
`

export const ACTUALIZAR_PEDIDO = gql`
    mutation actualizarPedido($id: ID!, $input: PedidoInput){
        actualizarPedido(id: $id, input: $input){
            id, estado
        }
    }
`

export const ELIMINAR_PEDIDO = gql`
    mutation eliminarPedido($id: ID!){
        eliminarPedido(id: $id)
    }
`

// GRÁFICAS
export const MEJORES_VENDEDORES = gql`
    query mejoresVendedores {
        mejoresVendedores {
            vendedor {
                nombre
                email
            }
            total
        }
    }
`

export const MEJORES_CLIENTES = gql`
    query mejoresClientes {
        mejoresClientes {
            cliente{
              apellido
              nombre,
              empresa
            }
            total
          }
    }
`