import React from 'react'
import { Link } from 'react-router-dom'

import Button from './Button'

type Props = {
  title: string;
  url: string;
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
}: Props) {
  return (
    <div className="bg-gradient-to-b from-umami-pink to-umami-purple p-[2px] hover:-translate-y-1 duration-200 rounded-md shadow w-full md:max-w-[50%]">
      <div className="rounded bg-black w-full p-6">
        <div className="flex w-full items-center justify-between">
          <h2 className="font-bold text-2xl uppercase">{title}</h2>

          <Link to={url}>
            <Button className="text-xs w-[8rem]">view vault</Button>
          </Link>
        </div>

        <ul className="flex mt-4 border border-gray-500 rounded">
          <li className="border-r border-gray-500 p-4">
            <div className="text-sm text-gray-500 w-24">
              <div className="flex items-center justify-center">
                <div>Deposit</div>
                <div className="mx-1"> | </div>
                <div>Earn</div>
              </div>

              <div className="flex items-center justify-center">
                <div>{tokens.deposit}</div>
                <div className="mx-1"> | </div>
                <div>{tokens.earn}</div>
              </div>
            </div>
          </li>

          <li className="border-r border-gray-500 p-4">
            <div className="flex flex-col items-center">
              <div className="text-sm text-center text-gray-500">
                Receipt Token
              </div>
              <div className="font-bold text-lg">{tokens.receipt}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}
