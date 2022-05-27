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
    url: 'https://arbisfinance.gitbook.io/umami-finance/',
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
    logo: '/assets/impermax.png',
    label: 'Impermax',
    url: 'https://www.impermax.finance/',
  },
  {
    logo: '/assets/swapr.png',
    label: 'Swapr',
    url: 'https://swapr.eth.link/#/swap?chainId=42161',
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
}

export const ARBITRUM_ID = 42161

export const INFURA_RPC_URL = `https://arbitrum-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`

export const TOKEN_DECIMALS = {
  umami: 9,
  mumami: 9,
  cmumami: 9,
  weth: 18,
  usdc: 6,
}
