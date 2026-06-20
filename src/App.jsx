import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { CallContact } from './pages/CallContact';
import { VoiceMessage } from './pages/VoiceMessage';
import { SendPhoto } from './pages/SendPhoto';
import { ShareLocation } from './pages/ShareLocation';
import { SOS } from './pages/SOS';
import { EmergencyContacts } from './pages/EmergencyContacts';
import { AddEmergencyContact } from './pages/AddEmergencyContact';
import { AddContact } from './pages/AddContact';
import { Calculator } from './pages/Calculator';
import { QuickNotes } from './pages/QuickNotes';
import { LanguageSelection } from './pages/LanguageSelection';
import { MyMedicines } from './pages/MyMedicines';
import { MedicineWizard } from './pages/MedicineWizard';
import { MedicineHistory } from './pages/MedicineHistory';
import { MedicineAlert } from './components/MedicineAlert';
import { useAppContext } from './contexts/AppContext';

function App() {
  const { hasCompletedOnboarding } = useAppContext();
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [wizardProps, setWizardProps] = useState(null);

  // Force onboarding screen on first launch
  useEffect(() => {
    if (!hasCompletedOnboarding) {
      setCurrentScreen('LanguageSelection');
    } else if (currentScreen === 'LanguageSelection') {
      setCurrentScreen('Home');
    }
  }, [hasCompletedOnboarding]);

  const navigateTo = (screen, props = null) => {
    if (screen === 'MedicineWizard' || screen === 'AddEmergencyContact') {
      setWizardProps(props);
    }
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'LanguageSelection':
        return <LanguageSelection navigate={navigateTo} />;
      case 'Home':
        return <Home navigate={navigateTo} />;
      case 'CallContact':
        return <CallContact navigate={navigateTo} />;
      case 'VoiceMessage':
        return <VoiceMessage navigate={navigateTo} />;
      case 'SendPhoto':
        return <SendPhoto navigate={navigateTo} />;
      case 'ShareLocation':
        return <ShareLocation navigate={navigateTo} />;
      case 'SOS':
        return <SOS navigate={navigateTo} />;
      case 'EmergencyContacts':
        return <EmergencyContacts navigate={navigateTo} />;
      case 'AddEmergencyContact':
        return <AddEmergencyContact navigate={navigateTo} editData={wizardProps} />;
      case 'AddContact':
        return <AddContact navigate={navigateTo} />;
      case 'Calculator':
        return <Calculator navigate={navigateTo} />;
      case 'QuickNotes':
        return <QuickNotes navigate={navigateTo} />;
      case 'MyMedicines':
        return <MyMedicines navigate={navigateTo} />;
      case 'MedicineWizard':
        return <MedicineWizard navigate={navigateTo} editData={wizardProps} />;
      case 'MedicineHistory':
        return <MedicineHistory navigate={navigateTo} />;
      default:
        return <Home navigate={navigateTo} />;
    }
  };

  return (
    <>
      <MedicineAlert />
      {renderScreen()}
    </>
  );
}

export default App;
