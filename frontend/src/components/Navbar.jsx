import React from 'react'
import NavItem from "./NavItem"
import { RiSunFill } from "react-icons/ri";
import { BsMoonStarsFill } from "react-icons/bs";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { Link } from 'react-router-dom';

export default function Navbar({ theme, toggleTheme }) {
  return (
    <nav className='bg-red-50 sticky top-0'>
      <main className='flex items-center justify-between py-4 px-10 text-xl'>
        <section className='pacifico-regular text-red-600 text-3xl'>
          EduGuard
        </section>
        <section className='flex gap-4'>
          <NavItem to='/'>Home</NavItem>
        </section>
        <section className='flex justify-center items-center gap-10'>
          <button
            onClick={toggleTheme}
            className={`cursor-pointer bg-gray-200 p-2 rounded-md ${theme === "dark" ? 'text-orange-400' : 'text-blue-500'}`}
          >
            {theme === "dark" ? <RiSunFill /> : <BsMoonStarsFill />}
          </button>
          <Link to='/login' className='text-lg'>
            Log in {<FaArrowRightToBracket className='inline' />}
          </Link>
        </section>
      </main>
    </nav>
  )
}
