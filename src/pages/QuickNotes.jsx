import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Save, Pin, Volume2, Search, Trash2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export const QuickNotes = ({ navigate }) => {
  const { notes, addNote, removeNote, togglePin, speak } = useAppContext();
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();
  
  const [text, setText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (transcript) {
      setText(prev => prev ? `${prev} ${transcript}` : transcript);
      // Wait for it to settle then clear transcript so we don't duplicate
      setTranscript('');
    }
  }, [transcript, setTranscript]);

  const handleSave = () => {
    if (!text.trim()) {
      speak('ఏమి రాయలేదు');
      return;
    }
    addNote(text.trim());
    setText('');
    speak('నోట్ సేవ్ చేయబడింది');
  };

  const filteredNotes = notes.filter(n => n.text.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="app-container">
      <div className="screen-header" style={{ paddingBottom: '16px' }}>
        <button className="back-btn" onClick={() => navigate('Home')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">త్వరిత నోట్స్ (Notes)</h1>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button 
          className={`btn-massive ${isListening ? 'btn-danger' : 'btn-primary'}`}
          onClick={isListening ? stopListening : startListening}
          style={{ flex: 1, minHeight: '80px', flexDirection: 'row', padding: '8px' }}
        >
          <Mic className="icon" size={24} />
          <span>{isListening ? 'వినబడుతోంది...' : 'మాట్లాడండి'}</span>
        </button>
        <button 
          className="btn-massive btn-success"
          onClick={handleSave}
          style={{ flex: 1, minHeight: '80px', flexDirection: 'row', padding: '8px' }}
        >
          <Save className="icon" size={24} />
          <span>సేవ్</span>
        </button>
      </div>

      <textarea 
        className="massive-input" 
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="ఇక్కడ రాయండి..."
        style={{ minHeight: '120px', resize: 'none' }}
      />

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', backgroundColor: '#fff', borderRadius: '8px', padding: '8px', border: '2px solid #ccc' }}>
        <Search size={24} color="var(--text-secondary)" style={{ marginRight: '8px' }} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="వెతకండి (Search)"
          style={{ border: 'none', outline: 'none', fontSize: '1.25rem', width: '100%' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
        {filteredNotes.map(note => (
          <div key={note.id} style={{ 
            backgroundColor: note.pinned ? '#fff3cd' : '#fff', 
            padding: '16px', 
            borderRadius: '12px',
            border: `2px solid ${note.pinned ? '#ffc107' : '#eee'}`
          }}>
            <p className="text-large" style={{ marginBottom: '16px' }}>{note.text}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '8px' }}>
              <button className="btn-outline" style={{ padding: '8px', borderRadius: '8px', border: 'none' }} onClick={() => togglePin(note.id)}>
                <Pin size={24} color={note.pinned ? '#ffc107' : 'var(--text-secondary)'} fill={note.pinned ? '#ffc107' : 'none'} />
              </button>
              <button className="btn-outline" style={{ padding: '8px', borderRadius: '8px', border: 'none' }} onClick={() => speak(note.text)}>
                <Volume2 size={24} color="var(--primary-color)" />
              </button>
              <button className="btn-outline" style={{ padding: '8px', borderRadius: '8px', border: 'none' }} onClick={() => {
                if(window.confirm('Delete this note?')) removeNote(note.id);
              }}>
                <Trash2 size={24} color="var(--danger-color)" />
              </button>
            </div>
          </div>
        ))}
        {filteredNotes.length === 0 && (
          <p className="text-large" style={{ textAlign: 'center', marginTop: '32px' }}>నోట్స్ లేవు</p>
        )}
      </div>
    </div>
  );
};
