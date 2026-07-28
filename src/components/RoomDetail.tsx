import type { LogRoom } from '../types';

interface RoomDetailProps {
  room: LogRoom;
  onBack: () => void;
}

export function RoomDetail({ room, onBack }: RoomDetailProps) {
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1"
      >
        ← 戻る
      </button>
      <h1 className="text-xl font-bold text-slate-800">{room.name}</h1>
      <p className="text-sm text-slate-500">コード: {room.code}</p>
      <p className="text-sm text-slate-500 mt-2">
        メンバー: {room.members.map((m) => m.name).join(', ')}
      </p>
    </div>
  );
}
