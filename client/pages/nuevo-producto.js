import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { useMutation } from '@apollo/client'
import { NUEVO_PRODUCTO, OBTENER_PRODUCTOS } from '../types'

const NuevoProducto = () => {

    // State del componente
    const [alert, setAlert] = useState({ type: 'error', message: ''})

    // Routing
    const router = useRouter()

    // Mutation para crear cliente
    const [ nuevoProducto, { error: mutationError } ] = useMutation(NUEVO_PRODUCTO, {
        // Actualizar el caché existente para agregar el nuevo registro
        update(cache, { data: { nuevoCliente } }){
            // Obtener objeto de cache que se desea actualizar
            const { obtenerProductos } = cache.readQuery({
                query: OBTENER_PRODUCTOS
            })

            // Reescribir el caché (el caché nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: [...obtenerProductos, nuevoProducto]
                }
            })
        }
    })

    // Validación del formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            existencia: '',
            precio: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio').min(3, 'Debe contener al menos 3 caracteres'),
            existencia: Yup.number()
                            .typeError('El valor debe ser numérico')
                            .required('Agrega la cantidad disponible')
                            .positive('El valor debe ser positivo')
                            .integer('La existencia debe ser números enteros'),
            precio: Yup.number()
                        .typeError('El valor debe ser numérico')
                        .required('El precio es obligatorio')
                        .positive('El precio debe ser positivo')
        }),
        onSubmit: async valores => {

            const { nombre, existencia, precio } = valores

            try {
                const { data } = await nuevoProducto({ 
                    variables: {
                        input: {
                            nombre,
                            existencia: Number(existencia), 
                            precio: Number(precio)
                        }
                    }
                })

                // Usuario creado exitosamente
                setAlert({
                    type: 'success',
                    message: `Producto ${data.nuevoProducto.nombre} registrado exitosamente`
                })

                Swal.fire({
                    icon: 'success',
                    text: `Producto ${data.nuevoProducto.nombre} registrado exitosamente`,
                    showConfirmButton: false,
                    timer: 3000
                })

                // Redireccionar a login
                setTimeout(() => {
                    router.push('/productos')
                }, 3000)

            } catch (error) {
                setAlert({
                    ...alert,
                    message: error.message
                })
            }
        }
    })

    // Mostrar mensajes
    const showAlert = () => {
        // Eliminar mensaje
        setTimeout(() => {
            setAlert({ type: 'error', message: '' })
        }, 3500)

        if(alert.type == 'success'){
            return (
                <div className="border-l-4 border-green-500 bg-green-100 px-4 py-2 text-green-700 shadow-sm">
                    <p className="text-sm text-center font-medium">{ alert.message }</p>
                </div>
            )
        } else {
            return (
                <div className="border-l-4 border-red-500 bg-red-100 px-4 py-2 text-red-500 shadow-sm">
                    <p className="text-sm text-center font-medium">{ alert.message }</p>
                </div>
            )
        }
    }

    return ( 
        <Layout>
            <h1 className="text-2xl text-indigo-800 font-medium">Nuevo producto</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                        className="bg-white rounded shadow-md px-8 py-6"
                        onSubmit={formik.handleSubmit}
                        autoComplete="off"
                    >
                        <div className="mb-5">
                            <label 
                                className={formik.errors.nombre && formik.touched.nombre ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                htmlFor="nombre"
                            >Producto</label>
                            <input 
                                type="text"
                                className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                            + (formik.errors.nombre && formik.touched.nombre ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                id="nombre"
                                name="nombre"
                                placeholder="Nombre del producto"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            { 
                                formik.errors.nombre && formik.touched.nombre ? (
                                    <div className="my-2 text-red-500 font-bold">
                                        <p className="text-xs">{formik.errors.nombre}</p>
                                    </div>
                                ) : null
                            }
                        </div>
                        <div className="mb-5">
                            <label 
                                className={formik.errors.existencia && formik.touched.existencia ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                htmlFor="existencia"
                            >¿Cuántos hay en existencia?</label>
                            <input 
                                type="text"
                                className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                            + (formik.errors.existencia && formik.touched.existencia ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                id="existencia"
                                name="existencia"
                                placeholder="10, 20, 30.."
                                value={formik.values.existencia}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            { 
                                formik.errors.existencia && formik.touched.existencia ? (
                                    <div className="my-2 text-red-500 font-bold">
                                        <p className="text-xs">{formik.errors.existencia}</p>
                                    </div>
                                ) : null
                            }
                        </div>
                        <div className="mb-5">
                            <label 
                                className={formik.errors.precio && formik.touched.precio ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                htmlFor="precio"
                            >$ Precio</label>
                            <input 
                                type="text"
                                className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                            + (formik.errors.precio && formik.touched.precio ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                id="precio"
                                name="precio"
                                placeholder="$ 120,000.00"
                                value={formik.values.precio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            { 
                                formik.errors.precio && formik.touched.precio ? (
                                    <div className="my-2 text-red-500 font-bold">
                                        <p className="text-xs">{formik.errors.precio}</p>
                                    </div>
                                ) : null
                            }
                        </div>
                        
                        { alert.message && showAlert() }

                        <input 
                            type="submit"
                            className="rounded bg-indigo-800 w-full mt-5 p-2 text-white uppercase hover:bg-indigo-900 cursor-pointer focus:outline-none focus:shadow-outline disabled:opacity-50"
                            value="Guardar"
                            disabled={alert.message && 'disabled'}
                        />
                    </form>
                </div>
            </div>
        </Layout>
    )
}
 
export default NuevoProducto;