import React from 'react'
import styled from 'styled-components'
import type { ReactNode } from 'react'

type EarnCardProps = {
  children?: ReactNode;
  footer?: ReactNode | string;
};

type HeaderProps = {
  text: string;
};

type ContentProps = {
  children: ReactNode;
};

const HeaderContainer = styled.div`
  background-image: url("/assets/umami-finance-neotokyo-bg.png");
  background-repeat: no-repeat;
  background-size: 750px auto;
  background-position: bottom center;
`

function Header({ text }: HeaderProps) {
  return (
    <HeaderContainer className="h-[150px]">
      <div className="flex items-center justify-center h-full bg-black bg-opacity-80 font-display text-4xl text-white tracking-[1rem] uppercase">
        {text}
      </div>
    </HeaderContainer>
  )
}

function Content({ children }: ContentProps) {
  return <div className="text-black p-4 mt-4">{children}</div>
}

function SubHeader({ children }: ContentProps) {
  return (
    <div className="p-4 bg-black text-lg">
      <div className="bg-gradient-to-b from-umami-pink to-umami-purple bg-clip-text text-transparent font-bold text-center">
        {children}
      </div>
    </div>
  )
}

export default function EarnCard({ children, footer }: EarnCardProps) {
  return (
    <div className="bg-gradient-to-b from-umami-pink to-umami-purple p-[3px] hover:-translate-y-1 duration-200 rounded-md shadow max-w-md">
      <div
        className={`bg-white rounded ${
          footer ? 'rounded-br-none rounded-bl-none' : ''
        }`}
      >
        {children}
      </div>
      {footer}
    </div>
  )
}

EarnCard.Header = Header
EarnCard.Content = Content
EarnCard.SubHeader = SubHeader
