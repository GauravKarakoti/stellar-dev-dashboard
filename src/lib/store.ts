import { create } from 'zustand'
import { getStoredValue, setStoredValue } from './storage'
import { syncState, onStateChange } from '../utils/stateSync'
import type {
  NetworkName,
  NetworkStats,
} from './stellar'
import type { Horizon, SorobanRpc } from '@stellar/stellar-sdk'

export interface SearchFilters {
  status: 'all' | 'success' | 'failed'
  memoOnly: boolean
  minFee: string
  maxFee: string
  type: string
}

export interface ComparisonSlot {
  key: string
  data: Horizon.AccountResponse | null
  loading: boolean
  error: string | null
}

export interface Notification {
  id: string
  type: string
  title: string
  [key: string]: unknown
}

export interface StreamLedger {
  sequence: number
  [key: string]: unknown
}

const THEME_STORAGE_KEY = 'stellar-dashboard-theme'

// --- System Preference Detection ---
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
  return 'dark';
};

export interface StoreState {
  network: NetworkName
  setNetwork: (network: NetworkName) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  connectedAddress: string | null
  accountData: Horizon.AccountResponse | null
  accountLoading: boolean
  accountError: string | null
  setConnectedAddress: (address: string | null) => void
  setAccountData: (data: Horizon.AccountResponse) => void
  setAccountLoading: (loading: boolean) => void
  setAccountError: (error: string | null) => void
  transactions: Horizon.ServerApi.TransactionRecord[]
  txLoading: boolean
  setTransactions: (txs: Horizon.ServerApi.TransactionRecord[]) => void
  appendTransactions: (txs: Horizon.ServerApi.TransactionRecord[]) => void
  setTxLoading: (v: boolean) => void
  txNextCursor: string | null
  txHasMore: boolean
  txPagingLoading: boolean
  setTxNextCursor: (cursor: string | null) => void
  setTxHasMore: (hasMore: boolean) => void
  setTxPagingLoading: (v: boolean) => void
  operations: Horizon.ServerApi.OperationRecord[]
  opsLoading: boolean
  setOperations: (ops: Horizon.ServerApi.OperationRecord[]) => void
  appendOperations: (ops: Horizon.ServerApi.OperationRecord[]) => void
  setOpsLoading: (v: boolean) => void
  opsNextCursor: string | null
  opsHasMore: boolean
  opsPagingLoading: boolean
  setOpsNextCursor: (cursor: string | null) => void
  setOpsHasMore: (hasMore: boolean) => void
  setOpsPagingLoading: (v: boolean) => void
  networkStats: NetworkStats | null
  statsLoading: boolean
  setNetworkStats: (stats: NetworkStats | ((prev: NetworkStats | null) => NetworkStats)) => void
  setStatsLoading: (v: boolean) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  faucetLoading: boolean
  faucetResult: unknown
  setFaucetLoading: (v: boolean) => void
  setFaucetResult: (r: unknown) => void
  contractId: string
  contractData: SorobanRpc.Api.LedgerEntryResult | null
  contractLoading: boolean
  contractError: string | null
  setContractId: (id: string) => void
  setContractData: (data: SorobanRpc.Api.LedgerEntryResult) => void
  setContractLoading: (v: boolean) => void
  setContractError: (e: string | null) => void
  deploymentStatus: Record<string, unknown> | null
  setDeploymentStatus: (s: Record<string, unknown> | null) => void
  savedSearches: string[]
  setSavedSearches: (s: string[]) => void
  multiSigMode: boolean
  setMultiSigMode: (v: boolean) => void
  selectedTemplateId: string | null
  setSelectedTemplateId: (id: string | null) => void
  preferencesOpen: boolean
  setPreferencesOpen: (open: boolean) => void
  globalError: { message: string; category: string } | null
  setGlobalError: (err: { message: string; category: string } | null) => void
  prices: Record<string, { usd: number | null; usd_24h_change: number | null }>
  pricesLoading: boolean
  pricesError: string | null
  setPrices: (prices: Record<string, { usd: number | null; usd_24h_change: number | null }>) => void
  setPricesLoading: (loading: boolean) => void
  setPricesError: (error: string | null) => void
  searchFilters: SearchFilters
  setSearchFilters: (filters: Partial<SearchFilters>) => void
  comparisonSlots: ComparisonSlot[]
  addComparisonSlot: () => void
  removeComparisonSlot: (index: number) => void
  reorderComparisonSlots: (orderedSlots: ComparisonSlot[]) => void
  setComparisonKey: (index: number, key: string) => void
  setComparisonData: (index: number, data: Horizon.AccountResponse | null) => void
  setComparisonLoading: (index: number, loading: boolean) => void
  setComparisonError: (index: number, error: string | null) => void
  walletConnected: boolean
  walletType: string | null
  walletPublicKey: string | null
  setWalletConnected: (connected: boolean, type?: string | null, publicKey?: string | null) => void
  disconnectWallet: () => void
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  streamStatus: string
  streamLedgers: StreamLedger[]
  streamError: string | null
  setStreamStatus: (status: string) => void
  addStreamLedger: (ledger: StreamLedger) => void
  clearStreamLedgers: () => void
  setStreamError: (e: string | null) => void
}

export const useStore = create<StoreState>((set, get) => ({
  network: 'testnet',
  setNetwork: (network) => {
    set({
      network,
      accountData: null,
      transactions: [],
      operations: [],
      txNextCursor: null,
      txHasMore: false,
      txPagingLoading: false,
      opsNextCursor: null,
      opsHasMore: false,
      opsPagingLoading: false,
    })
  },

  theme: getInitialTheme(),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light'
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme)
    }
    return { theme: newTheme }
  }),
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  connectedAddress: null,
  accountData: null,
  accountLoading: false,
  accountError: null,
  setConnectedAddress: (address) => set({ connectedAddress: address }),
  setAccountData: (data) => set({ accountData: data, accountError: null }),
  setAccountLoading: (loading) => set({ accountLoading: loading }),
  setAccountError: (error) => set({ accountError: error }),

  transactions: [],
  txLoading: false,
  setTransactions: (txs) => set({ transactions: txs }),
  appendTransactions: (txs) => set((state) => {
    const existing = new Set(state.transactions.map(tx => tx.id))
    const merged = [...state.transactions, ...txs.filter(tx => !existing.has(tx.id))]
    return { transactions: merged }
  }),
  setTxLoading: (v) => set({ txLoading: v }),
  txNextCursor: null,
  txHasMore: false,
  txPagingLoading: false,
  setTxNextCursor: (cursor) => set({ txNextCursor: cursor }),
  setTxHasMore: (hasMore) => set({ txHasMore: hasMore }),
  setTxPagingLoading: (v) => set({ txPagingLoading: v }),

  operations: [],
  opsLoading: false,
  setOperations: (ops) => set({ operations: ops }),
  appendOperations: (ops) => set((state) => {
    const existing = new Set(state.operations.map(op => op.id))
    const merged = [...state.operations, ...ops.filter(op => !existing.has(op.id))]
    return { operations: merged }
  }),
  setOpsLoading: (v) => set({ opsLoading: v }),
  opsNextCursor: null,
  opsHasMore: false,
  opsPagingLoading: false,
  setOpsNextCursor: (cursor) => set({ opsNextCursor: cursor }),
  setOpsHasMore: (hasMore) => set({ opsHasMore: hasMore }),
  setOpsPagingLoading: (v) => set({ opsPagingLoading: v }),

  networkStats: null,
  statsLoading: false,
  setNetworkStats: (stats) => set((state) => ({
    networkStats: typeof stats === 'function' ? stats(state.networkStats) : stats,
    statsLoading: false
  })),
  setStatsLoading: (v) => set({ statsLoading: v }),

  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),

  faucetLoading: false,
  faucetResult: null,
  setFaucetLoading: (v) => set({ faucetLoading: v }),
  setFaucetResult: (r) => set({ faucetResult: r }),

  contractId: '',
  contractData: null,
  contractLoading: false,
  contractError: null,
  setContractId: (id) => set({ contractId: id }),
  setContractData: (data) => set({ contractData: data, contractError: null }),
  setContractLoading: (v) => set({ contractLoading: v }),
  setContractError: (e) => set({ contractError: e }),
  deploymentStatus: null,
  setDeploymentStatus: (s) => set({ deploymentStatus: s }),
  savedSearches: [],
  setSavedSearches: (s) => set({ savedSearches: s }),
  multiSigMode: false,
  setMultiSigMode: (v) => set({ multiSigMode: v }),

  selectedTemplateId: null,
  setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),

  preferencesOpen: false,
  setPreferencesOpen: (open) => set({ preferencesOpen: open }),

  globalError: null,
  setGlobalError: (err) => set({ globalError: err }),

  prices: {},
  pricesLoading: false,
  pricesError: null,
  setPrices: (prices) => set({ prices, pricesError: null }),
  setPricesLoading: (loading) => set({ pricesLoading: loading }),
  setPricesError: (error) => set({ pricesError: error }),

  searchFilters: { status: 'all', memoOnly: false, minFee: '', maxFee: '', type: '' },
  setSearchFilters: (filters) => set((state) => ({ searchFilters: { ...state.searchFilters, ...filters } })),

  comparisonSlots: [],
  addComparisonSlot: () => set((state) => ({ comparisonSlots: [...state.comparisonSlots, { key: '', data: null, loading: false, error: null }] })),
  removeComparisonSlot: (index) => set((state) => ({ comparisonSlots: state.comparisonSlots.filter((_, i) => i !== index) })),
  reorderComparisonSlots: (orderedSlots) => set({ comparisonSlots: orderedSlots }),
  setComparisonKey: (index, key) => set((state) => {
    const next = [...state.comparisonSlots]
    if (next[index]) next[index].key = key
    return { comparisonSlots: next }
  }),
  setComparisonData: (index, data) => set((state) => {
    const next = [...state.comparisonSlots]
    if (next[index]) { next[index].data = data; next[index].error = null; }
    return { comparisonSlots: next }
  }),
  setComparisonLoading: (index, loading) => set((state) => {
    const next = [...state.comparisonSlots]
    if (next[index]) next[index].loading = loading
    return { comparisonSlots: next }
  }),
  setComparisonError: (index, error) => set((state) => {
    const next = [...state.comparisonSlots]
    if (next[index]) next[index].error = error
    return { comparisonSlots: next }
  }),

  walletConnected: false,
  walletType: null,
  walletPublicKey: null,
  setWalletConnected: (connected, type = null, publicKey = null) => set({ walletConnected: connected, walletType: type, walletPublicKey: publicKey }),
  disconnectWallet: () => set({ walletConnected: false, walletType: null, walletPublicKey: null }),

  notifications: [],
  addNotification: (n) => set((state) => ({ notifications: [n, ...state.notifications] })),
  removeNotification: (id) => set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })),

  streamStatus: 'disconnected',
  streamLedgers: [],
  streamError: null,
  setStreamStatus: (status) => set({ streamStatus: status }),
  addStreamLedger: (l) => set((state) => ({ streamLedgers: [l, ...state.streamLedgers].slice(0, 50) })),
  clearStreamLedgers: () => set({ streamLedgers: [] }),
  setStreamError: (e) => set({ streamError: e }),
}))
