import { Plus, Users, LogIn, Lock } from 'lucide-react';
import type { LogRoom, Profile } from '../types';

interface RoomListProps {
  me: Profile;
  rooms: LogRoom[];
  onSelect: (id: string) => void;
  onCreateClick: () => void;
  onJoinClick: () => void;
}

export function RoomList({ me, rooms, onSelect, onCreateClick, onJoinClick }: RoomListProps) {
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <header className="max-w-md mx-auto flex items-center justify-between py-4 mb-2">
        <div>
          <h1 className="text-xl font-bold text-slate-800">setlog</h1>
          <p className="text-xs text-slate-500">ようこそ、{me.name} さん</p>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ backgroundColor: me.color }}
        >
          {me.name.slice(0, 1)}
        </div>
      </header>

      <div className="max-w-md mx-auto space-y-3">
        {rooms.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            まだログルームがありません。<br />
            友達とルームを作って、日常を共有しましょう。
          </div>
        ) : (
          rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => onSelect(room.id)}
              className="w-full text-left bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-800">{room.name}</h2>
                  {room.locked && <Lock size={14} className="text-slate-400" />}
                </div>
                <p className="text-xs text-slate-500 mt-1">コード: {room.code}</p>
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <Users size={16} />
                <span>{room.members.length}</span>
                <span className="text-slate-400">/{room.maxMembers === 5 ? '20' : room.maxMembers}</span>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="max-w-md mx-auto flex gap-3 mt-6">
        <button
          onClick={onCreateClick}
          className="flex-1 bg-slate-900 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition"
        >
          <Plus size={18} />
          ルームを作成
        </button>
        <button
          onClick={onJoinClick}
          className="flex-1 bg-white text-slate-800 border border-slate-200 rounded-xl py-3 font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition"
        >
          <LogIn size={18} />
          コードで参加
        </button>
      </div>
    </div>
  );
}
