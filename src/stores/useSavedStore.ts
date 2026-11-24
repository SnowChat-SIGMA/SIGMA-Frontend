import { create } from 'zustand';

interface Toast {
  text: string;
  kind: 'saved' | 'unsaved';
  noticeId: string;
}

interface SavedState {
  savedIds: string[];
  toast: Toast | null;
  toggleSave: (id: string) => void;
  undo: () => void;
}

let timer: ReturnType<typeof setTimeout> | undefined;

export const useSavedStore = create<SavedState>((set, get) => ({
  savedIds: ['acad', 'exam', 'tour', 'grad', 'gemini', 'thesis', 'mentor'],
  toast: null,

  toggleSave: (id) => {
    const isSaved = get().savedIds.includes(id);
    set({
      savedIds: isSaved
        ? get().savedIds.filter((x) => x !== id)
        : [...get().savedIds, id],
      toast: isSaved
        ? { text: '저장을 해제했어요', kind: 'unsaved', noticeId: id }
        : { text: '내 라이브러리에 저장했어요', kind: 'saved', noticeId: id },
    });
    clearTimeout(timer);
    timer = setTimeout(() => set({ toast: null }), isSaved ? 5000 : 3000);
  },

  undo: () => {
    const toast = get().toast;
    if (!toast) return;
    clearTimeout(timer);
    set({ savedIds: [...get().savedIds, toast.noticeId], toast: null });
  },
}));