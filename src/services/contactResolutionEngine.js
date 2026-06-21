import { transliterate } from './transliterationEngine';
import { fuzzyMatchScore } from '../utils/fuzzyMatch';

export const contactResolutionEngine = {
  resolveContact: (transcript, activeContacts) => {
    if (!transcript || !activeContacts) return [];
    
    const lowerTranscript = transcript.toLowerCase().trim();
    const transTranscript = transliterate(lowerTranscript);

    // 1. Relationship Match
    let matches = activeContacts.filter(c => c.relationship && lowerTranscript.includes(c.relationship.toLowerCase()));
    if (matches.length > 0) {
       return matches.map(m => ({ contact: m, method: 'relationship', score: 1.0 }));
    }

    let bestMatches = [];
    let highestScore = 0;

    for (const contact of activeContacts) {
       let score = 0;
       let method = '';
       const engName = contact.name?.toLowerCase() || '';
       const locName = contact.localName?.toLowerCase() || '';
       
       if (locName && locName === lowerTranscript) {
          score = 1.0; method = 'local';
       } else if (engName && engName === lowerTranscript) {
          score = 0.95; method = 'english';
       } else if (locName && transliterate(locName) === transTranscript) {
          score = 0.90; method = 'transliteration';
       } else {
          const scoreLoc = locName ? fuzzyMatchScore(lowerTranscript, locName) : 0;
          const scoreEng = engName ? fuzzyMatchScore(lowerTranscript, engName) : 0;
          const scoreTrans = locName ? fuzzyMatchScore(transTranscript, transliterate(locName)) : 0;
          score = Math.max(scoreLoc, scoreEng, scoreTrans);
          if (score > 0) method = 'fuzzy';
       }

       if (score > 0.5) { 
          if (score > highestScore) {
             highestScore = score;
             bestMatches = [{ contact, method, score }];
          } else if (Math.abs(score - highestScore) < 0.01) {
             bestMatches.push({ contact, method, score });
          }
       }
    }

    return bestMatches;
  }
};
