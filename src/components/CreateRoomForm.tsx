import { useState, FormEvent } from 'react';
import type { MemberSize } from '../types';

interface CreateRoomFormProps {
  onCreate: (name: string, maxMembers: MemberSize) => void;
  onCancel: () => void;
}

const SIZE_LABELS: Record<MemberSize, string> = {
  2: '2人',
  3: '3人',
  4: '4人',
  20: '5〜20人',
};

export function CreateRoomForm({ onCreate, onCancel }: CreateRoomFormProps) {
  const [name, setName] = useState('');
  const [size, setSize] = useState<MemberSize>(20);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed, size);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-slate-800">ログルームを作成</h2>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">ルーム名</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例：大学の友達"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={30}
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">人数</label>
        <div className="grid grid-cols-4 gap-2">
          {([2, 3, 4, 20] as MemberSize[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`rounded-xl border px-2 py-2 text-sm font-medium transition ${
                size === s
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {SIZE_LABELS[s]}
            </button>
          ))}
        </div>
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
          disabled={!name.trim()}
          className="flex-1 rounded-xl bg-slate-900 text-white py-2.5 font-medium disabled:opacity-40 hover:bg-slate-800 transition"
        >
          作成
        </button>
      </div>
    </form>
  );
}
