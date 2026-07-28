import { useState, useEffect, useCallback } from 'react';
import type {
  AppState,
  LogRoom,
  Profile,
  LogPost,
  ZipPost,
  MemberSize,
  Comment,
  Reaction,
} from './types';
import { loadState, saveState } from './storage';

const initialState = (): AppState => ({
  me: null,
  rooms: [],
});

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function generateCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function useSetlog() {
  const [state, setState] = useState<AppState>(() => loadState() ?? initialState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setMe = useCallback((name: string, color: string) => {
    const me: Profile = { id: generateId(), name, color };
    setState((prev) => ({ ...prev, me }));
  }, []);

  const createRoom = useCallback(
    (name: string, maxMembers: MemberSize) => {
      if (!state.me) return;
      const room: LogRoom = {
        id: generateId(),
        name,
        code: generateCode(),
        maxMembers,
        locked: false,
        members: [state.me],
        logs: [],
        zips: [],
        comments: {},
        reactions: {},
        classicLayout: false,
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({ ...prev, rooms: [...prev.rooms, room] }));
      return room.id;
    },
    [state.me]
  );

  const joinRoom = useCallback(
    (code: string) => {
      if (!state.me) return 'no_me' as const;
      const room = state.rooms.find((r) => r.code === code.toUpperCase());
      if (!room) return 'not_found' as const;
      if (room.locked) return 'locked' as const;
      if (room.members.length >= room.maxMembers) return 'full' as const;
      if (room.members.some((m) => m.id === state.me!.id)) return 'already_joined' as const;
      const updated = { ...room, members: [...room.members, state.me] };
      setState((prev) => ({
        ...prev,
        rooms: prev.rooms.map((r) => (r.id === room.id ? updated : r)),
      }));
      return 'ok' as const;
    },
    [state.me, state.rooms]
  );

  const toggleLock = useCallback((roomId: string) => {
    setState((prev) => ({
      ...prev,
      rooms: prev.rooms.map((r) => (r.id === roomId ? { ...r, locked: !r.locked } : r)),
    }));
  }, []);

  const toggleLayout = useCallback((roomId: string) => {
    setState((prev) => ({
      ...prev,
      rooms: prev.rooms.map((r) =>
        r.id === roomId ? { ...r, classicLayout: !r.classicLayout } : r
      ),
    }));
  }, []);

  const addLog = useCallback(
    (
      roomId: string,
      imageUrl: string | undefined,
      caption: string,
      orientation: 'landscape' | 'portrait'
    ) => {
      if (!state.me) return;
      const post: LogPost = {
        id: generateId(),
        memberId: state.me.id,
        imageUrl,
        caption: caption.trim() || undefined,
        createdAt: new Date().toISOString(),
        orientation,
      };
      setState((prev) => ({
        ...prev,
        rooms: prev.rooms.map((r) => (r.id === roomId ? { ...r, logs: [...r.logs, post] } : r)),
      }));
    },
    [state.me]
  );

  const addZip = useCallback(
    (roomId: string, imageUrl: string | undefined, text: string) => {
      if (!state.me) return;
      const post: ZipPost = {
        id: generateId(),
        memberId: state.me.id,
        imageUrl,
        text: text.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        rooms: prev.rooms.map((r) => (r.id === roomId ? { ...r, zips: [...r.zips, post] } : r)),
      }));
    },
    [state.me]
  );

  const addComment = useCallback(
    (roomId: string, postId: string, text: string) => {
      if (!state.me) return;
      const comment: Comment = {
        id: generateId(),
        memberId: state.me.id,
        text: text.trim(),
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        rooms: prev.rooms.map((r) => {
          if (r.id !== roomId) return r;
          const list = r.comments[postId] ?? [];
          return { ...r, comments: { ...r.comments, [postId]: [...list, comment] } };
        }),
      }));
    },
    [state.me]
  );

  const addReaction = useCallback(
    (roomId: string, postId: string, emoji: string) => {
      if (!state.me) return;
      const reaction: Reaction = { emoji, memberId: state.me.id };
      setState((prev) => ({
        ...prev,
        rooms: prev.rooms.map((r) => {
          if (r.id !== roomId) return r;
          const list = r.reactions[postId] ?? [];
          const existing = list.find(
            (x) => x.memberId === state.me!.id && x.emoji === emoji
          );
          const next = existing ? list.filter((x) => x !== existing) : [...list, reaction];
          return { ...r, reactions: { ...r.reactions, [postId]: next } };
        }),
      }));
    },
    [state.me]
  );

  return {
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
  };
}
