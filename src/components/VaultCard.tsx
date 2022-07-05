import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { FaExternalLinkAlt } from 'react-icons/fa'

import Button from './Button'

const CardContents = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.color};
`

type Props = {
  title: string;
  url?: string;
  contractAddress?: string;
  tokens: {
    deposit: string;
    earn: string;
    receipt: string;
  };
  apr?: string;
  apy?: string;
  fees: string;
  deposits: {
    current: number;
    capacity: number;
  };
};

export default function VaultCard({
  title,
  url,
  tokens,
  fees,
  deposits,
  apr,
  apy,
  contractAddress,
}: Props) {
  const getFormattedNumber = React.useCallback((num: number) => {
    return new Intl.NumberFormat('en-us').format(num)
  }, [])

  const currentDeposits = React.useMemo(() => {
    return getFormattedNumber(Math.floor(deposits.current))
  }, [deposits, getFormattedNumber])

  const maxDeposits = React.useMemo(() => {
    return getFormattedNumber(deposits.capacity)
  }, [deposits, getFormattedNumber])

  const depositPercentage = React.useMemo(() => {
    return Math.floor((Math.floor(deposits.current) / deposits.capacity) * 100)
  }, [deposits])

  return (
    <div className="bg-gradient-to-b from-umami-pink to-umami-purple p-[2px] duration-200 rounded-md shadow w-full">
      <CardContents className="rounded w-full p-6">
        <div className="flex w-full items-center justify-between">
          <h2 className="font-bold text-2xl uppercase mr-4">{title}</h2>

          {url ? (
            <Link to={url}>
              <Button className="text-xs min-w-[6rem] max-w-[8rem]">
                view vault
              </Button>
            </Link>
          ) : null}
          {contractAddress ? (
            <div className="flex">
              <a
                href={`https://arbiscan.io/address/${contractAddress}`}
                target="_blank"
                rel="noopner noreferrer"
                className="flex items-center font-bold px-2 py-1 rounded bg-slate-700 text-slate-300 text-sm duration-100 hover:bg-gray-800 hover:-translate-y-[2px]"
              >
                <span className="mr-1">Contract </span>
                <FaExternalLinkAlt className="inline pb-1" />
              </a>
            </div>
          ) : null}
        </div>

        <ul className="grid grid-rows-2 grid-cols-2 md:grid-rows-1 md:grid-cols-4 mt-4 border border-gray-500 rounded">
          <li className="border-r border-gray-500 p-4">
            <div className="text-sm text-gray-500 md:w-24">
              <div className="flex items-center justify-center">
                <div>Deposit</div>
                <div className="mx-1"> | </div>
                <div>Earn</div>
              </div>

              <div className="flex items-center justify-around">
                <div className="flex-1">
                  <span className="sr-only">{tokens.deposit}</span>
                  <img src="/assets/usdc.svg" alt="" className="h-10 w-10" />
                </div>
                <div className="text-2xl"> | </div>
                <div className="flex-1">
                  <span className="sr-only">{tokens.earn}</span>
                  <img src="/assets/usdc.svg" alt="" className="h-10 w-10" />
                </div>
              </div>
            </div>
          </li>

          <li className="md:border-r md:border-gray-500 p-4">
            <div className="flex flex-col items-center">
              <div className="text-sm text-center text-gray-500">
                Receipt Token
              </div>
              <div className="font-bold text-lg">{tokens.receipt}</div>
            </div>
          </li>

          {apr ? (
            <li className="border-r md:border-t-0 border-gray-500 border-t p-4">
              <div className="flex flex-col items-center">
                <div className="text-sm text-center text-gray-500">Est APR</div>
                <div className="font-bold text-lg">{apr}%</div>
              </div>
            </li>
          ) : null}

          {apy ? (
            <li className="md:border-r md:border-t-0 border-gray-500 border-t p-4">
              <div className="flex flex-col items-center">
                <div className="text-sm text-center text-gray-500">Est APY</div>
                <div className="font-bold text-lg">{apy}%</div>
              </div>
            </li>
          ) : null}

          {fees ? (
            <li className="md:border-r md:border-t-0 border-gray-500 border-t p-4">
              <div className="flex flex-col items-center">
                <div className="text-sm text-center text-gray-500">Fees</div>
                <div className="font-bold text-lg">{fees}</div>
              </div>
            </li>
          ) : null}
        </ul>

        <div className="flex items-center justify-between font-bold mt-4 w-full">
          <div className="text-white">{currentDeposits}</div>
          <div className="text-white">{maxDeposits}</div>
        </div>

        <div className="mt-2 relative bg-gray-300 rounded h-1 w-full">
          <div
            className="bg-sky-500 h-1 absolute inset-0 rounded"
            style={{ width: `${depositPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-gray-500 text-sm font-bold mt-2 w-full">
          <div>Total Deposits</div>
          <div>Vault Capactiy</div>
        </div>
      </CardContents>
    </div>
  )
}
