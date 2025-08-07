import { Connection } from '@solana/web3.js';
import {
	UIMarketData,
	UIPosition,
	DriftServiceState,
	AppConfig,
	OrderFormData,
} from '../types';
import { COMMODITY_TOKENS } from '../config/tokens';
import { EventEmitter } from 'events';

export class DriftService extends EventEmitter {
	private connection: Connection;
	private config: AppConfig;
	private state: DriftServiceState;

	constructor(config: AppConfig) {
		super();
		this.config = config;
		this.connection = new Connection(config.rpcUrl, config.commitment);

		this.state = {
			initialized: false,
			connected: false,
			user: null,
			markets: [],
			positions: [],
			loading: false,
			error: null,
		};
	}

	/**
	 * Initialize the DriftClient with wallet (stub implementation)
	 */
	async initialize(wallet: any): Promise<void> {
		try {
			this.setState({ loading: true, error: null });

			// TODO: Initialize actual DriftClient when SDK imports are working
			console.log(
				'DriftService: Initializing with wallet...',
				wallet?.publicKey?.toString()
			);

			// Simulate initialization delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			this.setState({
				initialized: true,
				connected: true,
				loading: false,
			});

			this.emit('initialized');
		} catch (error: any) {
			console.error('DriftService initialization error:', error);
			this.setState({
				error: error.message || 'Failed to initialize DriftService',
				loading: false,
			});
			this.emit('error', error);
		}
	}

	/**
	 * Create a new user account (stub implementation)
	 */
	async createUser(): Promise<void> {
		try {
			this.setState({ loading: true, error: null });

			console.log('DriftService: Creating user account...');

			// TODO: Implement actual user creation
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Create a mock user account after successful creation
			const mockUser = {
				authority: 'mock-authority-key',
				subAccountId: 0,
				name: [65, 112, 101, 120, 32, 84, 114, 97, 100, 101, 114], // "Apex Trader" in bytes
				spotPositions: [],
				perpPositions: [],
				orders: [],
				lastAddPerpLpSharesTs: 0,
				totalDeposits: 0,
				totalWithdraws: 0,
				totalSocialLoss: 0,
				settledPerpPnl: 0,
				cumulativePerpFunding: 0,
				cumulativeSpotFees: 0,
				liquidationMarginBufferRatio: 0,
				lastActiveSlot: 0,
				nextOrderId: 1,
				maxMarginRatio: 0,
				nextLiquidationId: 1,
				subAccountIdDisplay: 0,
			};

			this.setState({
				loading: false,
				user: mockUser,
				initialized: true,
				connected: true,
			});

			console.log('DriftService: User account created successfully');
			this.emit('userCreated');
		} catch (error: any) {
			console.error('User creation error:', error);
			this.setState({
				error: error.message || 'Failed to create user',
				loading: false,
			});
			this.emit('error', error);
		}
	}

	/**
	 * Fetch all available markets (stub implementation)
	 */
	async fetchMarkets(): Promise<UIMarketData[]> {
		try {
			console.log('DriftService: Fetching markets...');

			// TODO: Fetch actual markets from DriftClient
			const mockMarkets: UIMarketData[] = [
				{
					marketIndex: 0,
					symbol: 'SOL-PERP',
					baseAssetSymbol: 'SOL',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 98.5,
					priceChange24h: 2.15,
					volume24h: 1250000,
					openInterest: 5500000,
					funding: 0.0012,
					isActive: true,
					marketAccount: {} as any,
				},
				{
					marketIndex: 1,
					symbol: 'BTC-PERP',
					baseAssetSymbol: 'BTC',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 43250.0,
					priceChange24h: -1.85,
					volume24h: 8750000,
					openInterest: 15500000,
					funding: -0.0008,
					isActive: true,
					marketAccount: {} as any,
				},
				{
					marketIndex: 2,
					symbol: 'USDC',
					baseAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'spot',
					lastPrice: 1.0,
					priceChange24h: 0.01,
					volume24h: 750000,
					isActive: true,
					marketAccount: {} as any,
				},
				// NGT-USDC Spot Market for Natural Gas Token trading
				{
					marketIndex: 3,
					symbol: 'NGT-USDC',
					baseAssetSymbol: 'NGT',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'spot',
					lastPrice: 2.85,
					priceChange24h: 1.25,
					volume24h: 125000,
					isActive: true,
					tokenMint: COMMODITY_TOKENS.NGT?.mintAddress || '',
					decimals: COMMODITY_TOKENS.NGT?.decimals || 9,
					pythPriceId: COMMODITY_TOKENS.NGT?.pythPriceId || '',
					marketAccount: {} as any,
				},
				{
					marketIndex: 4,
					symbol: 'XAU-PERP',
					baseAssetSymbol: 'XAU',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 2035.5,
					priceChange24h: 12.75,
					volume24h: 2340000,
					openInterest: 8750000,
					funding: 0.0003,
					isActive: true,
					marketAccount: {} as any,
				},
				{
					marketIndex: 5,
					symbol: 'XAG-PERP',
					baseAssetSymbol: 'XAG',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 24.85,
					priceChange24h: -0.42,
					volume24h: 890000,
					openInterest: 3200000,
					funding: -0.0001,
					isActive: true,
					marketAccount: {} as any,
				},
				{
					marketIndex: 6,
					symbol: 'WTI-PERP',
					baseAssetSymbol: 'WTI',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 78.92,
					priceChange24h: 1.23,
					volume24h: 1560000,
					openInterest: 4890000,
					funding: 0.0005,
					isActive: true,
					marketAccount: {} as any,
				},
				{
					marketIndex: 7,
					symbol: 'NG-PERP',
					baseAssetSymbol: 'NG',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 2.876,
					priceChange24h: -0.089,
					volume24h: 678000,
					openInterest: 1890000,
					funding: -0.0002,
					isActive: true,
					// Real token integration
					tokenMint: COMMODITY_TOKENS.NG.mintAddress || '',
					decimals: COMMODITY_TOKENS.NG.decimals,
					pythPriceId: COMMODITY_TOKENS.NG.pythPriceId || '',
					marketAccount: {} as any,
				},
				{
					marketIndex: 8,
					symbol: 'HG-PERP',
					baseAssetSymbol: 'HG',
					quoteAssetSymbol: 'USDC',
					oracleSource: 'Pyth',
					marketType: 'perp',
					lastPrice: 3.847,
					priceChange24h: 0.056,
					volume24h: 423000,
					openInterest: 1340000,
					funding: 0.0001,
					isActive: true,
					marketAccount: {} as any,
				},
			];

			this.state.markets = mockMarkets;
			this.setState({ markets: mockMarkets });

			return mockMarkets;
		} catch (error: any) {
			console.error('Error fetching markets:', error);
			this.setState({ error: error.message || 'Failed to fetch markets' });
			return [];
		}
	}

	/**
	 * Get current user positions (stub implementation)
	 */
	getUserPositions(): UIPosition[] {
		console.log('DriftService: Getting user positions...');

		try {
			// Add safety check - if no user account, return empty
			if (!this.state.initialized || !this.state.user) {
				console.warn(
					'DriftService: Not initialized or no user account, returning empty positions'
				);
				return [];
			}

			// TODO: Return actual positions from User account
			// For now, return mock data quickly to prevent hanging
			const mockPositions: UIPosition[] = [
				{
					marketIndex: 0,
					symbol: 'SOL-PERP',
					side: 'long',
					size: 100,
					notionalValue: 9850,
					entryPrice: 95.5,
					markPrice: 98.5,
					unrealizedPnl: 300,
					unrealizedPnlPercent: 3.14,
					marketType: 'perp',
					liquidationPrice: 45.25,
					position: {} as any,
				},
				{
					marketIndex: 1,
					symbol: 'BTC-PERP',
					side: 'short',
					size: 0.5,
					notionalValue: 21750,
					entryPrice: 43500,
					markPrice: 43500,
					unrealizedPnl: -125,
					unrealizedPnlPercent: -0.57,
					marketType: 'perp',
					liquidationPrice: 52000,
					position: {} as any,
				},
			];

			console.log(
				`DriftService: Returning ${mockPositions.length} mock positions`
			);
			return mockPositions;
		} catch (error) {
			console.error('DriftService: Error getting user positions:', error);
			return [];
		}
	}

	/**
	 * Place an order (stub implementation)
	 */
	async placeOrder(orderData: OrderFormData): Promise<string> {
		try {
			this.setState({ loading: true, error: null });

			console.log('DriftService: Placing order...', orderData);

			// TODO: Create and send actual order transaction
			await new Promise((resolve) => setTimeout(resolve, 2000));

			const mockTxId =
				'mock_transaction_' + Math.random().toString(36).substr(2, 9);

			this.setState({ loading: false });
			this.emit('orderPlaced', { txId: mockTxId, orderData });

			return mockTxId;
		} catch (error: any) {
			console.error('Error placing order:', error);
			this.setState({
				error: error.message || 'Failed to place order',
				loading: false,
			});
			throw error;
		}
	}

	/**
	 * Cancel all orders (stub implementation)
	 */
	async cancelAllOrders(): Promise<string> {
		try {
			this.setState({ loading: true, error: null });

			console.log('DriftService: Cancelling all orders...');

			// TODO: Cancel all orders via DriftClient
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const mockTxId = 'cancel_tx_' + Math.random().toString(36).substr(2, 9);

			this.setState({ loading: false });
			this.emit('ordersCancelled', { txId: mockTxId });

			return mockTxId;
		} catch (error: any) {
			console.error('Error cancelling orders:', error);
			this.setState({
				error: error.message || 'Failed to cancel orders',
				loading: false,
			});
			throw error;
		}
	}

	/**
	 * Update internal state and emit change events
	 */
	private setState(updates: Partial<DriftServiceState>): void {
		this.state = { ...this.state, ...updates };
		this.emit('stateChanged', this.state);
	}

	/**
	 * Get current service state
	 */
	getState(): DriftServiceState {
		return { ...this.state };
	}

	/**
	 * Disconnect and cleanup
	 */
	async disconnect(): Promise<void> {
		try {
			console.log('DriftService: Disconnecting...');

			// TODO: Disconnect DriftClient and User subscriptions

			this.setState({
				initialized: false,
				connected: false,
				user: null,
				markets: [],
				positions: [],
				loading: false,
				error: null,
			});

			this.emit('disconnected');
		} catch (error: any) {
			console.error('Error disconnecting:', error);
			this.emit('error', error);
		}
	}

	/**
	 * Check if service is ready for use
	 */
	isReady(): boolean {
		return (
			this.state.initialized && this.state.connected && !this.state.loading
		);
	}

	/**
	 * Get DriftClient instance (stub)
	 */
	getDriftClient(): any | null {
		// TODO: Return actual DriftClient
		return null;
	}

	/**
	 * Get User instance (stub)
	 */
	getUser(): any | null {
		// TODO: Return actual User
		return null;
	}
}
