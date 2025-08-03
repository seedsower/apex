// Token integration utilities for Apex Commodities
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';

export interface TokenBalance {
	mint: string;
	symbol: string;
	balance: number;
	decimals: number;
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
				};
			} catch (error) {
				// Token account doesn't exist yet
				console.log(`Token account not found for ${symbol}, balance is 0`);
				return {
					mint: tokenMint,
					symbol,
					balance: 0,
					decimals,
				};
			}
		} catch (error) {
			console.error(`Error getting token balance for ${symbol}:`, error);
			return null;
		}
	}
}

export function formatTokenAmount(amount: number, decimals: number): string {
	return (amount / Math.pow(10, decimals)).toFixed(decimals);
}

export function parseTokenAmount(input: string, decimals: number): number {
	return Math.floor(parseFloat(input) * Math.pow(10, decimals));
}
