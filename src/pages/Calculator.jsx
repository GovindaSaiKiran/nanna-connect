import React, { useState } from 'react';
import { ArrowLeft, Mic, Delete, Equal, Volume2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export const Calculator = ({ navigate }) => {
  const { speak, t, language } = useAppContext();
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition(language);
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const appendToExpression = (val) => {
    setExpression(prev => prev + val);
  };

  const calculate = () => {
    try {
      const cleanExpr = expression.replace(/x/g, '*').replace(/÷/g, '/');
      const res = new Function('return ' + cleanExpr)();
      setResult(res.toString());
      speak(`${t('answer')} ${res}`);
    } catch (e) {
      setResult(t('error'));
      speak(t('error'));
    }
  };

  const clear = () => {
    setExpression('');
    setResult('');
  };

  const deleteLast = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  // Auto calculate when transcript changes
  React.useEffect(() => {
    if (transcript && !isListening) {
      setExpression(transcript);
      try {
        const sanitized = transcript
          .replace(/plus/gi, '+')
          .replace(/minus/gi, '-')
          .replace(/times|multiplied by/gi, '*')
          .replace(/divided by/gi, '/')
          .replace(/into/gi, '*')
          .replace(/[^-()\d/*+.]/g, '');
        
        if (sanitized) {
          const res = new Function('return ' + sanitized)();
          setResult(res.toString());
          speak(`${t('answer')} ${res}`);
        }
      } catch (e) {
        setResult(t('error'));
        speak(t('error'));
      }
    }
  }, [transcript, isListening, speak, t]);

  const buttons = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', 'x'],
    ['1', '2', '3', '-'],
    ['C', '0', '.', '+']
  ];

  return (
    <div className="app-container">
      <div className="screen-header" style={{ paddingBottom: '8px' }}>
        <button className="back-btn" onClick={() => navigate('Home')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">{t('calculatorTitle')}</h1>
      </div>

      <div style={{ 
        backgroundColor: '#fff', 
        padding: '24px', 
        borderRadius: '16px', 
        marginBottom: '16px',
        border: '2px solid var(--primary-color)',
        minHeight: '140px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        overflow: 'hidden'
      }}>
        <div style={{ fontSize: '2rem', color: 'var(--text-secondary)' }}>{expression || '0'}</div>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{result}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', flex: 1 }}>
        {buttons.map((row, rowIndex) => 
          row.map((btn, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`btn-massive ${['÷','x','-','+'].includes(btn) ? 'btn-primary' : (btn === 'C' ? 'btn-danger' : 'btn-outline')}`}
              style={{ minHeight: '80px', padding: '0', fontSize: '2rem' }}
              onClick={() => {
                if (btn === 'C') clear();
                else appendToExpression(btn);
              }}
            >
              {btn}
            </button>
          ))
        )}
        <button 
          className="btn-massive btn-outline"
          style={{ minHeight: '80px', padding: '0', gridColumn: 'span 2' }}
          onClick={deleteLast}
        >
          <Delete size={32} />
        </button>
        <button 
          className="btn-massive btn-success"
          style={{ minHeight: '80px', padding: '0', gridColumn: 'span 2' }}
          onClick={calculate}
        >
          <Equal size={40} />
        </button>
      </div>

      <button 
        className={`btn-massive ${isListening ? 'btn-danger' : 'btn-primary'}`}
        onClick={isListening ? stopListening : startListening}
        style={{ padding: '16px', marginTop: '16px', minHeight: '80px' }}
      >
        <Mic className="icon" />
        <span className="text-large">{isListening ? t('listening') : t('calculatorVoice')}</span>
      </button>
    </div>
  );
};
