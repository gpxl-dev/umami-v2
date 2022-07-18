import { FC, ReactNode } from 'react'
import styled from 'styled-components'
import classnames from 'classnames'

const CardContents = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.color};
`

const Card: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={classnames([
      'bg-gradient-to-b from-umami-pink to-umami-purple p-[2px] duration-200 rounded-md shadow',
      className,
    ])}
  >
    <CardContents className="rounded w-full p-6">{children}</CardContents>
  </div>
)

export default Card
