import React from 'react'

import { PARTNERS } from '../constants'

type PartnerLogoProps = {
  logo: string;
  label: string;
};

function PartnerLogo({ logo, label }: PartnerLogoProps) {
  return (
    <div className="flex items-center justify-center">
      <span className="sr-only">{label}</span>
      <img
        src={logo}
        alt={label}
        className={`object-contain h-24 w-36 md:w-32 md:h-20 ${
          label === 'Dopex' ? 'h-20' : ''
        } ${label === 'Jones DAO' ? 'pb-4' : ''}`}
      />
    </div>
  )
}

export default function LandingPartners() {
  const partnerDisplay = React.useMemo(() => {
    return (
      <>
        {PARTNERS.map(({ label, logo, url }) => (
          <div
            key={logo}
            className="flex items-center justify-center"
          >
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:outline focus:outline"
            >
              <PartnerLogo label={label} logo={logo} />
            </a>
          </div>
        ))}
      </>
    )
  }, [])

  return (
    <div className="m-auto mt-8 max-w-4xl w-full gap-8 grid grid-cols-2 md:grid-cols-3">
      {partnerDisplay}
    </div>
  )
}
