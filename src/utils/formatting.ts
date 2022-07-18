import { BigNumber } from 'ethers'
import { commify, formatUnits } from 'ethers/lib/utils'

export const formatBalance = (
  bigNumber: BigNumber,
  decimals: number = 18,
  decimalPlaces: number = 4
) => {
  const units = parseFloat(formatUnits(bigNumber, decimals))
  return commify(units.toFixed(decimalPlaces))
}
