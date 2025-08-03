'use client';
import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import {
	TokenIntegrationService,
	TokenBalance,
} from '../utils/tokenIntegration';
import { formatTokenAmount } from '../utils/tokenIntegration';
import { COMMODITY_TOKENS } from '../config/tokens';
import {
	verifyTokenOnNetwork,
	findTokenNetwork,
} from '../utils/tokenVerification';

export const TokenBalances: React.FC = () => {
	const { publicKey, connected } = useWallet();
	const { connection } = useConnection();
	const [balances, setBalances] = useState<TokenBalance[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (connected && publicKey) {
			fetchBalances();
		} else {
			setBalances([]);
		}
	}, [connected, publicKey]);

	const fetchBalances = async () => {
		if (!publicKey) return;

		setLoading(true);
		setError(null);

		try {
			console.log('🔍 Fetching balances for wallet:', publicKey.toString());
			console.log('🌐 RPC endpoint:', connection.rpcEndpoint);
			console.log('📝 NG token config:', COMMODITY_TOKENS.NG);

			const tokenService = new TokenIntegrationService(connection);

			// Debug: Try to fetch NG balance specifically
			const ngBalance = await tokenService.getTokenBalanceBySymbol(
				publicKey,
				'NG'
			);
			console.log('💰 NG Balance result:', ngBalance);

			const userBalances = await tokenService.getAllCommodityBalances(
				publicKey
			);
			console.log('📊 All balances result:', userBalances);

			setBalances(userBalances);
		} catch (err) {
			console.error('❌ Error fetching token balances:', err);
			setError(
				`Failed to fetch token balances: ${
					err instanceof Error ? err.message : 'Unknown error'
				}`
			);
		} finally {
			setLoading(false);
		}
	};

	const findMyNGToken = async () => {
		if (!publicKey) return;

		setLoading(true);
		setError(null);

		try {
			console.log('🔍 Searching for NG token across networks...');

			// First verify on current network
			const currentNetworkResult = await verifyTokenOnNetwork(
				connection,
				publicKey.toString(),
				COMMODITY_TOKENS.NG.mintAddress
			);

			if (currentNetworkResult.hasTokenAccount) {
				console.log('✅ Found NG token on current network!');
				setError('Token found on current network! Try refreshing balances.');
				fetchBalances();
				return;
			}

			console.log('🔍 Token not found on current network, searching others...');

			// Search across networks
			const foundNetwork = await findTokenNetwork(
				publicKey.toString(),
				COMMODITY_TOKENS.NG.mintAddress
			);

			if (foundNetwork) {
				setError(
					`NG token found on ${foundNetwork.network}! Current app is on ${connection.rpcEndpoint}. Switch networks or update your RPC URL.`
				);
			} else {
				setError(
					'NG token not found on mainnet or devnet. Please verify your mint address or check if you actually hold this token.'
				);
			}
		} catch (err) {
			console.error('❌ Error searching for token:', err);
			setError(
				`Search error: ${err instanceof Error ? err.message : 'Unknown error'}`
			);
		} finally {
			setLoading(false);
		}
	};

	if (!connected) {
		return (
			<div className="card p-4">
				<h3 className="text-lg font-semibold text-gray-900 mb-2">
					Token Balances
				</h3>
				<p className="text-gray-500">
					Connect your wallet to view token balances
				</p>
			</div>
		);
	}

	return (
		<div className="card p-4">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-lg font-semibold text-gray-900">
					Commodity Token Balances
				</h3>
				<button
					onClick={fetchBalances}
					disabled={loading}
					className="btn-secondary text-sm px-3 py-1"
				>
					{loading ? 'Refreshing...' : 'Refresh'}
				</button>
			</div>

			{error && (
				<div
					className={`mb-4 p-3 rounded-lg text-sm ${
						error.includes('found')
							? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
							: 'bg-red-50 text-red-600 border border-red-200'
					}`}
				>
					<div className="font-medium mb-1">
						{error.includes('found') ? '⚠️ Network Mismatch' : '❌ Error'}
					</div>
					{error}
				</div>
			)}

			{loading ? (
				<div className="space-y-3">
					{[...Array(5)].map((_, i) => (
						<div
							key={i}
							className="animate-pulse flex justify-between items-center p-3 bg-gray-100 rounded-lg"
						>
							<div className="flex items-center space-x-3">
								<div className="w-8 h-8 bg-gray-300 rounded-full"></div>
								<div className="w-12 h-4 bg-gray-300 rounded"></div>
							</div>
							<div className="w-20 h-4 bg-gray-300 rounded"></div>
						</div>
					))}
				</div>
			) : (
				<div className="space-y-2">
					{Object.values(COMMODITY_TOKENS).map((tokenConfig) => {
						const balance = balances.find(
							(b) => b.mint === tokenConfig.mintAddress
						);
						const hasBalance =
							balance && balance.uiBalance && balance.uiBalance > 0;

						return (
							<div
								key={tokenConfig.symbol}
								className={`flex justify-between items-center p-3 rounded-lg border ${
									hasBalance
										? 'border-green-200 bg-green-50'
										: 'border-gray-200 bg-gray-50'
								}`}
							>
								<div className="flex items-center space-x-3">
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
											hasBalance
												? 'bg-green-500 text-white'
												: 'bg-gray-400 text-white'
										}`}
									>
										{tokenConfig.symbol}
									</div>
									<div>
										<p className="font-medium text-gray-900">
											{tokenConfig.name}
										</p>
										<p className="text-xs text-gray-500">
											{tokenConfig.symbol}
										</p>
									</div>
								</div>

								<div className="text-right">
									<p
										className={`font-medium ${
											hasBalance ? 'text-green-600' : 'text-gray-500'
										}`}
									>
										{balance
											? formatTokenAmount(balance.balance, balance.decimals)
											: '0'}
									</p>
									<p className="text-xs text-gray-500">{tokenConfig.symbol}</p>
								</div>
							</div>
						);
					})}

					{balances.length === 0 && !loading && (
						<div className="text-center py-6 text-gray-500">
							<p>No token balances found</p>
							<p className="text-sm mt-1">
								Make sure you have configured your token mint addresses
							</p>
						</div>
					)}
				</div>
			)}

			{/* NG Token Integration Status & Network Debug */}
			<div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium text-gray-700">
						NG Token Integration
					</span>
					<span
						className={`text-xs px-2 py-1 rounded-full ${
							COMMODITY_TOKENS.NG.mintAddress !==
							'YOUR_NG_TOKEN_MINT_ADDRESS_HERE'
								? 'bg-green-100 text-green-800'
								: 'bg-yellow-100 text-yellow-800'
						}`}
					>
						{COMMODITY_TOKENS.NG.mintAddress !==
						'YOUR_NG_TOKEN_MINT_ADDRESS_HERE'
							? 'Configured'
							: 'Needs Setup'}
					</span>
				</div>

				{/* Network Debug Info */}
				{connected && (
					<div className="text-xs space-y-1 bg-gray-100 p-2 rounded">
						<div>
							<strong>Wallet:</strong> {publicKey?.toString().slice(0, 8)}...
							{publicKey?.toString().slice(-8)}
						</div>
						<div>
							<strong>Network:</strong> {connection.rpcEndpoint}
						</div>
						<div>
							<strong>NG Mint:</strong> {COMMODITY_TOKENS.NG.mintAddress}
						</div>
						<div>
							<strong>Decimals:</strong> {COMMODITY_TOKENS.NG.decimals}
						</div>
					</div>
				)}

				{COMMODITY_TOKENS.NG.mintAddress ===
					'YOUR_NG_TOKEN_MINT_ADDRESS_HERE' && (
					<p className="text-xs text-gray-500 mt-1">
						Update your NG token configuration in src/config/tokens.ts
					</p>
				)}

				{/* Manual Refresh & Search Buttons */}
				{connected &&
					COMMODITY_TOKENS.NG.mintAddress !==
						'YOUR_NG_TOKEN_MINT_ADDRESS_HERE' && (
						<div className="space-y-2">
							<button
								onClick={fetchBalances}
								disabled={loading}
								className="w-full text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded disabled:opacity-50"
							>
								{loading ? 'Checking...' : 'Refresh Balances'}
							</button>
							<button
								onClick={findMyNGToken}
								disabled={loading}
								className="w-full text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded disabled:opacity-50"
							>
								{loading ? 'Searching...' : 'Find My NG Token'}
							</button>
						</div>
					)}
			</div>
		</div>
	);
};
