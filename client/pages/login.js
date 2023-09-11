import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'

// Apollo para querys
import { useMutation } from '@apollo/client'
import { AUTENTICAR } from '../types'

const Login = () => {

    // State del componente
    const [alert, setAlert] = useState({ type: 'error', message: ''})

    useEffect(() => {
        localStorage.removeItem('token_crm')
    }, [])

    // Mutation para autenticar usuario
    const [ autenticarUsuario ] = useMutation(AUTENTICAR)

    // Routing
    const router = useRouter()

    // Validación del formulario
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('El correo no es válido').required('El correo es obligatorio'),
            password: Yup.string().required('El password es obligatorio').min(6, 'Debe contener al menos 6 caracteres'),
        }),
        onSubmit: async valores => {

            const { email, password } = valores

            try {
                const { data } = await autenticarUsuario({ 
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                })

                // Usuario autenticado exitosamente
                setAlert({
                    type: 'success',
                    message: `Autenticando...`
                })

                setTimeout(() => {
                    // Guardar token
                    localStorage.setItem('token_crm', data.autenticarUsuario.token)
                }, 1000)

                // Redireccionar a login
                setTimeout(() => {
                    router.push('/')
                }, 2000)

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
            <h1 className="text-center text-2xl text-indigo-800 font-bold">Login</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-sm">
                    <form
                        className="bg-white rounded shadow-md px-8 py-6"
                        onSubmit={formik.handleSubmit}
                        autoComplete="off"
                    >
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
                            value="Iniciar sesión"
                            disabled={alert.message && 'disabled'}
                        />
                    </form>
                </div>
            </div>
        </Layout>
    )
}
 
export default Login