import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const id = ref<number | null>(null);
  const role = ref<string | null>(null);

  function loadFromStorage(): void {
    try {
      const stored = sessionStorage.getItem('user');
      if (!stored) return;
      const parsed = JSON.parse(atob(stored));
      id.value = parsed.id ?? null;
      role.value = parsed.role ?? null;
    } catch {
      // невалидные данные — игнорируем
    }
  }

  function setUser(userId: number, userRole: string): void {
    id.value = userId;
    role.value = userRole;
    sessionStorage.setItem('user', btoa(JSON.stringify({ id: userId, role: userRole })));
  }

  function logout(): void {
    id.value = null;
    role.value = null;
    sessionStorage.removeItem('user');
  }

  return { id, role, setUser, loadFromStorage, logout };
});
