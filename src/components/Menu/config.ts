import { MenuEntry } from '@epicswap/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: 'https://exchange.epicswap.io/',
      },
      {
        label: 'Liquidity',
        href: 'https://exchange.epicswap.io/#/pool',
      },
    ],
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: 'Pools',
    icon: 'PoolIcon',
    href: '/pools',
  },
  // {
  //   label: 'Pools',
  //   icon: 'PoolIcon',
  //   href: '/pools',
  // },
  {
    label: 'Lottery',
    icon: 'TicketIcon',
    href: '/lottery',
    // href: '',
  },
  {
    label: 'IFO',
    icon: 'IfoIcon',
    href: '/ifo',
    // href: '',
  },
  {
    label: 'Referrals',
    // icon: 'ReferralsIcon',
    icon: 'GroupsIcon',
    href: '/referrals',
  },
  // {
  //   label: 'Info (Coming Soon)',
  //   // icon: 'ReferralsIcon',
  //   icon: 'InfoIcon',
  //   href: '',
  // },
  // {
  //   label: 'NFT',
  //   icon: 'NftIcon',
  //   href: '/nft',
  // },
  {
    label: 'Listings',
    icon: 'HandshakeIcon',
    items: [
      {
        label: 'PancakeSwap',
        // href: 'https://pancakeswap.info/token/',
        href: '',
      },
      {
        label: 'CoinGecko',
        // href: 'https://www.coingecko.com/en/coins/goose-finance',
        href: '',
      },
      {
        label: 'CoinMarketCap',
        // href: 'https://coinmarketcap.com/currencies/goose-finance/',
        href: '',
      },
      {
        label: 'Dextools',
        href: 'https://www.dextools.io/app/bsc/pair-explorer/0x3bf79bf0c50db9adbbe8a0f6f3a198288174fc76',
      },
    ],
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    items: [
      {
        label: 'Github',
        href: 'https://github.com/epicswap/',
      },
      {
        label: 'Docs',
        href: 'https://epicswap.gitbook.io/epicswap/',
      },
      {
        label: 'Medium',
        href: 'https://epicswap.medium.com/',
      },
    ],
  },
  {
    label: 'Partnerships/IFO',
    icon: 'GooseIcon',
    href: '',
  },
  // {
  //   label: 'Audit by Hacken',
  //   icon: 'AuditIcon',
  //   href: '',
  // },
  // {
  //   label: 'Audit by CertiK',
  //   icon: 'AuditIcon',
  //   href: '',
  // },
]

export default config
