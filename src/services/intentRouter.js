import { DEBUG } from '../config/debugFlags';
import { relationshipEngine } from './relationshipEngine';
import { localCommandEngine } from './localCommandEngine';
import { contactResolutionEngine } from './contactResolutionEngine';

export const intentRouter = {
  route: async (transcript, localMathEngine = null, contacts = []) => {
    let result = null;

    if (localMathEngine) {
      result = localMathEngine.detectMath(transcript);
      if (result && result.confidence >= 0.80) {
        if (DEBUG.SHOW_INTENTS) console.log('[IntentRouter] Math Match:', result);
        return result;
      }
    }

    // Direct Contact Search first (Universal Resolution Engine)
    const contactMatches = contactResolutionEngine.resolveContact(transcript, contacts);
    if (contactMatches.length > 0) {
      if (DEBUG.SHOW_INTENTS) console.log('[IntentRouter] Direct Contact Match:', contactMatches);
      return {
        action: 'call_direct',
        contacts: contactMatches,
        confidence: 0.95
      };
    }

    result = relationshipEngine.detectRelationship(transcript);
    if (result && result.confidence >= 0.80) {
      if (DEBUG.SHOW_INTENTS) console.log('[IntentRouter] Relationship Match:', result);
      return result;
    }

    result = localCommandEngine.detectCommand(transcript);
    if (result && result.confidence >= 0.80) {
      if (DEBUG.SHOW_INTENTS) console.log('[IntentRouter] Command Match:', result);
      return result;
    }

    if (DEBUG.SHOW_INTENTS) console.log('[IntentRouter] No local match. Falling back to Gemini.');
    return { action: 'fallback', confidence: 0 };
  }
};
