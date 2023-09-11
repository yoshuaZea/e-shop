import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Sidebar = () => {

    // Routing de next
    const router = useRouter()

    return ( 
        <aside className="bg-indigo-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5">
            <div>
                <p className="font-bold text-white text-2xl">
                    CRM :: Admin
                </p>
            </div>

            <nav className="mt-10 list-none">
                <li className={router.pathname == '/' ? 'bg-indigo-400 px-3 py-2 rounded' : 'px-3 py-2 rounded' } >
                    <Link href="/">
                        <a className="text-white block">Clientes</a>
                    </Link>
                </li>
                <li className={router.pathname == '/pedidos' ? 'bg-indigo-400 px-3 py-2 rounded' : 'px-3 py-2 rounded' }>
                    <Link href="/pedidos">
                        <a className="text-white block">Pedidos</a>
                    </Link>
                </li>
                <li className={router.pathname == '/productos' ? 'bg-indigo-400 px-3 py-2 rounded' : 'px-3 py-2 rounded' }>
                    <Link href="/productos">
                        <a className="text-white block">Productos</a>
                    </Link>
                </li>
            </nav>

            <div className="mt-10">
                <p className="text-white text-2xl font-bold">Otras opciones</p>
            </div>

            <nav className="mt-3 list-none">
                <li className={router.pathname == '/mejores-vendedores' ? 'bg-indigo-400 px-3 py-2 rounded' : 'px-3 py-2 rounded' } >
                    <Link href="/mejores-vendedores">
                        <a className="text-white block">Mejores vendedores</a>
                    </Link>
                </li>
                <li className={router.pathname == '/mejores-clientes' ? 'bg-indigo-400 px-3 py-2 rounded' : 'px-3 py-2 rounded' }>
                    <Link href="/mejores-clientes">
                        <a className="text-white block">Mejores clientes</a>
                    </Link>
                </li>
            </nav>
        </aside>
    )
}
 
export default Sidebar