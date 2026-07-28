import { useState, FormEvent } from 'react';
import {
  ArrowLeft,
  Lock,
  Unlock,
  Grid3X3,
  List,
  MessageCircle,
  Send,
  ImagePlus,
} from 'lucide-react';
import type { LogRoom, LogPost, ZipPost, Profile } from '../types';

interface RoomDetailProps {
  room: LogRoom;
  me: Profile;
  onBack: () => void;
  onToggleLock: () => void;
  onToggleLayout: () => void;
  onAddLog: (
    imageUrl: string | undefined,
    caption: string,
    orientation: 'landscape' | 'portrait'
  ) => void;
  onAddZip: (imageUrl: string | undefined, text: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onAddReaction: (postId: string, emoji: string) => void;
}

const EMOJIS = ['❤️', '😂', '🔥', '👍', '😭', '😍', '👀', '🎉'];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
}

function memberName(room: LogRoom, memberId: string) {
  return room.members.find((m) => m.id === memberId)?.name ?? 'unknown';
}

function memberColor(room: LogRoom, memberId: string) {
  return room.members.find((m) => m.id === memberId)?.color ?? '#94a3b8';
}

function groupByDate<T extends { createdAt: string }>(items: T[]) {
  const map = new Map<string, T[]>();
  const sorted = [...items].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  for (const item of sorted) {
    const key = formatDate(item.createdAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return map;
}

export function RoomDetail({
  room,
  me,
  onBack,
  onToggleLock,
  onToggleLayout,
  onAddLog,
  onAddZip,
  onAddComment,
  onAddReaction,
}: RoomDetailProps) {
  const [tab, setTab] = useState<'logs' | 'zips'>('logs');
  const [logImage, setLogImage] = useState('');
  const [logCaption, setLogCaption] = useState('');
  const [logOrientation, setLogOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [zipImage, setZipImage] = useState('');
  const [zipText, setZipText] = useState('');
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const handleLogSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddLog(logImage.trim() || undefined, logCaption, logOrientation);
    setLogImage('');
    setLogCaption('');
  };

  const handleZipSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddZip(zipImage.trim() || undefined, zipText);
    setZipImage('');
    setZipText('');
  };

  const logsByDate = groupByDate(room.logs);
  const reversedDates = Array.from(logsByDate.keys()).reverse();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="p-1 -ml-1 text-slate-600 hover:text-slate-900">
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="font-bold text-slate-800 leading-tight">{room.name}</h1>
              <p className="text-[10px] text-slate-500">
                コード {room.code} · {room.members.length}/{room.maxMembers === 5 ? '20' : room.maxMembers}人
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleLayout}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              title={room.classicLayout ? '新レイアウト' : 'クラシックレイアウト'}
            >
              {room.classicLayout ? <Grid3X3 size={18} /> : <List size={18} />}
            </button>
            <button
              onClick={onToggleLock}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              title={room.locked ? 'ロック解除' : 'ルームをロック'}
            >
              {room.locked ? <Lock size={18} /> : <Unlock size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {room.locked && (
          <div className="bg-amber-50 text-amber-800 text-xs rounded-xl px-3 py-2 flex items-center gap-2">
            <Lock size={14} />
            ルームはロック中です。新規参加はできません。
          </div>
        )}

        <div className="flex bg-white rounded-2xl p-1 shadow-sm">
          <button
            onClick={() => setTab('logs')}
            className={`flex-1 py-2 text-sm font-medium rounded-xl transition ${
              tab === 'logs' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Log
          </button>
          <button
            onClick={() => setTab('zips')}
            className={`flex-1 py-2 text-sm font-medium rounded-xl transition ${
              tab === 'zips' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Zip
          </button>
        </div>

        {tab === 'logs' ? (
          <>
            <form onSubmit={handleLogSubmit} className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-800">今日のlogを追加</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={logImage}
                  onChange={(e) => setLogImage(e.target.value)}
                  placeholder="画像URL（任意）"
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setLogOrientation('landscape')}
                    className={`px-3 py-2 rounded-xl border text-xs ${
                      logOrientation === 'landscape'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    横
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogOrientation('portrait')}
                    className={`px-3 py-2 rounded-xl border text-xs ${
                      logOrientation === 'portrait'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    縦
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={logCaption}
                onChange={(e) => setLogCaption(e.target.value)}
                placeholder="キャプション（任意）"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-slate-900 text-white rounded-xl py-2 text-sm font-medium hover:bg-slate-800 transition"
              >
                Logを追加
              </button>
            </form>

            <div className="space-y-6">
              {reversedDates.map((date) => (
                <section key={date}>
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    {date}
                  </h2>
                  <div
                    className={`grid gap-3 ${
                      room.classicLayout ? 'grid-cols-1' : 'grid-cols-2'
                    }`}
                  >
                    {logsByDate.get(date)!.map((log) => (
                      <LogCard
                        key={log.id}
                        room={room}
                        me={me}
                        log={log}
                        compact={!room.classicLayout}
                        onReact={(emoji) => onAddReaction(log.id, emoji)}
                        onComment={(text) => onAddComment(log.id, text)}
                        commentValue={commentText[log.id] ?? ''}
                        onCommentChange={(text) =>
                          setCommentText((prev) => ({ ...prev, [log.id]: text }))
                        }
                      />
                    ))}
                  </div>
                </section>
              ))}
              {room.logs.length === 0 && (
                <div className="text-center py-16 text-slate-400 text-sm">
                  まだlogがありません。<br />
                  最初の瞬間を共有しましょう。
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleZipSubmit} className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-800">Zip：今を送る</h3>
              <input
                type="text"
                value={zipImage}
                onChange={(e) => setZipImage(e.target.value)}
                placeholder="画像URL（任意）"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={zipText}
                onChange={(e) => setZipText(e.target.value)}
                placeholder="テキスト（任意）"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-slate-900 text-white rounded-xl py-2 text-sm font-medium hover:bg-slate-800 transition"
              >
                Zipを送る
              </button>
            </form>

            <div className="space-y-3">
              {[...room.zips]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
                .map((zip) => (
                  <ZipCard
                    key={zip.id}
                    room={room}
                    me={me}
                    zip={zip}
                    onReact={(emoji) => onAddReaction(zip.id, emoji)}
                    onComment={(text) => onAddComment(zip.id, text)}
                    commentValue={commentText[zip.id] ?? ''}
                    onCommentChange={(text) =>
                      setCommentText((prev) => ({ ...prev, [zip.id]: text }))
                    }
                  />
                ))}
              {room.zips.length === 0 && (
                <div className="text-center py-16 text-slate-400 text-sm">
                  まだZipがありません。
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

interface PostCardProps {
  room: LogRoom;
  me: Profile;
  onReact: (emoji: string) => void;
  onComment: (text: string) => void;
  commentValue: string;
  onCommentChange: (text: string) => void;
}

function LogCard({
  room,
  log,
  compact,
  ...actions
}: PostCardProps & { log: LogPost; compact: boolean }) {
  const [showComment, setShowComment] = useState(false);

  return (
    <article
      className={`bg-white rounded-2xl shadow-sm overflow-hidden ${
        compact && log.orientation === 'landscape' ? 'col-span-2' : ''
      }`}
    >
      <div className="p-3 flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ backgroundColor: memberColor(room, log.memberId) }}
        >
          {memberName(room, log.memberId).slice(0, 1)}
        </div>
        <span className="text-xs font-medium text-slate-700">
          {memberName(room, log.memberId)}
        </span>
        <span className="ml-auto text-[10px] text-slate-400">{formatTime(log.createdAt)}</span>
      </div>
      {log.imageUrl ? (
        <div className={`bg-slate-100 ${compact ? 'h-40' : 'h-56'} flex items-center justify-center overflow-hidden`}>
          <img
            src={log.imageUrl}
            alt="log"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className={`bg-slate-100 ${compact ? 'h-24' : 'h-32'} flex items-center justify-center`}>
          <ImagePlus size={24} className="text-slate-300" />
        </div>
      )}
      {log.caption && <p className="px-3 py-2 text-sm text-slate-700">{log.caption}</p>}
      <Actions room={room} postId={log.id} showComment={showComment} setShowComment={setShowComment} {...actions} />
    </article>
  );
}

function ZipCard({ room, zip, ...actions }: PostCardProps & { zip: ZipPost }) {
  const [showComment, setShowComment] = useState(false);

  return (
    <article className="bg-white rounded-2xl shadow-sm p-3">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ backgroundColor: memberColor(room, zip.memberId) }}
        >
          {memberName(room, zip.memberId).slice(0, 1)}
        </div>
        <span className="text-xs font-medium text-slate-700">
          {memberName(room, zip.memberId)}
        </span>
        <span className="ml-auto text-[10px] text-slate-400">{formatTime(zip.createdAt)}</span>
      </div>
      {zip.imageUrl && (
        <div className="rounded-xl bg-slate-100 h-48 mb-2 overflow-hidden">
          <img
            src={zip.imageUrl}
            alt="zip"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      {zip.text && <p className="text-sm text-slate-700 mb-2">{zip.text}</p>}
      <Actions room={room} postId={zip.id} showComment={showComment} setShowComment={setShowComment} {...actions} />
    </article>
  );
}

interface ActionsProps extends PostCardProps {
  postId: string;
  showComment: boolean;
  setShowComment: (v: boolean) => void;
}

function Actions({
  room,
  postId,
  onReact,
  onComment,
  commentValue,
  onCommentChange,
  showComment,
  setShowComment,
}: ActionsProps) {
  const reactions = room.reactions[postId] ?? [];
  const comments = room.comments[postId] ?? [];
  const counts = reactions.reduce<Record<string, number>>((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] ?? 0) + 1;
    return acc;
  }, {});

  const handleCommentSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!commentValue.trim()) return;
    onComment(commentValue.trim());
    onCommentChange('');
  };

  return (
    <div className="px-3 pb-3">
      <div className="flex items-center gap-1 mb-2">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onReact(emoji)}
            className="text-lg hover:scale-110 transition p-0.5 rounded"
          >
            {emoji}
          </button>
        ))}
        <button
          onClick={() => setShowComment(!showComment)}
          className="ml-auto p-1.5 text-slate-500 hover:text-slate-800"
        >
          <MessageCircle size={18} />
        </button>
      </div>
      {Object.entries(counts).length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {Object.entries(counts).map(([emoji, count]) => (
            <span
              key={emoji}
              className="inline-flex items-center gap-1 text-xs bg-slate-100 rounded-full px-2 py-0.5 text-slate-700"
            >
              {emoji} {count}
            </span>
          ))}
        </div>
      )}
      {comments.length > 0 && (
        <div className="space-y-1.5 mb-2">
          {comments.map((c) => (
            <div key={c.id} className="text-xs text-slate-600">
              <span className="font-bold" style={{ color: memberColor(room, c.memberId) }}>
                {memberName(room, c.memberId)}
              </span>{' '}
              {c.text}
            </div>
          ))}
        </div>
      )}
      {showComment && (
        <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-2">
          <input
            type="text"
            value={commentValue}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="コメント..."
            className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="submit"
            disabled={!commentValue.trim()}
            className="p-1.5 text-slate-600 disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </form>
      )}
    </div>
  );
}
