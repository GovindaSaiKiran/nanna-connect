import React from 'react';
import { ArrowLeft, Mic } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export const CommandHistory = ({ navigate }) => {
  const { commandHistory, t } = useAppContext();

  return (
    <div className="app-container">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('Settings')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">{t('recentCommands') || 'Recent Voice Commands'}</h1>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        {commandHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
            <Mic size={64} style={{ display: 'inline-block', marginBottom: '16px', opacity: 0.5 }} />
            <p className="text-large">No recent commands</p>
          </div>
        ) : (
          commandHistory.map((cmd) => (
            <div key={cmd.id} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="text-huge" style={{ fontWeight: 'bold' }}>"{cmd.text}"</span>
              </div>
              <span className="text-medium" style={{ color: 'var(--text-secondary)' }}>
                {new Date(cmd.timestamp).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
