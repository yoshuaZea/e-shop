import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { useMutation } from '@apollo/client'
import { NUEVO_CLIENTE, OBTENER_CLIENTES } from '../types'

const NuevoCliente = () => {

    // State del componente
    const [alert, setAlert] = useState({ type: 'error', message: ''})

    // Routing
    const router = useRouter()

    // Mutation para crear cliente
    const [ nuevoCliente ] = useMutation(NUEVO_CLIENTE, {
        // Actualizar el caché existente para agregar el nuevo registro
        update(cache, { data: { nuevoCliente } }){
            // Obtener objeto de cache que se desea actualizar
            const { obtenerClientesVendedor } = cache.readQuery({
                query: OBTENER_CLIENTES
            })

            // Reescribir el caché (el caché nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_CLIENTES,
                data: {
                    obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente]
                }
            })
        }
    })

    // Validación del formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            empresa: '',
            puesto: '',
            email: '',
            telefono: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio').min(3, 'Debe contener al menos 3 caracteres'),
            apellido: Yup.string().required('El apellido es obligatorio').min(3, 'Debe contener al menos 3 caracteres'),
            empresa: Yup.string().required('La empresa es obligatoria').min(3, 'Debe contener al menos 3 caracteres'),
            puesto: Yup.string().required('El puesto es obligatorio').min(3, 'Debe contener al menos 3 caracteres'),
            email: Yup.string().email('El correo no es válido').required('El correo es obligatorio'),
            telefono: Yup.number()
        }),
        onSubmit: async valores => {

            const { nombre, apellido, empresa, puesto, email, telefono } = valores

            try {
                const { data } = await nuevoCliente({ 
                    variables: {
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
                    message: `Cliente ${data.nuevoCliente.nombre} registrado exitosamente`
                })

                Swal.fire({
                    icon: 'success',
                    text: `Cliente ${data.nuevoCliente.nombre} registrado exitosamente`,
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
            <h1 className="text-2xl text-indigo-800 font-medium">Nuevo cliente</h1>

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
                            >Nombre</label>
                            <input 
                                type="text"
                                className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                            + (formik.errors.nombre && formik.touched.nombre ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                id="nombre"
                                name="nombre"
                                placeholder="Nombre del cliente"
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
                                className={formik.errors.apellido && formik.touched.apellido ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                htmlFor="apellido"
                            >Apellido</label>
                            <input 
                                type="text"
                                className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                            + (formik.errors.apellido && formik.touched.apellido ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                id="apellido"
                                name="apellido"
                                placeholder="Apellido del cliente"
                                value={formik.values.apellido}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            { 
                                formik.errors.apellido && formik.touched.apellido ? (
                                    <div className="my-2 text-red-500 font-bold">
                                        <p className="text-xs">{formik.errors.apellido}</p>
                                    </div>
                                ) : null
                            }
                        </div>
                        <div className="mb-5">
                            <label 
                                className={formik.errors.empresa && formik.touched.empresa ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                htmlFor="empresa"
                            >Empresa</label>
                            <input 
                                type="text"
                                className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                            + (formik.errors.empresa && formik.touched.empresa ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                id="empresa"
                                name="empresa"
                                placeholder="¿Nombre de la empresa a la que trabaja?"
                                value={formik.values.empresa}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            { 
                                formik.errors.empresa && formik.touched.empresa ? (
                                    <div className="my-2 text-red-500 font-bold">
                                        <p className="text-xs">{formik.errors.empresa}</p>
                                    </div>
                                ) : null
                            }
                        </div>
                        <div className="mb-5">
                            <label 
                                className={formik.errors.puesto && formik.touched.puesto ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                htmlFor="puesto"
                            >Puesto</label>
                            <input 
                                type="text"
                                className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                            + (formik.errors.puesto && formik.touched.puesto ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                id="puesto"
                                name="puesto"
                                placeholder="¿Cuál es el puesto que desempeña?"
                                value={formik.values.puesto}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            { 
                                formik.errors.puesto && formik.touched.puesto ? (
                                    <div className="my-2 text-red-500 font-bold">
                                        <p className="text-xs">{formik.errors.puesto}</p>
                                    </div>
                                ) : null
                            }
                        </div>
                        <div className="mb-5">
                            <label 
                                className={formik.errors.email && formik.touched.email ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                htmlFor="email"
                            >Correo</label>
                            <input 
                                type="text"
                                className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                            + (formik.errors.email && formik.touched.email ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                id="email"
                                name="email"
                                placeholder="Correo del cliente"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            { 
                                formik.errors.email && formik.touched.email ? (
                                    <div className="my-2 text-red-500 font-bold">
                                        <p className="text-xs">{formik.errors.email}</p>
                                    </div>
                                ) : null
                            }
                        </div>
                        <div className="mb-5">
                            <label 
                                className={formik.errors.telefono && formik.touched.telefono ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                htmlFor="telefono"
                            >Teléfono</label>
                            <input 
                                type="text"
                                className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                            + (formik.errors.telefono && formik.touched.telefono ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                id="telefono"
                                name="telefono"
                                placeholder="Teléfono del usuario"
                                value={formik.values.telefono}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            { 
                                formik.errors.telefono && formik.touched.telefono ? (
                                    <div className="my-2 text-red-500 font-bold">
                                        <p className="text-xs">{formik.errors.telefono}</p>
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
 
export default NuevoCliente;