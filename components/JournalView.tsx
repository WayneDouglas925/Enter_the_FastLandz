import React, { useState } from 'react';
import { JournalEntry, ChallengeData, UserProgress } from '../types';
import { Save, AlertOctagon } from 'lucide-react';

interface JournalViewProps {
  currentDay: number;
  progress: UserProgress;
  onSaveEntry: (entry: JournalEntry) => void;
  entries: JournalEntry[];
  challenges: ChallengeData[];
}

export const JournalView: React.FC<JournalViewProps> = ({ 
  currentDay, 
  onSaveEntry, 
  entries,
  challenges
}) => {
  const [formData, setFormData] = useState({
    mood: '',
    symptoms: '',
    preFastMeal: '',
    notes: ''
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: JournalEntry = {
      day: currentDay,
      date: new Date().toISOString(),
      ...formData,
      completed: true // Simplified for this view
    };
    onSaveEntry(entry);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const todayChallenge = challenges.find(c => c.day === currentDay);

  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-20 animate-fade-in">
      <div className="border-l-4 border-rust pl-4 mb-6">
        <h2 className="font-display text-3xl text-white uppercase">Journal</h2>
        <p className="text-stone-400 font-body">Day {currentDay} Log</p>
      </div>

      {/* Safety Warning */}
      <div className="bg-blood/10 border border-blood p-3 rounded flex items-start space-x-3">
        <AlertOctagon className="text-blood w-6 h-6 flex-shrink-0" />
        <p className="text-blood text-xs font-body">
          <span className="font-bold">MEDICAL WARNING:</span> This is not medical advice. If you pass out, faint, or feel actual pain, STOP immediately. Do not blame the calendar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Prompt */}
        <div className="bg-stone-900 p-4 border border-stone-800 rounded">
            <p className="text-dust font-bold text-sm uppercase mb-2">Daily Prompt</p>
            <p className="text-stone-300 italic">"{todayChallenge?.notesPrompt}"</p>
        </div>

        <div>
          <label className="block text-stone-500 text-xs uppercase mb-1">How are you feeling?</label>
          <input 
            type="text" 
            required
            className="w-full bg-stone-950 border border-stone-700 text-white p-3 focus:border-rust outline-none font-body"
            placeholder="Tired, euphoric, angry at bread..."
            value={formData.mood}
            onChange={e => setFormData({...formData, mood: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-stone-500 text-xs uppercase mb-1">Symptoms (Headache, Weakness?)</label>
          <input 
            type="text" 
            className="w-full bg-stone-950 border border-stone-700 text-white p-3 focus:border-rust outline-none font-body"
            placeholder="None, or vivid dreams of lasagna..."
            value={formData.symptoms}
            onChange={e => setFormData({...formData, symptoms: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-stone-500 text-xs uppercase mb-1">Last Meal Log</label>
          <textarea 
            className="w-full bg-stone-950 border border-stone-700 text-white p-3 focus:border-rust outline-none font-body h-20"
            placeholder="What fueled you?"
            value={formData.preFastMeal}
            onChange={e => setFormData({...formData, preFastMeal: e.target.value})}
          />
        </div>

        <button 
          type="submit"
          disabled={saved}
          className={`w-full flex items-center justify-center p-4 font-display uppercase tracking-wider transition-all
            ${saved ? 'bg-green-700 text-white' : 'bg-rust hover:bg-orange-700 text-white'}`}
        >
          <Save className="mr-2 w-5 h-5" />
          {saved ? "Entry Logged" : "Save Log"}
        </button>
      </form>

      {/* History (Simplified) */}
      <div className="mt-8 border-t border-stone-800 pt-6">
        <h3 className="font-display text-xl text-stone-400 mb-4">Past Records</h3>
        <div className="space-y-3">
          {entries.length === 0 && <p className="text-stone-600 italic">No records found in the wasteland.</p>}
          {entries.map((entry, idx) => (
            <div key={idx} className="bg-stone-900 p-3 border-l-2 border-stone-700">
              <div className="flex justify-between items-center mb-1">
                <span className="text-rust font-bold uppercase text-sm">Day {entry.day}</span>
                <span className="text-stone-600 text-xs">{new Date(entry.date).toLocaleDateString()}</span>
              </div>
              <p className="text-stone-300 text-sm">{entry.mood}</p>
              {entry.symptoms && <p className="text-stone-500 text-xs mt-1">Symptoms: {entry.symptoms}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};