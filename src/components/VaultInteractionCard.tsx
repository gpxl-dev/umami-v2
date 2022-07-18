import { FC, useState } from 'react'
import Card from './Card'
import { BigNumber } from 'ethers'
import DepositPreview from './DepositPreview'
import DepositForm from './DepositForm'
import { useVaultDetails } from '../hooks/useVaultDetails'
import TransactionTracker from './TransactionTracker'
import classNames from 'classnames'

const VaultInteractionCard: FC<{ vaultName: string }> = ({ vaultName }) => {
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit')
  const { data: vaultDetails } = useVaultDetails(vaultName)
  const [depositAmount, setDepositAmount] = useState<BigNumber | null>(null)
  const [depositTxHash, setDepositTxHash] = useState<string | null>(null)

  return vaultDetails ? (
    <Card>
      <div>
        {depositTxHash ? (
          <TransactionTracker
            onClose={() => setDepositTxHash(null)}
            txHash={depositTxHash}
            type="Deposit"
            additionalSuccessContent={
              <div className="text-center">
                <h4 className="font-bold mb-1">
                  The magic of your new Receipt Token
                </h4>
                <p className="font-light leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            }
          />
        ) : depositAmount ? (
          <DepositPreview
            amount={depositAmount}
            vaultName={vaultName}
            onCancelDeposit={() => setDepositAmount(null)}
            onDeposit={(txHash) => {
              setDepositTxHash(txHash)
              setDepositAmount(null)
            }}
          />
        ) : (
          <div>
            <div className="flex flex-row gap-3">
              {(['deposit', 'withdraw'] as Array<'deposit' | 'withdraw'>).map(
                (m) => (
                  <button
                    type="button"
                    className={classNames(
                      'font-bold text-xl uppercase mb-4 cursor-pointer transition-opacity',
                      {
                        'opacity-50': mode !== m,
                      }
                    )}
                    onClick={() => setMode(m)}
                    key={m}
                  >
                    {m}
                  </button>
                )
              )}
            </div>
            {mode === 'deposit' ? (
              <DepositForm
                depositTokenAddress={vaultDetails?.aToken}
                onPreviewDeposit={setDepositAmount}
              />
            ) : (
              'Not implemented'
            )}
          </div>
        )}
      </div>
    </Card>
  ) : (
    // TODO: nicer loading state.
    <span>Loading vault</span>
  )
}

export default VaultInteractionCard
