import { createContext, useCallback, useContext, useState } from 'react';

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((type, message) => {
    const id = Math.random().toString(36).slice(2);
    setItems((l) => [...l, { id, type, message }]);
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 4500);
  }, []);
  const toast = { success: (m) => push('success', m), error: (m) => push('error', m) };

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4" aria-live="polite">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`max-w-md rounded-lg px-4 py-3 font-semibold shadow-lg ${t.type === 'success' ? 'bg-field-700 text-white' : 'bg-red-700 text-white'}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
