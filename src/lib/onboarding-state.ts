import { STORAGE_KEYS } from '@/lib/storage-keys';

export interface OnboardingState {
  completed: boolean;
  lastStep?: number;
  timestamp?: number;
}

const STORAGE_KEY = STORAGE_KEYS.ONBOARDING_STATE;
// Legacy key used by older code paths (kept for migration/backwards compatibility)
const LEGACY_KEY = 'onboarding-state';

export function loadOnboardingState(): OnboardingState | null {
  if (typeof window === 'undefined' || !window?.localStorage) {
    return null;
  }

  let raw = window.localStorage.getItem(STORAGE_KEY);
  // Fallback to legacy key for existing installs
  if (!raw) {
    raw = window.localStorage.getItem(LEGACY_KEY) ?? null;
  }
  if (!raw) {
    return null;
  }

  try {
    const state = JSON.parse(raw);
    if (typeof state.completed !== 'boolean') {
      return null;
    }

    return state;
  } catch {
    return null;
  }
}

export function saveOnboardingState(state: OnboardingState): void {
  if (typeof window === 'undefined' || !window?.localStorage) {
    return;
  }

  try {
    // Always write to canonical key; keep legacy key untouched to avoid surprising deletes
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save onboarding state:', error);
  }
}

export function clearOnboardingState(): void {
  if (typeof window === 'undefined' || !window?.localStorage) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function isOnboardingCompleted(): boolean {
  return loadOnboardingState()?.completed === true;
}
