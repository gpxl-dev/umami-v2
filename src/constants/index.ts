export const NAV_LINKS = {
  root: [
    {
      label: 'Home',
      path: '/app',
    },
  ],
  earn: [
    {
      label: 'Marinate',
      path: '/app/marinate',
    },
    {
      label: 'Compound',
      path: '/app/compound',
    },
  ],
}

export const SOCIAL_LINKS = [
  {
    name: 'github',
    url: 'https://github.com/arbi-s',
  },
  {
    name: 'twitter',
    url: 'https://twitter.com/UmamiFinance',
  },
  {
    name: 'discord',
    url: 'https://discord.gg/BvkMTjrzHc',
  },
  {
    name: 'docs',
    url: 'https://docs.umami.finance/',
  },
  {
    name: 'medium',
    url: 'https://umamifinance.medium.com/',
  },
]

export const PARTNERS = [
  {
    logo: '/assets/tracer-dao.svg',
    label: 'Tracer Finance',
    url: 'https://tracer.finance/',
  },
  {
    logo: '/assets/gmx.svg',
    label: 'GMX.io',
    url: 'https://gmx.io',
  },
  {
    logo: '/assets/socket.png',
    label: 'Socket.tech',
    url: 'https://socket.tech/',
  },
  {
    logo: '/assets/banxa.svg',
    label: 'Banxa',
    url: 'https://banxa.com/',
  },
  {
    logo: '/assets/jones.svg',
    label: 'Jones DAO',
    url: 'https://jonesdao.io',
  },
  {
    logo: '/assets/dopex.svg',
    label: 'Dopex',
    url: 'https://dopex.io',
  },
]

export const POOL_ADDRESSES = {
  umamiEth: '0x2B734Ec7555cb49C755A9495a8d17cd2383926E0',
  ethUsdc: '0xC31E54c7a869B9FcBEcc14363CF510d1c41fa443',
}

export const TOKEN_ADDRESSES = {
  weth: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  umami: '0x1622bF67e6e5747b81866fE0b85178a93C7F86e3',
  usdc: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  mumami: '0x2AdAbD6E8Ce3e82f52d9998a7f64a90d294A92A4',
  cmumami: '0x1922C36F3bc762Ca300b4a46bB2102F84B1684aB',
  cmumamiBooster: '0x6A0F4AFB31e90c378FA2Aaa40371a652578F339B',
  glpTcrUsdcPool: '0xB590e96c5092F8Dbf6beDbA2C27217a50fF018c3',
}

export const ARBITRUM_ID = 42161

export const INFURA_RPC_URL = `https://arbitrum-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`

export const ARB1_RPC_URL = 'https://arb1.arbitrum.io/rpc'

export const TOKEN_DECIMALS = {
  umami: 9,
  mumami: 9,
  cmumami: 9,
  weth: 18,
  usdc: 6,
}

export const LOCAL_STORAGE_KEY = 'umami_finance_disclaimer_agreement'

export const THEMES = {
  light: {
    color: 'var(--color-dark)',
    backgroundColor: 'var(--color-light)',
    backgroundAltColor: 'var(--color-light)',
    backgroundAltDarkColor: 'var(--color-dark-alt)',
  },
  dark: {
    color: 'var(--color-light)',
    backgroundColor: 'var(--color-dark)',
    backgroundAltColor: 'var(--color-dark-alt)',
    backgroundAltDarkColor: 'var(--color-dark)',
  },
}

export const DEFAULT_THEME = THEMES.dark

export const THEME_KEY = 'umami_current_theme'
