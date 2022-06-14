import React from 'react'
import styled from 'styled-components'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode;
  className?: string;
};

const PageStyles = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.color};
`

export default function PageContent({ children, className }: Props) {
  return <PageStyles className={className}>{children}</PageStyles>
}
