import { useState, FormEvent } from 'react';

interface JoinRoomFormProps {
  onJoin: (code: string) => void;
  onCancel: () => void;
  error?: string;
}

export function JoinRoomForm({ onJoin, onCancel, error }: JoinRoomFormProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    onJoin(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-slate-800">コードで参加</h2>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">ルームコード</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ABCDEF"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 tracking-widest font-mono text-center uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={8}
          autoFocus
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-slate-200 py-2.5 text-slate-600 font-medium hover:bg-slate-50 transition"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={!code.trim()}
          className="flex-1 rounded-xl bg-slate-900 text-white py-2.5 font-medium disabled:opacity-40 hover:bg-slate-800 transition"
        >
          参加
        </button>
      </div>
    </form>
  );
}
