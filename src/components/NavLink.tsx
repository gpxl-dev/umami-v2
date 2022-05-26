import React from 'react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import type { ReactNode } from 'react'

type Props = {
  className?: string;
  activeClassName?: string;
  children: ReactNode;
  to: string;
};

export default function NavLink({
  activeClassName,
  className,
  children,
  to,
}: Props) {
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: true })

  return (
    <Link to={to} className={`${className} ${match ? activeClassName : ''}`}>
      {children}
    </Link>
  )
}
