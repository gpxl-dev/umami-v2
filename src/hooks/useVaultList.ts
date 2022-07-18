import { VaultDetails } from '../types'

export function useVaultList(): VaultDetails[] {
  return [
    {
      name: 'Umami WETH-WBTC-USDC',
      rToken: 'umWETH-WBTC-USDC',
      aToken: '0x64541216bAFFFEec8ea535BB71Fbc927831d0595',
      type: 'Autocompounder',
      address: '0x5F945110043605a93CFc27A5699EA81f6c867aeB',
      details:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      fees: '0.2-1.5-15-0',
      zapper: '',
    },
  ]
}
