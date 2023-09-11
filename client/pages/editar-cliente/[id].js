import React, { useState } from 'react'
import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';
import { useRouter } from 'next/router'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'

// Apollo y types
import { useMutation, useQuery } from '@apollo/client'
import { ACTUALIZAR_CLIENTE, OBTENER_CLIENTE } from '../../types'

const EditarCliente = () => {

    // State del componente
    const [alert, setAlert] = useState({ type: 'error', message: ''})

    // Routing next
    const router = useRouter()
    const { query: { id } } = router

    // Query para obtener cliente
    const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
        variables: {
            id
        }
    })

    // Schema de validación
    const schemaValidation = Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio').min(3, 'Debe contener al menos 3 caracteres'),
            apellido: Yup.string().required('El apellido es obligatorio').min(3, 'Debe contener al menos 3 caracteres'),
            empresa: Yup.string().required('La empresa es obligatoria').min(3, 'Debe contener al menos 3 caracteres'),
            puesto: Yup.string().required('El puesto es obligatorio').min(3, 'Debe contener al menos 3 caracteres'),
            email: Yup.string().email('El correo no es válido').required('El correo es obligatorio'),
            telefono: Yup.number()
    })

    // Mutation para actualizar cliente
    const [ actualizarCliente ] = useMutation(ACTUALIZAR_CLIENTE)

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

    // Modificar cliente en base de datos
    const actualizarInfoCliente = async valores => {
        const { nombre, apellido, empresa, puesto, email, telefono } = valores

        try {
            const { data } = await actualizarCliente({ 
                variables: {
                    id,
                    input: {
                        nombre,
                        apellido,
                        empresa,
                        puesto,
                        email,
                        telefono
                    }
                }
            })

            // Usuario creado exitosamente
            setAlert({
                type: 'success',
                message: `Cliente ${data.actualizarCliente.nombre} actualizado exitosamente`
            })

            Swal.fire({
                icon: 'success',
                text: `Cliente ${data.actualizarCliente.nombre} actualizado exitosamente`,
                showConfirmButton: false,
                timer: 3000
            })

            // Redireccionar a login
            setTimeout(() => {
                router.push('/')
            }, 3000)

        } catch (error) {
            setAlert({
                ...alert,
                message: error.message
            })
        }
    }

    if(loading) return <Spinner text="Cargando datos del cliente..."/>

    return ( 
        <Layout>
            <h1 className="text-2xl text-indigo-800 font-medium">Actualizar cliente</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={schemaValidation}
                        enableReinitialize
                        initialValues={ data.obtenerCliente }
                        onSubmit={ (valores, funciones) => {
                            actualizarInfoCliente(valores)
                        }}
                    >
                        { props => {

                            // console.log(props)

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
                                            >Nombre</label>
                                            <input 
                                                type="text"
                                                className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                                            + (props.errors.nombre && props.touched.nombre ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                                id="nombre"
                                                name="nombre"
                                                placeholder="Nombre del cliente"
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
                                                className={props.errors.apellido && props.touched.apellido ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                                htmlFor="apellido"
                                            >Apellido</label>
                                            <input 
                                                type="text"
                                                className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                                            + (props.errors.apellido && props.touched.apellido ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                                id="apellido"
                                                name="apellido"
                                                placeholder="Apellido del cliente"
                                                value={props.values.apellido}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            />
                                            { 
                                                props.errors.apellido && props.touched.apellido ? (
                                                    <div className="my-2 text-red-500 font-bold">
                                                        <p className="text-xs">{props.errors.apellido}</p>
                                                    </div>
                                                ) : null
                                            }
                                        </div>
                                        <div className="mb-5">
                                            <label 
                                                className={props.errors.empresa && props.touched.empresa ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                                htmlFor="empresa"
                                            >Empresa</label>
                                            <input 
                                                type="text"
                                                className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                                            + (props.errors.empresa && props.touched.empresa ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                                id="empresa"
                                                name="empresa"
                                                placeholder="¿Nombre de la empresa a la que trabaja?"
                                                value={props.values.empresa}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            />
                                            { 
                                                props.errors.empresa && props.touched.empresa ? (
                                                    <div className="my-2 text-red-500 font-bold">
                                                        <p className="text-xs">{props.errors.empresa}</p>
                                                    </div>
                                                ) : null
                                            }
                                        </div>
                                        <div className="mb-5">
                                            <label 
                                                className={props.errors.puesto && props.touched.puesto ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                                htmlFor="puesto"
                                            >Puesto</label>
                                            <input 
                                                type="text"
                                                className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                                            + (props.errors.puesto && props.touched.puesto ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                                id="puesto"
                                                name="puesto"
                                                placeholder="¿Cuál es el puesto que desempeña?"
                                                value={props.values.puesto}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            />
                                            { 
                                                props.errors.puesto && props.touched.puesto ? (
                                                    <div className="my-2 text-red-500 font-bold">
                                                        <p className="text-xs">{props.errors.puesto}</p>
                                                    </div>
                                                ) : null
                                            }
                                        </div>
                                        <div className="mb-5">
                                            <label 
                                                className={props.errors.email && props.touched.email ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                                htmlFor="email"
                                            >Correo</label>
                                            <input 
                                                type="text"
                                                className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                                            + (props.errors.email && props.touched.email ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                                id="email"
                                                name="email"
                                                placeholder="Correo del cliente"
                                                value={props.values.email}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            />
                                            { 
                                                props.errors.email && props.touched.email ? (
                                                    <div className="my-2 text-red-500 font-bold">
                                                        <p className="text-xs">{props.errors.email}</p>
                                                    </div>
                                                ) : null
                                            }
                                        </div>
                                        <div className="mb-5">
                                            <label 
                                                className={props.errors.telefono && props.touched.telefono ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                                htmlFor="telefono"
                                            >Teléfono</label>
                                            <input 
                                                type="text"
                                                className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                                            + (props.errors.telefono && props.touched.telefono ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                                id="telefono"
                                                name="telefono"
                                                placeholder="Teléfono del usuario"
                                                value={props.values.telefono || ''}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            />
                                            { 
                                                props.errors.telefono && props.touched.telefono ? (
                                                    <div className="my-2 text-red-500 font-bold">
                                                        <p className="text-xs">{props.errors.telefono}</p>
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
 
export default EditarCliente;