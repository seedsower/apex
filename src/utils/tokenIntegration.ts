// Token integration utilities for Apex Commodities
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';

export interface TokenBalance {
	mint: string;
	symbol: string;
	balance: number;
	decimals: number;
	uiBalance?: number; // Optional UI-friendly balance
}

export interface PriceData {
	price: number;
	confidence: number;
	exponent: number;
	publishTime: number;
}

export class TokenIntegrationService {
	private connection: Connection;

	constructor(connection: Connection) {
		this.connection = connection;
	}

	/**
	 * Get user's token balance for a specific commodity token
	 */
	async getTokenBalance(
		userWallet: PublicKey,
		tokenMint: string,
		symbol: string,
		decimals: number
	): Promise<TokenBalance | null> {
		try {
			const mintPubkey = new PublicKey(tokenMint);
			const associatedTokenAddress = await getAssociatedTokenAddress(
				mintPubkey,
				userWallet
			);

			try {
				const tokenAccount = await getAccount(
					this.connection,
					associatedTokenAddress
				);
				const balance = Number(tokenAccount.amount);

				return {
					mint: tokenMint,
					symbol,
					balance,
					decimals,
					uiBalance: balance / Math.pow(10, decimals),
				};
			} catch (error) {
				// Token account doesn't exist yet
				console.log(`Token account not found for ${symbol}, balance is 0`);
				return {
					mint: tokenMint,
					symbol,
					balance: 0,
					decimals,
					uiBalance: 0,
				};
			}
		} catch (error) {
			console.error(`Error getting token balance for ${symbol}:`, error);
			return null;
		}
	}

	/**
	 * Get user's token balance for a specific commodity token by symbol
	 */
	async getTokenBalanceBySymbol(
		userWallet: PublicKey,
		symbol: string
	): Promise<TokenBalance | null> {
		// Import tokens config here to avoid circular dependency
		const { COMMODITY_TOKENS } = await import('../config/tokens');
		const tokenConfig = COMMODITY_TOKENS[symbol];

		if (!tokenConfig) {
			console.error(`Token config not found for symbol: ${symbol}`);
			return null;
		}

		return this.getTokenBalance(
			userWallet,
			tokenConfig.mintAddress,
			symbol,
			tokenConfig.decimals
		);
	}

	/**
	 * Get all commodity token balances for a user
	 */
	async getAllCommodityBalances(
		userWallet: PublicKey
	): Promise<TokenBalance[]> {
		// Import tokens config here to avoid circular dependency
		const { COMMODITY_TOKENS } = await import('../config/tokens');

		const balancePromises = Object.keys(COMMODITY_TOKENS).map(
			async (symbol) => {
				const tokenConfig = COMMODITY_TOKENS[symbol];

				// Skip tokens with empty mint addresses
				if (!tokenConfig.mintAddress || tokenConfig.mintAddress === '') {
					console.log(`Skipping ${symbol} - no mint address configured`);
					return null;
				}

				try {
					return await this.getTokenBalance(
						userWallet,
						tokenConfig.mintAddress,
						symbol,
						tokenConfig.decimals
					);
				} catch (error) {
					console.error(`Error fetching balance for ${symbol}:`, error);
					return null;
				}
			}
		);

		const results = await Promise.all(balancePromises);
		return results.filter(
			(balance): balance is TokenBalance => balance !== null
		);
	}
}

export function formatTokenAmount(amount: number, decimals: number): string {
	return (amount / Math.pow(10, decimals)).toFixed(decimals);
}

export function parseTokenAmount(input: string, decimals: number): number {
	return Math.floor(parseFloat(input) * Math.pow(10, decimals));
}
