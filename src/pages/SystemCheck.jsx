import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export const SystemCheck = ({ navigate }) => {
  const { voiceGuidance, t } = useAppContext();
  
  const [status, setStatus] = useState({
    mic: 'checking',
    notif: 'checking',
    location: 'checking',
    internet: 'checking'
  });

  const checkPermissions = async () => {
    setStatus({ mic: 'checking', notif: 'checking', location: 'checking', internet: 'checking' });
    
    // Internet
    setStatus(prev => ({ ...prev, internet: navigator.onLine ? 'ok' : 'error' }));

    // Mic
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setStatus(prev => ({ ...prev, mic: 'ok' }));
    } catch (err) {
      setStatus(prev => ({ ...prev, mic: 'error' }));
    }

    // Notifications
    if (!('Notification' in window)) {
      setStatus(prev => ({ ...prev, notif: 'error' }));
    } else {
      if (Notification.permission === 'granted') {
        setStatus(prev => ({ ...prev, notif: 'ok' }));
      } else if (Notification.permission === 'denied') {
        setStatus(prev => ({ ...prev, notif: 'error' }));
      } else {
        setStatus(prev => ({ ...prev, notif: 'checking' }));
        Notification.requestPermission().then(perm => {
          setStatus(prev => ({ ...prev, notif: perm === 'granted' ? 'ok' : 'error' }));
        });
      }
    }

    // Location
    if (!navigator.geolocation) {
       setStatus(prev => ({ ...prev, location: 'error' }));
    } else {
       navigator.geolocation.getCurrentPosition(
         () => setStatus(prev => ({ ...prev, location: 'ok' })),
         () => setStatus(prev => ({ ...prev, location: 'error' }))
       );
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  const StatusIcon = ({ state }) => {
    if (state === 'checking') return <RefreshCw className="icon-spin" size={32} color="var(--text-secondary)" />;
    if (state === 'ok') return <CheckCircle size={32} color="var(--success-color)" />;
    return <XCircle size={32} color="var(--danger-color)" />;
  };

  return (
    <div className="app-container">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('Settings')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">{t('systemCheck') || 'System Check'}</h1>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-large">{t('micPermission') || 'Microphone Permission'}</span>
          <StatusIcon state={status.mic} />
        </div>

        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-large">{t('notifPermission') || 'Notification Permission'}</span>
          <StatusIcon state={status.notif} />
        </div>

        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-large">{t('locPermission') || 'Location Permission'}</span>
          <StatusIcon state={status.location} />
        </div>

        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-large">{t('internetStatus') || 'Internet Connection'}</span>
          <StatusIcon state={status.internet} />
        </div>

        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-large">{t('voiceStatus') || 'Voice Guidance'}</span>
          <StatusIcon state={voiceGuidance ? 'ok' : 'error'} />
        </div>

        <button 
          className="btn-massive btn-primary"
          onClick={checkPermissions}
          style={{ marginTop: '24px' }}
        >
          <RefreshCw size={32} className="icon" />
          <span className="text-large">{t('recheck') || 'Run Check Again'}</span>
        </button>

      </div>
    </div>
  );
};
