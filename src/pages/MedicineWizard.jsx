import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Info, CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { formatMedicineTime, getTimeClassification, getMedicineIcon, classifyTime } from '../utils/timeUtils';

export const MedicineWizard = ({ navigate, editData }) => {
  const { addMedicine, updateMedicine, speakFeedback, t, language } = useAppContext();
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition(language);

  const [step, setStep] = useState(1);
  const [name, setName] = useState(editData ? editData.name : '');
  const [dosage, setDosage] = useState(editData ? editData.dosage : '');
  const [time, setTime] = useState(editData ? editData.time : '');
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    if (editData && editData.time) {
      return classifyTime(editData.time).period;
    }
    return null;
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (transcript && !isListening) {
      if (step === 1) setName(transcript);
      if (step === 2) setDosage(transcript);
      setTranscript('');
    }
  }, [transcript, isListening, step, setTranscript]);

  const handleNext = () => {
    if (step === 1 && !name.trim()) return;
    if (step === 2 && !dosage.trim()) return;
    if (step === 3 && !time) return;
    setStep(prev => prev + 1);
  };

  const handleSave = () => {
    const timeInfo = classifyTime(time);
    const medData = { name, dosage, time, type: timeInfo.period };
    if (editData) {
      updateMedicine(editData.id, medData);
    } else {
      addMedicine(medData);
    }
    
    setShowSuccess(true);
    
    let template = t('voiceTemplate_saved') || '{medicine} reminder saved successfully.';
    const announcement = template.replace('{medicine}', name);
    speakFeedback(announcement);
    
    setTimeout(() => {
      navigate('MyMedicines');
    }, 3000);
  };

  const dosageOptions = [
    { key: '1 Tablet', icon: '💊', label: t('dosage_1tablet') || '1 Tablet' },
    { key: '2 Tablets', icon: '💊', label: t('dosage_2tablets') || '2 Tablets' },
    { key: '3 Tablets', icon: '💊', label: t('dosage_3tablets') || '3 Tablets' },
    { key: '1 Spoon', icon: '🥄', label: t('dosage_1spoon') || '1 Spoon' },
    { key: '2 Spoons', icon: '🥄', label: t('dosage_2spoons') || '2 Spoons' },
    { key: 'Drops', icon: '💧', label: t('dosage_drops') || 'Drops' },
    { key: 'Injection', icon: '💉', label: t('dosage_injection') || 'Injection' },
  ];

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
            {t('dosage') || 'Dosage'}: {dosage}
          </p>
          <p className="text-large" style={{ margin: '0', fontWeight: 'bold', color: 'var(--primary-color)' }}>
            {formatMedicineTime(time, t)}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
            <h2 className="text-huge">{t('dosage') || 'Dosage'}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', overflowY: 'auto' }}>
              {dosageOptions.map(opt => (
                <button
                  key={opt.key}
                  className={`btn-massive ${dosage === opt.label ? 'btn-selected' : 'btn-outline'}`}
                  style={{ minHeight: '100px', flexDirection: 'column', gap: '8px', padding: '16px' }}
                  onClick={() => { setDosage(opt.label); setTimeout(() => setStep(3), 300); }}
                >
                  <span style={{ fontSize: '2.5rem' }}>{opt.icon}</span>
                  <span className="text-medium">{opt.label}</span>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '16px' }}>
               <h3 className="text-large">{t('dosage_other') || 'Other'}</h3>
               <input 
                  type="text" 
                  className="massive-input"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder={t('dosage') || 'Dosage'}
                />
            </div>

            <div style={{ marginTop: 'auto' }}>
              <button 
                className="btn-massive btn-primary"
                onClick={handleNext}
                disabled={!dosage.trim()}
              >
                <span className="text-huge">Next</span>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, overflowY: 'auto', paddingBottom: '24px' }}>
            {!selectedPeriod ? (
              <>
                <h2 className="text-huge">{t('selectPeriod') || 'Select Time Period'}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { id: 'morning', icon: '🌅', label: t('morning') },
                    { id: 'afternoon', icon: '☀️', label: t('afternoon') },
                    { id: 'evening', icon: '🌇', label: t('evening') },
                    { id: 'night', icon: '🌙', label: t('night') }
                  ].map(p => (
                    <button 
                      key={p.id}
                      className="btn-massive btn-outline"
                      style={{ minHeight: '140px', flexDirection: 'column', gap: '16px' }}
                      onClick={() => {
                        setSelectedPeriod(p.id);
                        const defaultHours = { morning: '08', afternoon: '13', evening: '18', night: '20' };
                        setTime(`${defaultHours[p.id]}:00`);
                      }}
                    >
                      <span style={{ fontSize: '3.5rem' }}>{p.icon}</span>
                      <span className="text-large" style={{ fontWeight: 'bold' }}>{p.label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button className="back-btn" onClick={() => { setSelectedPeriod(null); setTime(''); }} style={{ padding: '8px' }}>
                    <ArrowLeft size={28} />
                  </button>
                  <h2 className="text-huge" style={{ margin: 0 }}>{t('selectTime')}</h2>
                </div>
                
                <h3 className="text-large" style={{ margin: '8px 0 0 0' }}>{t('hour') || 'Hour'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {(
                    selectedPeriod === 'morning' ? ['06', '07', '08', '09', '10', '11'] :
                    selectedPeriod === 'afternoon' ? ['12', '13', '14', '15', '16'] :
                    selectedPeriod === 'evening' ? ['17', '18', '19', '20'] :
                    ['21', '22', '23', '00']
                  ).map(h24 => {
                    let h12 = parseInt(h24, 10) % 12;
                    h12 = h12 ? h12 : 12;
                    const displayHour = h12.toString().padStart(2, '0');
                    const isSelected = time && time.startsWith(h24 + ':');
                    
                    return (
                      <button 
                        key={h24}
                        className={`btn-massive ${isSelected ? 'btn-selected' : 'btn-outline'}`}
                        style={{ padding: '16px 8px', fontSize: '2rem', fontWeight: 'bold', minHeight: '80px' }}
                        onClick={() => setTime(`${h24}:${time ? time.split(':')[1] : '00'}`)}
                      >
                        {displayHour}
                      </button>
                    );
                  })}
                </div>

                <h3 className="text-large" style={{ margin: '8px 0 0 0' }}>{t('minute') || 'Minute'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(min => {
                    const isSelected = time && time.endsWith(':' + min);
                    return (
                      <button 
                        key={min}
                        className={`btn-massive ${isSelected ? 'btn-selected' : 'btn-outline'}`}
                        style={{ padding: '16px 8px', fontSize: '2rem', fontWeight: 'bold', minHeight: '80px' }}
                        onClick={() => setTime(`${time ? time.split(':')[0] : '08'}:${min}`)}
                      >
                        {min}
                      </button>
                    );
                  })}
                </div>

                {time && (
                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <span className="text-huge" style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                      {formatMedicineTime(time, t)}
                    </span>
                  </div>
                )}

                <div style={{ marginTop: 'auto' }}>
                  <button 
                    className="btn-massive btn-primary"
                    onClick={handleNext}
                    disabled={!time}
                  >
                    <span className="text-huge">Next</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
            <h2 className="text-huge">Confirm</h2>
            
            <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '24px', border: '2px solid #eee' }}>
              <p className="text-medium" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{t('medicineName')}</p>
              <p className="text-huge" style={{ margin: '0 0 24px 0', fontWeight: 'bold' }}>{name}</p>

              <p className="text-medium" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{t('dosage') || 'Dosage'}</p>
              <p className="text-large" style={{ margin: '0 0 24px 0', fontWeight: 'bold' }}>{dosage}</p>

              <p className="text-medium" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{t('reminderTime')}</p>
              <p className="text-huge" style={{ margin: '0 0 24px 0', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                {formatMedicineTime(time, t)}
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
