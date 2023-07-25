import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom';

import Header from './components/Header/Header.jsx';
import CallList from './components/CallList/CallList.jsx';

export const TabContext = createContext('activity');
export const ArchiveActionContext = createContext(false);

const App = () => {
  const [tab, setTab] = useState('activity');
  const [archiveAction, setArchiveAction] = useState(false);

  return (
    <div className='container'>
      <TabContext.Provider value={{tab, setTab}}>
        <ArchiveActionContext.Provider value={{archiveAction, setArchiveAction}}>
          <Header/>
          <div className='container-view'>
            <CallList />
          </div>
        </ArchiveActionContext.Provider>
      </TabContext.Provider>
    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('app'));

export default App;
