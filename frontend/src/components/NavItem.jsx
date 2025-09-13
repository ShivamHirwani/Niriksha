import React from 'react'
import { NavLink } from 'react-router-dom'

export default function NavItem({to, children}) {
  return (
    <NavLink
        to={to}
        className={({isActive}) => 
            `py-1 px-2 border-b-3 transition-colors duration-200
             ${isActive 
                ? "border-red-600 text-red-600" 
                : "border-transparent hover:border-red-400 hover:text-red-500"}
            `
        }
    >
        {children}
    </NavLink>
  );
}
