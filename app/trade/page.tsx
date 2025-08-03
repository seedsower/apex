'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useDrift } from '../../src/providers/DriftProvider';
import { usePositions } from '../../src/hooks/usePositions';
import { MarketSelector } from '../../src/components/MarketSelector';
import { Chart } from '../../src/components/Chart';
import { PositionsTable } from '../../src/components/PositionsTable';
import { OrderForm } from '../../src/components/OrderForm';
import { TokenBalances } from '../../src/components/TokenBalances';
import { DebugPanel } from '../../src/components/DebugPanel';
import { OrderFormData, UIMarketData } from '../../src/types';

export default function TradePage() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Don't render until mounted (SSR safety)
	if (!mounted) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="text-gray-600 mt-4">Loading...</p>
				</div>
			</div>
		);
	}

	return <TradePageContent />;
}

function TradePageContent() {
	// Safely use wallet hooks only after mounting
	const { connected, publicKey } = useWallet();
	const { driftService, state: driftState, isReady, createUser } = useDrift();

	const [userExists, setUserExists] = useState<boolean>(false);
	const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);
	const [selectedMarket, setSelectedMarket] = useState<UIMarketData | null>(
		null
	);

	const { positions } = usePositions();

	// Check if user account exists
	useEffect(() => {
		if (isReady && driftService && connected) {
			// For demo purposes, assume user needs to be created
			setUserExists(false);
		}
	}, [isReady, driftService, connected]);

	const handleCreateUser = async () => {
		if (!driftService || !publicKey) return;

		setIsCreatingUser(true);
		try {
			await createUser();
			setUserExists(true);
		} catch (error: any) {
			console.error('Failed to create user:', error);
		} finally {
			setIsCreatingUser(false);
		}
	};

	const handleMarketSelect = (market: UIMarketData) => {
		setSelectedMarket(market);
	};

	const handlePlaceOrder = async (orderData: OrderFormData) => {
		if (!driftService || !publicKey) return;

		console.log('Placing order:', orderData);
		// TODO: Implement order placement
	};

	// Wallet not connected
	if (!connected) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
					<h1 className="text-3xl font-bold text-gray-900 mb-6">
						Connect Your Wallet
					</h1>
					<p className="text-gray-600 mb-8">
						Connect your Solana wallet to start trading
					</p>
					<WalletMultiButton />
				</div>
			</div>
		);
	}

	// DriftService not ready
	if (!isReady || driftState.loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="text-gray-600 mt-4">Initializing Drift Protocol...</p>
				</div>
			</div>
		);
	}

	// Error state
	if (driftState.error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
					<h1 className="text-2xl font-bold text-red-600 mb-4">
						Connection Error
					</h1>
					<p className="text-gray-600 mb-6">{driftState.error}</p>
					<button
						onClick={() => window.location.reload()}
						className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	// User account creation needed
	if (!userExists && !isCreatingUser) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
					<h1 className="text-3xl font-bold text-gray-900 mb-6">
						Create Trading Account
					</h1>
					<p className="text-gray-600 mb-8">
						Create your Drift trading account to start trading commodities
					</p>
					<button
						onClick={handleCreateUser}
						className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
					>
						Create Account
					</button>
				</div>
			</div>
		);
	}

	// User account creation in progress
	if (isCreatingUser) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="text-gray-600 mt-4">Creating your trading account...</p>
				</div>
			</div>
		);
	}

	// ✅ MAIN TRADING DASHBOARD - This should now appear!
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Apex Commodities Trading
							</h1>
							<p className="text-sm text-gray-600">
								Connected: {publicKey?.toString().slice(0, 8)}...
							</p>
						</div>
						<div className="flex items-center space-x-4">
							<WalletMultiButton />
						</div>
					</div>
				</div>
			</div>

			{/* Trading Interface */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Left Sidebar - Market Selection & Balances */}
					<div className="lg:col-span-1 space-y-6">
						<div className="bg-white rounded-lg shadow p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">
								Markets
							</h2>
							<MarketSelector onSelectMarket={handleMarketSelect} />
						</div>

						<div className="bg-white rounded-lg shadow p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">
								Account Balance
							</h2>
							<TokenBalances />
						</div>
					</div>

					{/* Main Chart Area */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-lg shadow p-6">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-lg font-semibold text-gray-900">
									{selectedMarket?.symbol || 'Select Market'}
								</h2>
								<div className="text-sm text-gray-600">Live Price Chart</div>
							</div>
							<Chart selectedMarket={selectedMarket} />
						</div>
					</div>

					{/* Right Sidebar - Order Form */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">
								Place Order
							</h2>
							<OrderForm
								selectedMarket={selectedMarket}
								onSubmit={handlePlaceOrder}
							/>
						</div>
					</div>
				</div>

				{/* Bottom Section - Positions */}
				<div className="mt-6">
					<div className="bg-white rounded-lg shadow">
						<div className="px-6 py-4 border-b border-gray-200">
							<h2 className="text-lg font-semibold text-gray-900">
								Your Positions
							</h2>
						</div>
						<div className="p-6">
							<PositionsTable positions={positions} />
						</div>
					</div>
				</div>

				{/* Debug Panel (Development Only) */}
				{process.env.NODE_ENV === 'development' && (
					<div className="mt-6">
						<DebugPanel />
					</div>
				)}
			</div>
		</div>
	);
}
