import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'

// Apollo para querys
import { useMutation } from '@apollo/client'
import { NUEVACUENTA } from '../types'

const NuevaCuenta = () => {

    // Query para GraphQL
    // const { data, loading, error } = useQuery(QUERY)
    // console.log(data, loading, error)

    // Mutation para crear nuevos usuarios
    const [ nuevoUsuario ] = useMutation(NUEVACUENTA)

    // State del componente
    const [alert, setAlert] = useState({ type: 'error', message: ''})

    // Routing
    const router = useRouter()

    // Validación del formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio').min(3, 'Debe contener al menos 3 caracteres'),
            apellido: Yup.string().required('El apellido es obligatorio').min(3, 'Debe contener al menos 3 caracteres'),
            email: Yup.string().email('El correo no es válido').required('El correo es obligatorio'),
            password: Yup.string().required('El password es obligatorio').min(6, 'Debe contener al menos 6 caracteres'),
        }),
        onSubmit: async valores => {

            const { nombre, apellido, email, password } = valores

            try {
                const { data } = await nuevoUsuario({ 
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            password
                        }
                    }
                })

                // Usuario creado exitosamente
                setAlert({
                    type: 'success',
                    message: `Usuario ${data.nuevoUsuario.nombre} creado exitosamente`
                })

                // Redireccionar a login
                setTimeout(() => {
                    router.push('/login')
                }, 3500)

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
            // Eliminar valor del email
            formik.values.email = ''

            return (
                <div className="border-l-4 border-red-500 bg-red-100 px-4 py-2 text-red-500 shadow-sm">
                    <p className="text-sm text-center font-medium">{ alert.message }</p>
                </div>
            )
        }
    }

    return ( 
        <Layout>
            <h1 className="text-center text-2xl text-indigo-800 font-bold">Crear nueva cuenta</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-sm">
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
                                placeholder="Nombre del usuario"
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
                                placeholder="Apellido del usuario"
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
                                className={formik.errors.email && formik.touched.email ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                htmlFor="email"
                            >Correo</label>
                            <input 
                                type="text"
                                className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                            + (formik.errors.email && formik.touched.email ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                id="email"
                                name="email"
                                placeholder="Correo del usuario"
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
                                className={formik.errors.password && formik.touched.password ? 'block text-red-500 text-sm font-bold mb-2' : 'block text-indigo-800 text-sm font-bold mb-2'}
                                htmlFor="password"
                            >Contraseña</label>
                            <input 
                                type="password"
                                className={'shadow appereance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ' 
                                            + (formik.errors.password && formik.touched.password ? 'bg-red-100 border-l-4 border-red-500 text-red-700 placeholder-red-700 rounded-r' : 'border text-indigo-800 rounded')}
                                id="password"
                                name="password"
                                placeholder="Apellido del usuario"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            { 
                                formik.errors.password && formik.touched.password ? (
                                    <div className="my-2 text-red-500 font-bold">
                                        <p className="text-xs">{formik.errors.password}</p>
                                    </div>
                                ) : null
                            }
                        </div>

                        { alert.message && showAlert() }

                        <input 
                            type="submit"
                            className="rounded bg-indigo-800 w-full mt-5 p-2 text-white uppercase hover:bg-indigo-900 cursor-pointer focus:outline-none focus:shadow-outline disabled:opacity-50"
                            value="Registrar"
                            disabled={alert.message && 'disabled'}
                        />
                    </form>
                </div>
            </div>
        </Layout>
    )
}
 
export default NuevaCuenta