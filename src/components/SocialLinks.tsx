import React from 'react'
import { FaDiscord, FaTwitter, FaGithub, FaBook, FaMedium } from 'react-icons/fa'

import { SOCIAL_LINKS } from '../constants'

type Props = {
  className?: string;
};

export default function SocialLinks({ className }: Props) {
  const classes = 'duration-100 hover:scale-110'

	const getSocialIcon = React.useCallback((name: string) => {
		switch (name) {
		case 'github':
			return <FaGithub className={classes} />
		case 'twitter':
			return <FaTwitter className={classes} />
		case 'discord':
			return <FaDiscord className={classes} />
		case 'docs':
			return <FaBook className={classes} />
    case 'medium':
      return <FaMedium className={classes} />
		default:
			throw new Error(
				'Invalid social link name given as param to getSocialIcon'
			)
		}
	}, [])

	return React.useMemo(() => {
		return (
			<ul className="flex items-center justify-center w-full">
				{SOCIAL_LINKS.map(({ name, url }) => (
					<li key={name} className={`text-2xl mr-8 last:mr-0 ${className}`}>
            <a href={url} target="_blank" rel="noopener noreferrer">
							<span className="sr-only">Link to: {name}</span>
							{getSocialIcon(name as string)}
						</a>
					</li>
				))}
			</ul>
		)
	}, [getSocialIcon, className])
}
