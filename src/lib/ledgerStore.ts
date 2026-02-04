
// Simple in-memory ledger store for settled funds
// In a real app, this would be synced with a backend

let availableToWithdrawUSD = 124.50; // Initial deterministic mock value (not 0 to show UI)

const listeners: Set<() => void> = new Set();

export const LedgerStore = {
  getAvailableBalance: () => availableToWithdrawUSD,

  // Credit proceeds from a sale (settlement)
  creditSettlement: (amount: number) => {
    availableToWithdrawUSD += amount;
    LedgerStore.notify();
  },

  // Debit for a withdrawal
  debitWithdrawal: (amount: number) => {
    if (amount > availableToWithdrawUSD) return false;
    availableToWithdrawUSD -= amount;
    LedgerStore.notify();
    return true;
  },

  // Subscribe to changes
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  notify: () => {
    listeners.forEach(l => l());
  }
};
