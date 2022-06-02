import React from 'react'
import { createPortal } from 'react-dom'

import Button from './Button'
import { LOCAL_STORAGE_KEY } from '../constants'

export default function Disclaimer() {
  const [isAcknowledged, setAcknowledged] = React.useState(false)

  const storedAcknowledgement = React.useMemo(() => {
    const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (storedValue === null) {
      return false
    }

    return storedValue === 'true'
  }, [])

  const handleUnderstood = React.useCallback(() => {
    if (!isAcknowledged) {
      setAcknowledged(true)
      localStorage.setItem(LOCAL_STORAGE_KEY, String(true))
    }
  }, [isAcknowledged])

  React.useEffect(() => {
    if (storedAcknowledgement) {
      setAcknowledged(true)
    }
  }, [storedAcknowledgement])

  return React.useMemo(() => {
    return !isAcknowledged
      ? createPortal(
          <div
            className="fixed inset-0 backdrop-blur p-4"
            aria-modal={true}
            role="dialog"
            araia-labelledby="disclaimer-dialog-title"
          >
            <div className="bg-gradient-to-b from-umami-pink to-umami-purple mt-12 rounded-md shadow-xl w-full max-w-md overflow-y-auto p-[1px] m-auto">
              <div className="rounded-md p-4 text-white bg-black">
                <h2
                  id="disclaimer-dialog-title"
                  className="font-black text-center text-2xl uppercase"
                >
                  Disclaimer
                </h2>

                <div className="h-[300px] mt-4 overflow-y-auto pr-2">
                  <p>
                    Umami Finance ("Umami") is a set of smart contracts made
                    available by Umami.Finance on a voluntary, “as-is” and “as
                    available” basis. By interacting or attempting to interact
                    (in both cases, “interacting”) with Umami, you confirm that
                    you understand and agree to these terms:
                  </p>

                  <ul className="mt-4 grid grid-auto-rows gap-4 text-sm pl-2">
                    <li>
                      Nature of Umami: The project is completely decentralized
                      and owned by no one, Umami.Finance is not involved in any
                      transactions, whether as an intermediary, counterparty,
                      advisor or otherwise.
                    </li>
                    <li>
                      You are not a US Person ; you are not a resident,
                      national, or agent of Antigua and Barbuda, Algeria,
                      Bangladesh, Bolivia, Belarus, Burundi, Burma (Myanmar),
                      Cote D’Ivoire (Ivory Coast), Crimea and Sevastopol, Cuba,
                      Democratic Republic of Congo, Ecuador, Iran, Iraq,
                      Liberia, Libya, Magnitsky, Mali, Morocco, Nepal, North
                      Korea, Somalia, Sudan, Syria, Venezuela, Yemen, Zimbabwe
                      or any other country to which the United States, the
                      United Kingdom or the European Union embargoes goods or
                      imposes similar sanctions; you are not a member of any
                      sanctions list or equivalent maintained by the United
                      States government, the United Kingdom government, the
                      European Union, or the United Nations; you do intend to
                      transact with any Restricted Person or Sanctions List
                      Person; you do not, and will not, use VPN software or any
                      other privacy or anonymization tools or techniques to
                      circumvent, or attempt to circumvent, any restrictions.
                    </li>
                  </ul>
                </div>

                <div className="mt-4">
                  <Button onClick={handleUnderstood} className="max-w-[100%]">I Understand</Button>
                </div>

                <a
                  className="block mt-4 text-center text-umami-yellow text-sm"
                  href="https://google.com"
                >
                  Leave site
                </a>
              </div>
            </div>
          </div>,
          document.querySelector('body') as Element
        )
      : null
  }, [isAcknowledged, handleUnderstood])
}
