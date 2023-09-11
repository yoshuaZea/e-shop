import React, { useState } from 'react'
import Layout from '../../components/Layout'
import Spinner from '../../components/Spinner';
import { useRouter } from 'next/router'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { useQuery, useMutation } from '@apollo/client'
import { OBTENER_PRODUCTO, ACTUALIZAR_PRODUCTO } from '../../types'

const EditarProducto = () => {

    // State del componente
    const [alert, setAlert] = useState({ type: 'error', message: ''})

    // Routing
    const router = useRouter()
    const { query: { id } } = router

    // Query para obtener producto
    const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id
        }
    })

    // Mutation para actualizar producto
    const [ actualizarProducto ] = useMutation(ACTUALIZAR_PRODUCTO)

    // Schema de validación
    const schemaValidation = Yup.object({
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
    })

    // Actualizar el producto
    const actualizarInfoProducto = async valores => {
        const { nombre, existencia, precio } = valores

        try {
            const { data } = await actualizarProducto({ 
                variables: {
                    id,
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
                message: `Producto ${data.actualizarProducto.nombre} actualizado exitosamente`
            })

            Swal.fire({
                icon: 'success',
                text: `Producto ${data.actualizarProducto.nombre} actualizado exitosamente`,
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

    if(loading) return <Spinner text="Cargando datos del producot..."/>

    return ( 
        <Layout>
            <h1 className="text-2xl text-indigo-800 font-medium">Actualizar producto</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={schemaValidation}
                        enableReinitialize
                        initialValues={ data.obtenerProducto }
                        onSubmit={ (valores, funciones) => {
                            actualizarInfoProducto(valores)
                        }}
                    >
                        { props => {
                            return (
                                <form
                                    className="bg-white rounded shadow-md px-8 py-6"
                                    onSubmit={props.handleSubmit}
                                    autoComplete="off"
                                >
                                    <div className="mb-5">
                                        <label 
                                            className={props.errors.nombre && props.touched.nombre ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                            htmlFor="nombre"
                                        >Producto</label>
                                        <input 
                                            type="text"
                                            className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                                        + (props.errors.nombre && props.touched.nombre ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                            id="nombre"
                                            name="nombre"
                                            placeholder="Nombre del producto"
                                            value={props.values.nombre}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        { 
                                            props.errors.nombre && props.touched.nombre ? (
                                                <div className="my-2 text-red-500 font-bold">
                                                    <p className="text-xs">{props.errors.nombre}</p>
                                                </div>
                                            ) : null
                                        }
                                    </div>
                                    <div className="mb-5">
                                        <label 
                                            className={props.errors.existencia && props.touched.existencia ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                            htmlFor="existencia"
                                        >¿Cuántos hay en existencia?</label>
                                        <input 
                                            type="text"
                                            className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                                        + (props.errors.existencia && props.touched.existencia ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                            id="existencia"
                                            name="existencia"
                                            placeholder="10, 20, 30.."
                                            value={props.values.existencia}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        { 
                                            props.errors.existencia && props.touched.existencia ? (
                                                <div className="my-2 text-red-500 font-bold">
                                                    <p className="text-xs">{props.errors.existencia}</p>
                                                </div>
                                            ) : null
                                        }
                                    </div>
                                    <div className="mb-5">
                                        <label 
                                            className={props.errors.precio && props.touched.precio ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                            htmlFor="precio"
                                        >$ Precio</label>
                                        <input 
                                            type="text"
                                            className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                                        + (props.errors.precio && props.touched.precio ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                            id="precio"
                                            name="precio"
                                            placeholder="$ 120,000.00"
                                            value={props.values.precio}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        { 
                                            props.errors.precio && props.touched.precio ? (
                                                <div className="my-2 text-red-500 font-bold">
                                                    <p className="text-xs">{props.errors.precio}</p>
                                                </div>
                                            ) : null
                                        }
                                    </div>
                                    
                                    { alert.message && showAlert() }

                                    <input 
                                        type="submit"
                                        className="rounded bg-indigo-800 w-full mt-5 p-2 text-white uppercase hover:bg-indigo-900 cursor-pointer focus:outline-none focus:shadow-outline disabled:opacity-50"
                                        value="Actualizar"
                                        disabled={alert.message && 'disabled'}
                                    />
                                </form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </Layout>
    )
}
 
export default EditarProducto;