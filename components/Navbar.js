"use client"
import React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"

const Navbar = () => {
    const { data: session } = useSession()
    const [showdropdown, setShowdropdown] = useState(false)

    return (
        <nav style={{ backgroundImage: 'linear-gradient(90deg,rgba(6, 22, 33, 1) 0%, rgba(7, 22, 34, 1) 50%, rgba(8, 23, 34, 1) 100%)' }} className='text-white flex justify-between items-center px-4 py-5 flex-col md:flex-row '>
            <div className="logo font-bold gap-2 text-2xl md:text-lg flex justify-center items-center">
                <img className='w-10 md:w-8' src="/tea.gif"  alt="" />
                <Link href={"/"}>
                    <span>GetMeAChai!</span>
                </Link>
            </div>
            {/* <ul className="flex justify-between gap-5">
                <li>Home</li>
                <li>About</li>
                <li>Projects</li>
                <li>Sign Up</li>
                <li>Login</li>
            </ul> */}

            <div className='flex gap-2 relative'>
                {session && <>
                    <button onClick={() => { setShowdropdown(!showdropdown) }} onBlur={() => {
                        setTimeout(() => {
                            setShowdropdown(false)
                        }, 100)
                    }} id="dropdownDelayButton" data-dropdown-toggle="dropdownDelay" data-dropdown-delay="500" data-dropdown-trigger="hover" className="bg-blue-800 cursor-pointer rounded-lg inline-flex items-center justify-center text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none" type="button">
                        Welcome {session.user.email}
                        <svg className="w-4 h-4 ms-1.5 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" /></svg>
                    </button>


                    <div id="dropdownDelay" className={`z-10 ${showdropdown ? "" : "hidden"} absolute left-[83px] top-[50px] bg-slate-700 rounded-lg border border-default-medium rounded-base shadow-lg w-44 `}>
                        <ul className="p-2 text-sm text-body font-medium" aria-labelledby="dropdownDelayButton">
                            <li>
                                <Link href="/dashboard" className="inline-flex hover:bg-slate-500 items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Dashboard</Link>
                            </li>
                            <li>
                                <Link href={`/${session?.user?.email
                                    ? session.user.email.split('@')[0] : ''}`} className="inline-flex hover:bg-slate-500 items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">You Page</Link>
                            </li>

                            <li>
                                <Link onClick={() => { signOut() }} href="#" className="inline-flex hover:bg-slate-500 items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Sign out</Link>
                            </li>
                        </ul>
                    </div></>
                }

                {session &&
                    <button className='text-white cursor-pointer bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-md text-sm px-4 py-2.5 text-center leading-5' onClick={() => { signOut() }}>Logout</button>
                }
                {!session &&
                    <Link href={"/login"}>
                        <button className='text-white cursor-pointer bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-md text-sm px-4 py-2.5 text-center leading-5' >Login</button>
                    </Link>
                }
            </div>
        </nav>
    )
}

export default Navbar
