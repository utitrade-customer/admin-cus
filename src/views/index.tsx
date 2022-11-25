import { Loading } from '@/components';
import { APP_BASE_URL } from '@/constants';
import { lazy, Suspense, memo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CreateStakePage from './stake/pages/CreateStakePages';

const KYCListingPage = lazy(() => import('./kyc/pages/KYCListingPage'));
const KYCDetailPage = lazy(() => import('./kyc/pages/KYCDetailPage'));
const KYCBlackListPage = lazy(() => import('./kyc/pages/KYCBlackListPage'));

const DepositStaticPage = lazy(
  () => import('./statistic/pages/DepositStatisticPage')
);
const WithdrawStatisticPage = lazy(
  () => import('./statistic/pages/WithdrawStatisticPage')
);
const TradeStatisticPage = lazy(
  () => import('./statistic/pages/TradeStatisticPage')
);
const ArticleCreate = lazy(
  () => import('./annoucement/pages/Article/screens/announcement')
);
const ArticleDetail = lazy(
  () => import('./annoucement/pages/Article/screens/ArticleDetail')
);
const ArticleList = lazy(
  () => import('./annoucement/pages/Article/screens/ArticleList')
);
const BannerList = lazy(
  () => import('./annoucement/pages/Banner/screens/BannerList')
);

const ChildCurrenciesPage = lazy(
  () => import('./wallet/pages/ChildCurrencies')
);
const PaypalDepositPage = lazy(() => import('./paypal/screens/PaypalDeposit'));
const PaypayWithdrawPage = lazy(
  () => import('./paypal/screens/PaypalWithdraw')
);

const ManageAppViews = () => {
  return (
    <Suspense fallback={<Loading cover='content' />}>
      <Routes>
        <Route path={APP_BASE_URL}>
          <Route path='statistic/deposit' element={<DepositStaticPage />} />
          <Route path='statistic/trade' element={<TradeStatisticPage />} />
          <Route
            path='statistic/withdraw'
            element={<WithdrawStatisticPage />}
          />

          <Route
            path='kyc/detail/:uid/:update_at'
            element={<KYCDetailPage />}
          />
          <Route path='kyc/list' element={<KYCListingPage />} />
          <Route path='kyc/black-list' element={<KYCBlackListPage />} />

          <Route
            path='announcement/article/create'
            element={<ArticleCreate />}
          />
          <Route path='announcement/article/list' element={<ArticleList />} />
          <Route
            path='announcement/article/detail/:articleId'
            element={<ArticleDetail />}
          />
          <Route path='announcement/banner/list' element={<BannerList />} />
          <Route path='statistic'>
            <Route path='deposit' element={<DepositStaticPage />} />
            <Route path='trade' element={<TradeStatisticPage />} />
            <Route path='withdraw' element={<WithdrawStatisticPage />} />
          </Route>

          <Route path='kyc'>
            <Route path='detail/:uid/:update_at' element={<KYCDetailPage />} />
            <Route path='list' element={<KYCListingPage />} />
            <Route path='black-list' element={<KYCBlackListPage />} />
          </Route>

          <Route path='announcement'>
            <Route path='article/create' element={<ArticleCreate />} />
            <Route path='article/list' element={<ArticleList />} />
            <Route
              path='article/detail/:articleId'
              element={<ArticleDetail />}
            />
            <Route path='banner/list' element={<BannerList />} />
          </Route>

          <Route path='wallet'>
            <Route path='child-currencies' element={<ChildCurrenciesPage />} />
          </Route>
          <Route path='paypal'>
            <Route path='deposit' element={<PaypalDepositPage />} />
            <Route path='withdraw' element={<PaypayWithdrawPage />} />
          </Route>

          <Route path='stake'>
            <Route path='create' element={<CreateStakePage />} />
          </Route>
        </Route>

        <Route path='*' element={<Navigate to={`${APP_BASE_URL}`} />} />
      </Routes>
    </Suspense>
  );
};

export default memo(ManageAppViews);
