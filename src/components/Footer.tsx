import React from 'react'
import { Link } from 'react-router-dom'

import SocialLinks from './SocialLinks'

export default function Footer() {
  const currentYear = React.useMemo(() => {
    return new Date().getFullYear()
  }, [])

  return (
    <div className="bg-black min-h-[50vh] w-full py-20">
      <div className="text-white">
        <SocialLinks />
      </div>

      <div className="m-auto max-w-4xl w-full px-4 mt-8 text-white">
        <div className="w-full flex justify-center">
          <Link to="/app" className="cursor-pointer">
            <strong className="font-display tracking-[0.5rem] text-lg uppercase">
              Umami
            </strong>
          </Link>
        </div>
      </div>

      <div className="mt-12 text-xs uppercase text-center text-white">
        &copy; {currentYear} Umami DAO Foundation
      </div>
    </div>
  )
}
