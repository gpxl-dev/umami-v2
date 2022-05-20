import React from 'react'

const partners = [
	{
		logo: '/assets/tracer-dao.svg',
		label: 'Tracer Finance',
	},
	{
		logo: '/assets/gmx.svg',
		label: 'GMX.io',
	},
	{
		logo: '/assets/impermax.png',
		label: 'Impermax',
	},
	{
		logo: '/assets/swapr.png',
		label: 'Swapr',
	},
	{
		logo: '/assets/socket.png',
		label: 'Socket.tech',
	},
	{
		logo: '/assets/banxa.svg',
		label: 'Banxa',
	},
	{
		logo: '/assets/dopex.svg',
		label: 'Dopex',
	},
]

type PartnerLogoProps = {
  logo: string;
  label: string;
};

function PartnerLogo({ logo, label }: PartnerLogoProps) {
	return (
		<div className="flex items-center justify-center last:col-span-2">
			<span className="sr-only">{label}</span>
			<img
				src={logo}
				alt={label}
				className={`object-contain h-24 w-36 md:w-32 md:h-20 ${
					label === 'Dopex' ? 'h-16' : ''
				}`}
			/>
		</div>
	)
}

export default function LandingPartners() {
	const partnerDisplay = React.useMemo(() => {
		return (
			<>
				{partners.map(({ label, logo }) => (
					<PartnerLogo key={logo} label={label} logo={logo} />
				))}
			</>
		)
	}, [])

	return (
		<div className="m-auto mt-8 max-w-md w-full gap-4 md:grid md:grid-cols-2">
			{partnerDisplay}
		</div>
	)
}
