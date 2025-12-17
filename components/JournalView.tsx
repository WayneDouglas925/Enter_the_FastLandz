import React, { useState, useEffect } from 'react';
import { JournalEntry, ChallengeData, UserProgress } from '../types';
import { Save, AlertOctagon, Calendar, Eye, Edit2, List, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface JournalViewProps {
  currentDay: number;
  progress: UserProgress;
  onSaveEntry: (entry: JournalEntry) => void;
  entries: JournalEntry[];
  challenges: ChallengeData[];
  selectedDay: number | null;
  onClearSelection: () => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  currentDay,
  onSaveEntry,
  entries,
  challenges,
  selectedDay,
  onClearSelection
}) => {
  // Initialize with today's date and current day
  const [formData, setFormData] = useState({
    day: currentDay,
    date: new Date().toISOString().split('T')[0],
    mood: '',
    symptoms: '',
    preFastMeal: '',
    notes: ''
  });

  const [saved, setSaved] = useState(false);
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: JournalEntry = {
      day: formData.day,
      date: new Date(formData.date).toISOString(),
      mood: formData.mood,
      symptoms: formData.symptoms,
      preFastMeal: formData.preFastMeal,
      notes: formData.notes,
      completed: true // In a real app, this might depend on checking off items
    };
    onSaveEntry(entry);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    
    // Optional: clear form or keep it? Keeping it is better for UX if they want to edit.
  };

  const todayChallenge = challenges.find(c => c.day === formData.day) || challenges[0];
  const selectedEntry = selectedDay ? entries.find(e => e.day === selectedDay) : null;

  // Auto-scroll to selected entry when coming from calendar
  useEffect(() => {
    if (selectedDay) {
      const element = document.getElementById(`day-${selectedDay}-entry`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [selectedDay]);

  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-24 animate-fade-in">
      {selectedDay && selectedEntry && (
        <div className="bg-toxic/10 border-2 border-toxic p-4 rounded flex items-start justify-between">
          <div className="flex-1">
            <p className="text-toxic font-bold text-sm uppercase mb-1">Viewing Day {selectedDay} Entry</p>
            <p className="text-stone-400 text-xs">Scroll down to see the full entry in history</p>
          </div>
          <button
            onClick={onClearSelection}
            className="text-toxic hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="border-l-4 border-rust pl-4 mb-6">
        <h2 className="font-display text-3xl text-white uppercase">Journal</h2>
        <p className="text-stone-400 font-body">Log Your Survival</p>
      </div>

      {/* Safety Warning */}
      <div className="bg-blood/10 border border-blood p-3 rounded flex items-start space-x-3">
        <AlertOctagon className="text-blood w-6 h-6 flex-shrink-0" />
        <p className="text-blood text-xs font-body">
          <span className="font-bold">MEDICAL WARNING:</span> This is not medical advice. If you pass out, faint, or feel actual pain, STOP immediately. Do not blame the calendar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Date and Day Picker */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-stone-500 text-xs uppercase mb-1">Log Date</label>
                <div className="relative">
                    <input 
                        type="date" 
                        required
                        className="w-full bg-stone-950 border border-stone-700 text-white p-3 focus:border-rust outline-none font-body pl-10"
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                    <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-stone-500 pointer-events-none" />
                </div>
            </div>
            <div>
                <label className="block text-stone-500 text-xs uppercase mb-1">Day #</label>
                <div className="relative">
                    <input 
                        type="number" 
                        min="1"
                        max="30"
                        required
                        className="w-full bg-stone-950 border border-stone-700 text-white p-3 focus:border-rust outline-none font-body pl-10"
                        value={formData.day}
                        onChange={e => setFormData({...formData, day: parseInt(e.target.value) || 1})}
                    />
                    <List className="absolute left-3 top-3.5 w-4 h-4 text-stone-500 pointer-events-none" />
                </div>
            </div>
        </div>

        {/* Prompt - Updates based on selected Day */}
        <div className="bg-stone-900 p-4 border border-stone-800 rounded">
            <p className="text-dust font-bold text-sm uppercase mb-2">Day {formData.day} Prompt</p>
            <p className="text-stone-300 italic">"{todayChallenge?.notesPrompt || "Survive."}"</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-stone-500 text-xs uppercase mb-1">Mood / Status</label>
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
              <label className="block text-stone-500 text-xs uppercase mb-1">Symptoms</label>
              <input 
                type="text" 
                className="w-full bg-stone-950 border border-stone-700 text-white p-3 focus:border-rust outline-none font-body"
                placeholder="None, or vivid dreams of lasagna..."
                value={formData.symptoms}
                onChange={e => setFormData({...formData, symptoms: e.target.value})}
              />
            </div>
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

        {/* Markdown Notes Editor */}
        <div>
            <div className="flex items-center justify-between mb-1">
                <label className="block text-stone-500 text-xs uppercase">Mission Notes (Markdown)</label>
                <div className="flex space-x-1 bg-stone-900 rounded p-1 border border-stone-800">
                    <button
                        type="button"
                        onClick={() => setEditorMode('write')}
                        className={`p-1 px-3 text-xs uppercase flex items-center ${editorMode === 'write' ? 'bg-stone-700 text-white' : 'text-stone-500 hover:text-stone-300'}`}
                    >
                        <Edit2 className="w-3 h-3 mr-1" /> Write
                    </button>
                    <button
                        type="button"
                        onClick={() => setEditorMode('preview')}
                        className={`p-1 px-3 text-xs uppercase flex items-center ${editorMode === 'preview' ? 'bg-stone-700 text-white' : 'text-stone-500 hover:text-stone-300'}`}
                    >
                        <Eye className="w-3 h-3 mr-1" /> Preview
                    </button>
                </div>
            </div>
            
            {editorMode === 'write' ? (
                <textarea 
                    className="w-full bg-stone-950 border border-stone-700 text-white p-3 focus:border-rust outline-none font-mono text-sm h-40"
                    placeholder="Use **bold**, *italics*, or - lists..."
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                />
            ) : (
                <div className="w-full bg-stone-900 border border-stone-800 text-stone-300 p-3 h-40 overflow-y-auto prose prose-invert prose-sm max-w-none">
                    {formData.notes ? (
                        <ReactMarkdown 
                            components={{
                                h1: ({node, ...props}) => <h1 className="text-xl font-display text-dust" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-lg font-display text-dust" {...props} />,
                                p: ({node, ...props}) => <p className="mb-2 text-sm" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                                strong: ({node, ...props}) => <strong className="text-rust" {...props} />,
                                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-stone-700 pl-2 italic text-stone-500 my-2" {...props} />,
                            }}
                        >
                            {formData.notes}
                        </ReactMarkdown>
                    ) : (
                        <span className="text-stone-600 italic">Nothing to preview...</span>
                    )}
                </div>
            )}
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

      {/* History */}
      <div className="mt-8 border-t border-stone-800 pt-6">
        <h3 className="font-display text-xl text-stone-400 mb-4">Past Records</h3>
        <div className="space-y-3">
          {entries.length === 0 && <p className="text-stone-600 italic">No records found in the wasteland.</p>}
          {entries.slice().reverse().map((entry, idx) => {
            const isSelected = selectedDay === entry.day;
            return (
            <div
              key={idx}
              id={isSelected ? `day-${entry.day}-entry` : undefined}
              className={`bg-stone-900 p-4 border-l-2 transition-colors group ${
                isSelected ? 'border-toxic bg-toxic/5 ring-2 ring-toxic' : 'border-stone-700 hover:border-rust'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-rust font-bold uppercase text-sm font-display">Day {entry.day}</span>
                <span className="text-stone-600 text-xs font-mono">{new Date(entry.date).toLocaleDateString()}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                 <div className="text-xs">
                     <span className="text-stone-500 uppercase">Mood:</span> <span className="text-stone-300">{entry.mood}</span>
                 </div>
                 <div className="text-xs">
                     <span className="text-stone-500 uppercase">Status:</span> <span className="text-stone-300">{entry.symptoms || "N/A"}</span>
                 </div>
              </div>

              {entry.notes && (
                  <div className="mt-2 pt-2 border-t border-stone-800 text-sm text-stone-400 line-clamp-2 group-hover:line-clamp-none transition-all">
                      <ReactMarkdown allowedElements={['p', 'strong', 'em', 'ul', 'li']}>
                          {entry.notes}
                      </ReactMarkdown>
                  </div>
              )}
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};