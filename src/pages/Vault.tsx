import { formatUnits } from 'ethers/lib/utils'
import { FC, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'
import PageContent from '../components/PageContent'
import VaultCard from '../components/VaultCard'
import VaultInteractionCard from '../components/VaultInteractionCard'
import useERC20Balance from '../hooks/useERC20Balance'
import useTokenInfo from '../hooks/useTokenInfo'
import { useVaultDetails } from '../hooks/useVaultDetails'

const Vault: FC<{}> = () => {
  const { vaultName } = useParams<{ vaultName: string }>()
  const { data: vaultDetails } = useVaultDetails(vaultName)

  const { data: aTokenInfo } = useTokenInfo(vaultDetails?.aToken)

  const { data: vaultBalance } = useERC20Balance(
    vaultDetails?.aToken,
    vaultDetails?.address
  )

  // Parse out bignumber.
  const vaultBalanceNumber = useMemo(() => {
    if (!aTokenInfo || !vaultBalance) return
    return parseFloat(formatUnits(vaultBalance, aTokenInfo.decimals))
  }, [aTokenInfo, vaultBalance])

  return (
    <>
      <Helmet>
        <title>Umami Finance | {vaultName} Vault</title>
      </Helmet>

      <main>
        <div className="h-24 lg:h-[200px]">
          <div className="sr-only">
            <h1>Umami Finance | GLP/TCR USDC Pool Vault</h1>
          </div>
        </div>

        <PageContent>
          <div className="grid gap-6 grid-rows-2 lg:grid-rows-1 lg:grid-cols-5 max-w-7xl mx-auto">
            <div className="lg:col-span-3">
              <VaultCard
                title={vaultName!}
                tokens={{
                  deposit: aTokenInfo?.symbol,
                  earn: aTokenInfo?.symbol,
                  receipt: vaultDetails?.rToken,
                }}
                fees={vaultDetails?.fees}
                contractAddress={vaultDetails?.address}
                apr="---"
                tag={vaultDetails?.type}
                deposits={{
                  current: vaultBalanceNumber,
                }}
              />
            </div>
            {vaultName && (
              <div className="lg:col-span-2">
                <VaultInteractionCard vaultName={vaultName} />
              </div>
            )}
          </div>
        </PageContent>
      </main>
    </>
  )
}

export default Vault
