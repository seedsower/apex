// Real token configurations for Apex Commodities
import { PublicKey } from '@solana/web3.js';

export interface TokenConfig {
	mintAddress: string;
	decimals: number;
	symbol: string;
	name: string;
	oracleType: 'pyth' | 'switchboard' | 'custom';
	pythPriceId?: string;
	switchboardFeedId?: string;
	customOracleAddress?: string;
}

// Real token configurations
export const COMMODITY_TOKENS: Record<string, TokenConfig> = {
	NG: {
		// 🔧 REPLACE THESE WITH YOUR ACTUAL NG TOKEN DETAILS:
		mintAddress: 'HpNnAySB34qEHSBANp8dbUu7UqzPxZG5CktqbdKnC9Qp', // e.g., 'NGPiX7aDNUQK1R3mFJNxFGAG9P4xD7nGz2e8Dh5W3v4K'
		decimals: 9, // Replace with your token's decimal places (usually 6 or 9)
		symbol: 'NG',
		name: 'Natural Gas Token',
		oracleType: 'pyth',
		pythPriceId: 'YOUR_PYTH_PRICE_FEED_ID_HERE', // Optional: Pyth Network price feed ID
		// OR if you use Switchboard:
		// oracleType: 'switchboard',
		// switchboardFeedId: 'YOUR_SWITCHBOARD_FEED_ID_HERE',
		// OR if you have a custom oracle:
		// oracleType: 'custom',
		// customOracleAddress: 'YOUR_CUSTOM_ORACLE_ADDRESS_HERE',
	},
	XAU: {
		mintAddress: 'GDfnEsia2WLAW5t8yx2X5j2mkfA74i5kwGdDuZHt7XmG', // Example Gold token
		decimals: 9,
		symbol: 'XAU',
		name: 'Gold Token',
		oracleType: 'pyth',
		pythPriceId:
			'765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2',
	},
	XAG: {
		mintAddress: '', // Silver token mint
		decimals: 9,
		symbol: 'XAG',
		name: 'Silver Token',
		oracleType: 'pyth',
		pythPriceId:
			'f2fb02c32915f2d63755d1a5e8e6f5b2b3d2b7d3f6c5d5c6b2f5e7d8f2e8d6c5',
	},
	WTI: {
		mintAddress: '', // Crude Oil token mint
		decimals: 9,
		symbol: 'WTI',
		name: 'Crude Oil Token',
		oracleType: 'pyth',
		pythPriceId:
			'4ca9ec6c0000ba6d3c4e7c7d2d3e6b9e7f0e7f2e9d4c8e5f9e2c3d6e5f8e2d3',
	},
	HG: {
		mintAddress: '', // Copper token mint
		decimals: 9,
		symbol: 'HG',
		name: 'Copper Token',
		oracleType: 'pyth',
		pythPriceId:
			'2c9d432e0000567a6f9e8c5b2d4e7c9e5f2e8f1d6c7e5f9e4d8e7f2c5e6f9e3',
	},
};

// Drift Protocol Market Configuration
export interface DriftMarketConfig {
	marketIndex: number;
	tokenConfig: TokenConfig;
	symbol: string;
	marketType: 'perp' | 'spot';
	initialMarginRatio: number;
	maintenanceMarginRatio: number;
	liquidatorFee: number;
	ifLiquidationFee: number;
	maxSpread: number;
	maxFillReserveFraction: number;
	maxSlippageRatio: number;
	stepSizeAndTickSize: number;
	minOrderSize: number;
	maxPositionSize: number;
}

export const MARKET_CONFIGS: Record<string, DriftMarketConfig> = {
	'NG-PERP': {
		marketIndex: 6,
		tokenConfig: COMMODITY_TOKENS.NG,
		symbol: 'NG-PERP',
		marketType: 'perp',
		initialMarginRatio: 0.1, // 10% initial margin
		maintenanceMarginRatio: 0.05, // 5% maintenance margin
		liquidatorFee: 0.005, // 0.5% liquidator fee
		ifLiquidationFee: 0.002, // 0.2% insurance fund fee
		maxSpread: 0.1, // 10% max spread
		maxFillReserveFraction: 0.1, // 10% max fill reserve
		maxSlippageRatio: 0.025, // 2.5% max slippage
		stepSizeAndTickSize: 1, // Price precision
		minOrderSize: 1, // Minimum 1 unit
		maxPositionSize: 1000000, // Maximum 1M units
	},
};

// Helper functions
export function getTokenConfig(symbol: string): TokenConfig | undefined {
	return COMMODITY_TOKENS[symbol];
}

export function getMarketConfig(symbol: string): DriftMarketConfig | undefined {
	return MARKET_CONFIGS[symbol];
}

export function validateTokenMint(mintAddress: string): boolean {
	try {
		new PublicKey(mintAddress);
		return true;
	} catch {
		return false;
	}
}
