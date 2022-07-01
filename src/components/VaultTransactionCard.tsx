import React from 'react'
import styled from 'styled-components'
import type { ReactNode } from 'react'

type RootComponentProps = {
  children: ReactNode;
  className?: string;
};

type ActionProps = {
  text: string;
  type?: 'submit' | 'button';
  disabled?: boolean;
  onClick?: () => void;
};

type ContentProps = {
  children: ReactNode;
};

type HeaderActionProps = {
  text: string;
  onClick?: () => void;
  active?: boolean;
};

const HeaderStyles = styled.div`
  background-color: ${(props) => props.theme.backgroundAltDarkColor};
`

function Header({ children }: ContentProps) {
  return (
    <HeaderStyles className="flex rounded-md rounded-bl-none rounded-br-none p-4 bg-black border-b border-gray-500">
      {children}
    </HeaderStyles>
  )
}

function HeaderAction({ active, onClick, text }: HeaderActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`duration-200 flex items-center justify-center font-bold uppercase w-full rounded-md rounded-br-none rounded-bl-none hover:text-umami-yellow ${
        active ? 'text-umami-yellow' : ''
      }`}
    >
      {text}
    </button>
  )
}

function HeaderActionDivider() {
  return <div className="w-1 h-8 bg-gray-500 bg-opacity-80" />
}

function Action({
  text,
  type = 'button',
  disabled = false,
  onClick,
}: ActionProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="bg-umami-pink duration-100 font-bold h-10 mt-4 rounded-md text-white uppercase w-full hover:translate-y-[2px] hover:text-umami-yellow"
      onClick={onClick}
    >
      {text}
    </button>
  )
}

function Content({ children }: ContentProps) {
  return <div className="p-4">{children}</div>
}

const RootContainer = styled.div`
  background-color: ${(props) => props.theme.backgroundAltDarkColor};
  color: var(--color-light);
`

export default function VaultTransactionCard({
  children,
  className,
}: RootComponentProps) {
  return (
    <RootContainer
      className={`border border-umami-pink border-2 rounded-md bg-black ${className}`}
    >
      {children}
    </RootContainer>
  )
}

VaultTransactionCard.Action = Action
VaultTransactionCard.Header = Header
VaultTransactionCard.Content = Content
VaultTransactionCard.HeaderAction = HeaderAction
VaultTransactionCard.HeaderActionDivider = HeaderActionDivider
