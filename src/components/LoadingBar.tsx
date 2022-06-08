import React from 'react'
import styled from 'styled-components'

const LoadingBarDiv = styled.div`
  animation: shine 2.5s ease-in-out infinite;
  animation-direction: both;
  background: linear-gradient(
    90deg,
    var(--color-umami-pink),
    var(--color-umami-purple)
  );
  background-size: 400% 400%;
  border: 1px solid transparent;
  border-radius: 1rem;
  display: block;
  margin: auto;
  min-height: 1.5rem;
  height: 100%;
  min-width: 3rem;

  @keyframes shine {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 50% 0%;
    }
  }
`

type Props = {
  className?: string;
};

export default function LoadingBar({ className }: Props) {
  return <LoadingBarDiv className={className} />
}
