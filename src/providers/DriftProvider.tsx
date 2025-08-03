'use client';

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { DriftService } from '../services/DriftService';
import { AppConfig, DriftServiceState } from '../types';

interface DriftContextType {
	driftService: DriftService | null;
	state: DriftServiceState;
	isReady: boolean;
	createUser: () => Promise<void>;
	reconnect: () => Promise<void>;
	disconnect: () => Promise<void>;
}

const DriftContext = createContext<DriftContextType | null>(null);

interface DriftProviderProps {
	children: ReactNode;
}

const DriftProviderContent: React.FC<DriftProviderProps> = ({ children }) => {
	const { wallet, connected, publicKey } = useWallet();

	const [driftService, setDriftService] = useState<DriftService | null>(null);
	const [state, setState] = useState<DriftServiceState>({
		initialized: false,
		connected: false,
		user: null,
		markets: [],
		positions: [],
		loading: false,
		error: null,
	});

	// Simple configuration
	const config: AppConfig = {
		rpcUrl:
			process.env.NEXT_PUBLIC_RPC_URL ||
			process.env.RPC_URL ||
			'https://api.mainnet-beta.solana.com',
		wsUrl:
			process.env.NEXT_PUBLIC_WS_URL ||
			process.env.WS_URL ||
			'wss://api.mainnet-beta.solana.com',
		programId:
			process.env.NEXT_PUBLIC_PROGRAM_ID ||
			process.env.PROGRAM_ID ||
			'dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH',
		commitment: 'confirmed',
		environment: 'mainnet-beta',
	};

	// Initialize DriftService when wallet connects
	useEffect(() => {
		if (connected && publicKey && wallet) {
			const initService = async () => {
				try {
					setState((prev) => ({ ...prev, loading: true, error: null }));

					const newService = new DriftService(config);
					const walletInterface = {
						publicKey,
						adapter: wallet.adapter,
					};

					await newService.initialize(walletInterface);
					setDriftService(newService);
					setState((prev) => ({
						...prev,
						initialized: true,
						connected: true,
						loading: false,
					}));
				} catch (error: any) {
					console.error('Failed to initialize DriftService:', error);
					setState((prev) => ({
						...prev,
						error: error.message,
						loading: false,
					}));
				}
			};

			initService();
		} else {
			// Clean up when wallet disconnects
			if (driftService) {
				driftService.disconnect();
				setDriftService(null);
			}
			setState({
				initialized: false,
				connected: false,
				user: null,
				markets: [],
				positions: [],
				loading: false,
				error: null,
			});
		}
	}, [connected, publicKey, wallet]);

	const contextValue: DriftContextType = {
		driftService,
		state,
		isReady: state.initialized && state.connected,
		createUser: async () => {
			if (driftService) {
				try {
					setState((prev) => ({ ...prev, loading: true, error: null }));
					await driftService.createUser();
					setState((prev) => ({ ...prev, loading: false }));
				} catch (error: any) {
					setState((prev) => ({
						...prev,
						error: error.message,
						loading: false,
					}));
				}
			}
		},
		reconnect: async () => {
			// Simple reconnect - just trigger re-initialization
			if (connected && publicKey) {
				window.location.reload();
			}
		},
		disconnect: async () => {
			if (driftService) {
				driftService.disconnect();
				setDriftService(null);
			}
			setState({
				initialized: false,
				connected: false,
				user: null,
				markets: [],
				positions: [],
				loading: false,
				error: null,
			});
		},
	};

	return (
		<DriftContext.Provider value={contextValue}>
			{children}
		</DriftContext.Provider>
	);
};

export const DriftProvider: React.FC<DriftProviderProps> = ({ children }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// During SSR, provide a default context
	if (!mounted) {
		const defaultValue: DriftContextType = {
			driftService: null,
			state: {
				initialized: false,
				connected: false,
				user: null,
				markets: [],
				positions: [],
				loading: false,
				error: null,
			},
			isReady: false,
			createUser: async () => {},
			reconnect: async () => {},
			disconnect: async () => {},
		};

		return (
			<DriftContext.Provider value={defaultValue}>
				{children}
			</DriftContext.Provider>
		);
	}

	// After hydration, render the full provider
	return <DriftProviderContent>{children}</DriftProviderContent>;
};

export const useDrift = () => {
	const context = useContext(DriftContext);
	if (!context) {
		throw new Error('useDrift must be used within a DriftProvider');
	}
	return context;
};
