import { MdOutlinePersonOff } from 'react-icons/md';
import { GrAnnounce, GrArticle } from 'react-icons/gr';
import { GiPayMoney, GiTatteredBanner } from 'react-icons/gi';
import { FcMoneyTransfer, FcStatistics } from 'react-icons/fc';
import { APP_BASE_URL } from '@/constants';
import { AiOutlineTransaction } from 'react-icons/ai';
import { BiWallet } from 'react-icons/bi';
import {
  BsFilePersonFill,
  BsFillPencilFill,
  BsCurrencyExchange,
} from 'react-icons/bs';

const ROUTES = [
  {
    title: 'KYC MANAGE',
    path_prefix: 'kyc',
    icons: BsFilePersonFill,
    items: [
      {
        title: 'KYC List',
        path: `${APP_BASE_URL}/kyc/list`,
        icons: BsFilePersonFill,
      },
      {
        title: 'KYC Black List',
        path: `${APP_BASE_URL}/kyc/black-list`,
        icons: MdOutlinePersonOff,
      },
    ],
  },
  {
    title: 'ANNOUNCEMENT MANAGE',
    path_prefix: 'announcement',
    icons: GrAnnounce,
    items: [
      {
        title: 'Create Article',
        path: `${APP_BASE_URL}/announcement/article/create`,
        icons: BsFillPencilFill,
      },
      {
        title: 'Article List',
        path: `${APP_BASE_URL}/announcement/article/list`,
        icons: GrArticle,
      },
      {
        title: 'Banner List',
        path: `${APP_BASE_URL}/announcement/banner/list`,
        icons: GiTatteredBanner,
      },
    ],
  },
  
  {
    title: 'WALLET CONFIG',
    path_prefix: 'wallet',
    icons: BiWallet,
    items: [
      {
        title: 'Child Currencies',
        path: `${APP_BASE_URL}/wallet/child-currencies`,
        icons: BsCurrencyExchange,
      },
      // {
      //   title: 'Deposit Tracking',
      //   path: `${APP_BASE_URL}/wallet/deposit`,
      //   icons: RiLuggageDepositLine,
      // },
      // {
      //   title: 'Transfer Tracking',
      //   path: `${APP_BASE_URL}/wallet/transfer`,
      //   icons: BiTransferAlt,
      // },
    ],
  },
];

export default ROUTES;
