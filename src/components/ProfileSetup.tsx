import { useState, FormEvent } from 'react';
import { User } from 'lucide-react';

const COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
];

interface ProfileSetupProps {
  onSubmit: (name: string, color: string) => void;
}

export function ProfileSetup({ onSubmit }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[5]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed, color);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-center mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: color + '22' }}
          >
            <User size={32} style={{ color }} />
          </div>
        </div>
        <h1 className="text-center text-xl font-bold text-slate-800 mb-1">setlog</h1>
        <p className="text-center text-sm text-slate-500 mb-6">同じ1日、それぞれの瞬間</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ニックネーム</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="あなたの名前"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={20}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">カラー</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-9 h-9 rounded-full border-2 transition ${
                    color === c ? 'border-slate-800 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`color ${c}`}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-slate-900 text-white rounded-xl py-2.5 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition"
          >
            はじめる
          </button>
        </form>
      </div>
    </div>
  );
}
