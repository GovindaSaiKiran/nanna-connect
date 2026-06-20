import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Save, Pin, Volume2, Search, Trash2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export const QuickNotes = ({ navigate }) => {
  const { notes, addNote, removeNote, togglePin, speak, t, language } = useAppContext();
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition(language);
  
  const [text, setText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (transcript) {
      setText(prev => prev ? `${prev} ${transcript}` : transcript);
      setTranscript('');
    }
  }, [transcript, setTranscript]);

  const handleSave = () => {
    if (!text.trim()) {
      speak(t('nothingWritten'));
      return;
    }
    addNote(text.trim());
    setText('');
    speak(t('saved'));
  };

  const filteredNotes = (Array.isArray(notes) ? notes : []).filter(n => n.text.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="app-container">
      <div className="screen-header" style={{ paddingBottom: '16px' }}>
        <button className="back-btn" onClick={() => navigate('Home')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">{t('quickNotesTitle') || t('quickNotes')}</h1>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button 
          className={`btn-massive ${isListening ? 'btn-danger' : 'btn-primary'}`}
          onClick={isListening ? stopListening : startListening}
          style={{ flex: 1, minHeight: '80px', flexDirection: 'row', padding: '8px' }}
        >
          <Mic className="icon" size={24} />
          <span>{isListening ? t('listening') : t('speakToWrite')}</span>
        </button>
        <button 
          className="btn-massive btn-success"
          onClick={handleSave}
          style={{ flex: 1, minHeight: '80px', flexDirection: 'row', padding: '8px' }}
        >
          <Save className="icon" size={24} />
          <span>{t('save')}</span>
        </button>
      </div>

      <textarea 
        className="massive-input"
        style={{ minHeight: '120px', resize: 'none', marginBottom: '24px' }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('speakToWrite')}
      />

      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={28} />
        <input 
          type="text" 
          className="massive-input"
          style={{ paddingLeft: '64px', marginBottom: '0' }}
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
        {filteredNotes.map(note => (
          <div 
            key={note.id}
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '16px',
              border: `2px solid ${note.pinned ? 'var(--primary-color)' : '#eee'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <p className="text-large" style={{ flex: 1, margin: 0 }}>{note.text}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => speak(note.text)}
                  style={{ background: 'none', border: 'none', padding: '8px' }}
                >
                  <Volume2 size={28} color="var(--primary-color)" />
                </button>
                <button 
                  onClick={() => togglePin(note.id)}
                  style={{ background: 'none', border: 'none', padding: '8px' }}
                >
                  <Pin size={28} color={note.pinned ? 'var(--primary-color)' : 'var(--text-secondary)'} fill={note.pinned ? 'var(--primary-color)' : 'none'} />
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm(t('deleteNoteConfirm'))) {
                      removeNote(note.id);
                    }
                  }}
                  style={{ background: 'none', border: 'none', padding: '8px' }}
                >
                  <Trash2 size={28} color="var(--danger-color)" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredNotes.length === 0 && (
          <p className="text-large" style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-secondary)' }}>
            {t('noNotes')}
          </p>
        )}
      </div>
    </div>
  );
};
