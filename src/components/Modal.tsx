import React from 'react'
import { PortalWithState } from 'react-portal'

import Button from './Button'

type Props = {
  children: React.ReactNode;
  trigger?: React.ReactNode | Element | React.ComponentType;
  triggerText?: string;
};

export default function Modal({ children, trigger, triggerText }: Props) {
	return (
		<PortalWithState node={document.querySelector('body')} closeOnEsc>
			{({ openPortal, closePortal, portal }) => (
				<>
					{trigger ? (
						React.cloneElement(trigger as React.ReactElement, {
							onClick: openPortal,
						})
					) : (
						<button type="button" onClick={openPortal}>
							{triggerText}
						</button>
					)}
					{portal(
						<div
							role="dialog"
							aria-modal={true}
							className="fixed inset-0 backdrop-blur"
							id="modal-container"
							onClick={(e) =>
								(e.target as Element).id === 'modal-container'
									? closePortal()
									: () => {
										return null
									}
							}
						>
							<div className="bg-gradient-to-b from-umami-pink to-umami-purple mt-12 rounded-md shadow-xl w-full max-w-xs overflow-y-auto p-[1px] m-auto">
								<div className="rounded-md p-4 text-white bg-black">
									{children}
									<Button onClick={closePortal} className="mt-4">
                    close modal
									</Button>
								</div>
							</div>
						</div>
					)}
				</>
			)}
		</PortalWithState>
	)
}
