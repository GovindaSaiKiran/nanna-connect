import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Loader2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { intentRouter } from '../services/intentRouter';
import { localMathEngine } from '../services/localMathEngine';
import { localGeminiService } from '../services/localGeminiService';
import { FEATURES } from '../config/featureFlags';

export const NannaAI = ({ navigate }) => {
  const { speakFeedback, language, contacts } = useAppContext();
  const { isListening, transcript, interimTranscript, error, startListening, stopListening, setTranscript } = useSpeechRecognition(language);
  const [status, setStatus] = useState('idle'); // 'idle', 'processing', 'success', 'error'
  const [response, setResponse] = useState('');

  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    if (!FEATURES.AI_ASSISTANT) {
      navigate('Home');
    }
  }, [navigate]);

  useEffect(() => {
    if (transcript && status !== 'processing') {
      processTranscript(transcript);
    }
  }, [transcript]);

  const processTranscript = async (text) => {
    stopListening();
    setStatus('processing');
    setResponse('⏳ Processing...');
    
    try {
        const localResult = await intentRouter.route(text, localMathEngine, contacts);
        
        if (localResult && localResult.confidence >= 0.80) {
            if (localResult.action === 'call_direct') {
               setDebugInfo({
                  language,
                  transcript: text,
                  name: localResult.contacts[0].contact.name,
                  method: localResult.contacts[0].method,
                  score: localResult.contacts[0].score
               });
               handleActionResult({
                  action: 'call_direct',
                  contacts: localResult.contacts.map(c => c.contact)
               });
               return;
            }
            handleActionResult(localResult);
            return;
        }

        if (!FEATURES.GEMINI_FALLBACK) {
            const msg = '❌ Command Not Recognized. Internet connection may be required.';
            setResponse(msg);
            speakFeedback('I could not understand.');
            setStatus('error');
            return;
        }

        let data;
        if (import.meta.env.DEV) {
            console.log("Using Local Gemini");
            data = await localGeminiService.processTranscript(text);
        } else {
            console.log("Using Server API");
            const res = await fetch('/api/assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript: text })
            });
            
            if (!res.ok) throw new Error('API Error');
            data = await res.json();
        }
        
        handleActionResult(data);
        
    } catch (e) {
        console.error(e);
        const msg = '❌ Network Error or Service Unavailable.';
        setResponse(msg);
        speakFeedback('Internet Connection Required or Service Unavailable.');
        setStatus('error');
    }
  };

  const handleActionResult = (result) => {
    setStatus('success');
    if (result.action === 'navigate') {
      setResponse(`✅ Command Executed. Navigating to ${result.target}...`);
      speakFeedback(`Opening ${result.target}`);
      setTimeout(() => navigate(result.target), 1500);
    } else if (result.action === 'call_direct' || result.action === 'call_relationship') {
      let matchingContacts = [];
      let label = '';
      if (result.action === 'call_direct') {
         matchingContacts = result.contacts;
         label = matchingContacts.length > 0 ? matchingContacts[0].name : '';
      } else {
         matchingContacts = contacts.filter(c => c.relationship?.toLowerCase() === result.relationship?.toLowerCase());
         label = result.relationship;
      }

      if (matchingContacts.length === 1) {
        const contact = matchingContacts[0];
        setResponse(`✅ Command Executed. Calling ${contact.name}...`);
        speakFeedback(`Calling ${label}`);
        setTimeout(() => {
          window.location.href = `tel:${contact.phone}`;
          setStatus('idle');
        }, 1500);
      } else if (matchingContacts.length > 1) {
        const msg = `✅ Command Executed. I found multiple contacts for your request. Please select one.`;
        setResponse(msg);
        speakFeedback(msg);
        setTimeout(() => {
          navigate('CallContact', matchingContacts);
        }, 1500);
      } else {
        const msg = `❌ Command Not Recognized. I could not find a contact for ${label}.`;
        setResponse(msg);
        speakFeedback(msg);
        setStatus('error');
      }
    } else if (result.action === 'answer_math') {
      const msg = `✅ Command Executed. The answer is ${result.result}`;
      setResponse(msg);
      speakFeedback(msg);
      setTimeout(() => setStatus('idle'), 3000);
    } else if (result.action === 'answer' || result.response) {
      setResponse(`✅ Command Executed. ${result.response}`);
      speakFeedback(result.response);
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setResponse('❌ Command Not Recognized.');
      speakFeedback('I am not sure how to help with that.');
      setStatus('error');
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      setStatus('idle');
      setResponse('');
    } else {
      setTranscript('');
      setStatus('idle');
      setResponse('🎤 Listening...');
      startListening();
    }
  };

  if (!FEATURES.AI_ASSISTANT) return null;

  return (
    <div className="app-container" style={{ backgroundColor: '#f0f9ff' }}>
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('Home')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title" style={{ color: 'var(--primary-color)' }}>Nanna AI Assistant</h1>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        
        <div style={{ minHeight: '120px', marginBottom: '40px', width: '100%', textAlign: 'center' }}>
          {error && !isListening && (
             <div style={{ padding: '16px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '16px', marginBottom: '16px', fontWeight: 'bold' }}>
                ❌ {error}
             </div>
          )}
          
          {debugInfo && (
             <div style={{ padding: '16px', backgroundColor: '#fff3e0', border: '2px solid #ff9800', borderRadius: '16px', marginBottom: '16px', textAlign: 'left', fontSize: '14px', fontFamily: 'monospace' }}>
                <strong>--- Temporary Debug Mode ---</strong><br/>
                Detected Language: {debugInfo.language}<br/>
                Transcript: {debugInfo.transcript}<br/>
                Matched Contact: {debugInfo.name}<br/>
                Match Method: {debugInfo.method}<br/>
                Confidence: {debugInfo.score}<br/>
             </div>
          )}
          
          {isListening && (interimTranscript || transcript) && (
            <div style={{ padding: '16px', backgroundColor: '#e8f5e9', borderRadius: '16px', marginBottom: '16px' }}>
               <span style={{ fontWeight: 'bold', color: '#2e7d32' }}>You Said:</span>
               <div className="text-large" style={{ marginTop: '8px', color: '#1b5e20' }}>{interimTranscript || transcript}</div>
            </div>
          )}

          <h2 className="text-large" style={{ color: 'var(--text-secondary)' }}>
            {status === 'processing' || status === 'success' || status === 'error' ? response : (isListening ? '🎤 Listening...' : 'Tap the microphone and speak')}
          </h2>
        </div>

        <button 
          className={`btn-massive ${isListening ? 'btn-danger' : 'btn-primary'}`}
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0',
            animation: isListening ? 'pulse 2s infinite' : 'none',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
          onClick={handleMicClick}
          disabled={status === 'processing'}
        >
          {status === 'processing' ? (
            <Loader2 size={80} className="icon" style={{ animation: 'spin 2s linear infinite' }} />
          ) : (
            <Mic size={80} className="icon" />
          )}
        </button>

      </div>
    </div>
  );
};
