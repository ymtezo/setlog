import { useState } from 'react';
import { useSetlog } from './useSetlog';
import { ProfileSetup } from './components/ProfileSetup';
import { RoomList } from './components/RoomList';
import { CreateRoomForm } from './components/CreateRoomForm';
import { JoinRoomForm } from './components/JoinRoomForm';
import { RoomDetail } from './components/RoomDetail';
import type { MemberSize } from './types';

type View = 'list' | 'create' | 'join' | 'room';

const JOIN_ERROR: Record<string, string> = {
  not_found: 'ルームが見つかりませんでした。',
  locked: 'このルームはロック中です。',
  full: '定員に達しています。',
  already_joined: 'すでに参加しています。',
};

function App() {
  const {
    state,
    setMe,
    createRoom,
    joinRoom,
    toggleLock,
    toggleLayout,
    addLog,
    addZip,
    addComment,
    addReaction,
  } = useSetlog();
  const [view, setView] = useState<View>('list');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string>();

  if (!state.me) {
    return <ProfileSetup onSubmit={setMe} />;
  }

  if (view === 'create') {
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <CreateRoomForm
            onCreate={(name: string, maxMembers: MemberSize) => {
              const id = createRoom(name, maxMembers);
              if (id) {
                setSelectedRoomId(id);
                setView('room');
              }
            }}
            onCancel={() => setView('list')}
          />
        </div>
      </div>
    );
  }

  if (view === 'join') {
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <JoinRoomForm
            onJoin={(code: string) => {
              const result = joinRoom(code);
              if (result === 'ok') {
                setJoinError(undefined);
                setView('list');
              } else {
                setJoinError(JOIN_ERROR[result] ?? '参加できませんでした。');
              }
            }}
            onCancel={() => setView('list')}
            error={joinError}
          />
        </div>
      </div>
    );
  }

  if (view === 'room' && selectedRoomId) {
    const room = state.rooms.find((r) => r.id === selectedRoomId);
    if (room) {
      return (
        <RoomDetail
          room={room}
          me={state.me}
          onBack={() => {
            setSelectedRoomId(null);
            setView('list');
          }}
          onToggleLock={() => toggleLock(room.id)}
          onToggleLayout={() => toggleLayout(room.id)}
          onAddLog={(imageUrl, caption, orientation) =>
            addLog(room.id, imageUrl, caption, orientation)
          }
          onAddZip={(imageUrl, text) => addZip(room.id, imageUrl, text)}
          onAddComment={(postId, text) => addComment(room.id, postId, text)}
          onAddReaction={(postId, emoji) => addReaction(room.id, postId, emoji)}
        />
      );
    }
  }

  return (
    <RoomList
      me={state.me}
      rooms={state.rooms}
      onSelect={(id: string) => {
        setSelectedRoomId(id);
        setView('room');
      }}
      onCreateClick={() => setView('create')}
      onJoinClick={() => setView('join')}
    />
  );
}

export default App;
