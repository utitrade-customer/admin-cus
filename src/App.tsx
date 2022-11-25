import Header from 'template/header/Header';
import React from 'react';
import Sidebar from 'template/Sidebar/index';
import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import 'antd/dist/antd.css';
import './css/style.scss';
import './css/template-styles/index.css';
// or 'antd/dist/antd.less'
import ManageAppViews from 'views';
import { useFetchCurrencies } from 'hooks/currencies/list/useFetchCurrencies';
import { useSetRecoilState } from 'recoil';
import { currenciesState } from 'recoils/currencies/state';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: currencies, isLoading } = useFetchCurrencies();
  const setCurrencies = useSetRecoilState(currenciesState);

  React.useEffect(() => {
    !isLoading && currencies && setCurrencies(currencies);
  }, [currencies, isLoading, setCurrencies]);
  return (
    <Router>
      <div className='app'>
        <div className='flex h-screen overflow-hidden'>
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main>
              <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
                <ManageAppViews />
              </div>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
