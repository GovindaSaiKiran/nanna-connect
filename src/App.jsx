import React, { useState } from 'react';
import { Home } from './pages/Home';
import { CallContact } from './pages/CallContact';
import { VoiceMessage } from './pages/VoiceMessage';
import { SendPhoto } from './pages/SendPhoto';
import { ShareLocation } from './pages/ShareLocation';
import { Emergency } from './pages/Emergency';
import { AddContact } from './pages/AddContact';
import { Calculator } from './pages/Calculator';
import { QuickNotes } from './pages/QuickNotes';

function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <Home navigate={setCurrentScreen} />;
      case 'CallContact':
        return <CallContact navigate={setCurrentScreen} />;
      case 'VoiceMessage':
        return <VoiceMessage navigate={setCurrentScreen} />;
      case 'SendPhoto':
        return <SendPhoto navigate={setCurrentScreen} />;
      case 'ShareLocation':
        return <ShareLocation navigate={setCurrentScreen} />;
      case 'Emergency':
        return <Emergency navigate={setCurrentScreen} />;
      case 'AddContact':
        return <AddContact navigate={setCurrentScreen} />;
      case 'Calculator':
        return <Calculator navigate={setCurrentScreen} />;
      case 'QuickNotes':
        return <QuickNotes navigate={setCurrentScreen} />;
      default:
        return <Home navigate={setCurrentScreen} />;
    }
  };

  return (
    <>
      {renderScreen()}
    </>
  );
}

export default App;
