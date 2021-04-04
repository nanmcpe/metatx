import React from 'react';

//Components
import Content from './Content';

//Provider
import MessageProvider from './context/MessageProvider';
import Web3Provider from './context/Web3Provider';


const App = () => {

  return (
    <div className='App'>
      <Web3Provider>
        <MessageProvider>
          <Content />
        </MessageProvider>
      </Web3Provider>
    </div>
  );
};

export default App;
