import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Info, CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { getMedicineIcon, formatMedicineTime } from '../utils/timeUtils';

export const MedicineWizard = ({ navigate, editData }) => {
  const { addMedicine, updateMedicine, speak, t, language } = useAppContext();
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition(language);

  const [step, setStep] = useState(1);
  const [name, setName] = useState(editData ? editData.name : '');
  const [type, setType] = useState(editData ? editData.type : null);
  const [time, setTime] = useState(editData ? editData.time : null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (transcript && step === 1 && !isListening) {
      setName(transcript);
      setTranscript('');
    }
  }, [transcript, isListening, step, setTranscript]);

  const handleNext = () => {
    if (step === 1 && !name.trim()) return;
    if (step === 2 && !type) return;
    if (step === 3 && !time) return;
    setStep(prev => prev + 1);
  };

  const handleSave = () => {
    const medData = { name, type, time };
    if (editData) {
      updateMedicine(editData.id, medData);
    } else {
      addMedicine(medData);
    }
    
    setShowSuccess(true);
    
    const template = t('voiceTemplate_saved');
    const announcement = template.replace('{medicine}', name);
    speak(announcement);
    
    setTimeout(() => {
      navigate('MyMedicines');
    }, 3000);
  };

  const getMorningTimes = () => [
    { label: '06:00 AM' }, { label: '07:00 AM' }, { label: '08:00 AM' },
    { label: '09:00 AM' }, { label: '10:00 AM' }, { label: '11:00 AM' }
  ];

  const getAfternoonTimes = () => [
    { label: '12:00 PM' }, { label: '01:00 PM' }, { label: '02:00 PM' },
    { label: '03:00 PM' }, { label: '04:00 PM' }, { label: '05:00 PM' }
  ];

  const getNightTimes = () => [
    { label: '06:00 PM' }, { label: '07:00 PM' }, { label: '08:00 PM' }, { label: '09:00 PM' },
    { label: '10:00 PM' }, { label: '11:00 PM' }, { label: '12:00 AM' },
    { label: '01:00 AM' }, { label: '02:00 AM' }, { label: '03:00 AM' },
    { label: '04:00 AM' }, { label: '05:00 AM' }
  ];

  const getTimesForType = () => {
    if (type === 'morning') return getMorningTimes();
    if (type === 'afternoon') return getAfternoonTimes();
    return getNightTimes();
  };

  const getTypeLabel = (tType) => {
    if (tType === 'morning') return t('morningMedicine');
    if (tType === 'afternoon') return t('afternoonMedicine');
    if (tType === 'night') return t('nightMedicine');
    return '';
  };

  if (showSuccess) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <CheckCircle size={100} color="var(--success-color)" style={{ marginBottom: '24px' }} />
        <h1 className="text-huge" style={{ color: 'var(--success-color)', marginBottom: '32px' }}>
          {t('reminderSaved')}
        </h1>
        <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '24px', width: '100%' }}>
          <p className="text-huge" style={{ margin: '0 0 16px 0', fontWeight: 'bold' }}>{name}</p>
          <p className="text-large" style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)' }}>
            {getMedicineIcon(type)} {getTypeLabel(type)}
          </p>
          <p className="text-large" style={{ margin: '0', fontWeight: 'bold', color: 'var(--primary-color)' }}>
            {formatMedicineTime(type, time, t)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="screen-header">
        <button className="back-btn" onClick={() => step > 1 ? setStep(step - 1) : navigate('MyMedicines')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">{editData ? t('edit') : t('addMedicine')}</h1>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
            
            <div style={{ backgroundColor: '#e3f2fd', padding: '16px', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <Info size={32} color="#1976d2" style={{ flexShrink: 0 }} />
              <p className="text-large" style={{ margin: 0, color: '#1565c0' }}>
                {t('reliabilityNotice')}
              </p>
            </div>

            <h2 className="text-huge">{t('medicineName')}</h2>
            
            <input 
              type="text" 
              className="massive-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. BP Tablet"
            />

            <button 
              className={`btn-massive ${isListening ? 'btn-danger' : 'btn-outline'}`}
              onClick={isListening ? stopListening : startListening}
              style={{ minHeight: '120px' }}
            >
              <Mic className="icon" size={40} />
              <span className="text-huge">{isListening ? '...' : t('speakToWrite') || 'Speak'}</span>
            </button>

            <div style={{ marginTop: 'auto' }}>
              <button 
                className="btn-massive btn-primary"
                onClick={handleNext}
                disabled={!name.trim()}
              >
                <span className="text-huge">Next</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, overflowY: 'auto' }}>
            <h2 className="text-huge">Select Type</h2>
            
            <button 
              className={`btn-massive ${type === 'morning' ? 'btn-primary' : 'btn-outline'}`}
              style={{ minHeight: '150px' }}
              onClick={() => { setType('morning'); handleNext(); }}
            >
              <span style={{ fontSize: '4rem', marginBottom: '16px' }}>🌅</span>
              <span className="text-huge">{t('morningMedicine')}</span>
            </button>

            <button 
              className={`btn-massive ${type === 'afternoon' ? 'btn-primary' : 'btn-outline'}`}
              style={{ minHeight: '150px' }}
              onClick={() => { setType('afternoon'); handleNext(); }}
            >
              <span style={{ fontSize: '4rem', marginBottom: '16px' }}>☀️</span>
              <span className="text-huge">{t('afternoonMedicine')}</span>
            </button>

            <button 
              className={`btn-massive ${type === 'night' ? 'btn-primary' : 'btn-outline'}`}
              style={{ minHeight: '150px', backgroundColor: type === 'night' ? '#2c3e50' : '', color: type === 'night' ? '#fff' : '' }}
              onClick={() => { setType('night'); handleNext(); }}
            >
              <span style={{ fontSize: '4rem', marginBottom: '16px' }}>🌙</span>
              <span className="text-huge">{t('nightMedicine')}</span>
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <h2 className="text-huge">{t('selectTime')}</h2>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px', 
              overflowY: 'auto',
              paddingBottom: '24px'
            }}>
              {getTimesForType().map(tObj => (
                <button
                  key={tObj.label}
                  className={`btn-massive ${time === tObj.label ? 'btn-primary' : 'btn-outline'}`}
                  style={{ minHeight: '100px', flexDirection: 'row', justifyContent: 'flex-start', padding: '0 32px' }}
                  onClick={() => { setTime(tObj.label); handleNext(); }}
                >
                  <span style={{ fontSize: '2.5rem', marginRight: '16px' }}>🕒</span>
                  <span className="text-large" style={{ fontWeight: time === tObj.label ? 'bold' : 'normal' }}>
                    {getMedicineIcon(type)} {formatMedicineTime(type, tObj.label, t)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
            <h2 className="text-huge">Confirm</h2>
            
            <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '24px', border: '2px solid #eee' }}>
              <p className="text-medium" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{t('medicineName')}</p>
              <p className="text-huge" style={{ margin: '0 0 24px 0', fontWeight: 'bold' }}>{name}</p>

              <p className="text-medium" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Type</p>
              <p className="text-large" style={{ margin: '0 0 24px 0' }}>
                {getMedicineIcon(type)} {getTypeLabel(type)}
              </p>

              <p className="text-medium" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{t('reminderTime')}</p>
              <p className="text-huge" style={{ margin: '0 0 24px 0', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                {formatMedicineTime(type, time, t)}
              </p>

              <p className="text-medium" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Repeat</p>
              <p className="text-large" style={{ margin: 0 }}>
                {t('everyDay')}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 'auto' }}>
              <button 
                className="btn-massive btn-success"
                onClick={handleSave}
              >
                <CheckCircle size={32} className="icon" />
                <span className="text-huge">{t('saveReminder')}</span>
              </button>

              <button 
                className="btn-massive btn-outline"
                onClick={() => navigate('MyMedicines')}
              >
                <XCircle size={32} className="icon" />
                <span className="text-huge">{t('cancel')}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
