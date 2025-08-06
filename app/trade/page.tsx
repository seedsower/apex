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

import { OrderFormData, UIMarketData } from '../../src/types';
import { Logo } from '@/components/Logo';

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
	const { driftService, isReady, createUser } = useDrift();

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

	// Note: Removed wallet connection requirement - users can now see the trading interface without connecting wallet first

	// Note: Removed Drift service readiness check - trading interface now loads without requiring Drift to be ready

	// Note: Removed Drift error state check - trading interface now loads even with Drift connection errors

	// Note: Removed full-screen create account modal - now handled in header

	// Note: User account creation progress now handled in header button

	// ✅ MAIN TRADING DASHBOARD - This should now appear!
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div>
							<Logo className="text-gray-900" />
							<p className="text-sm text-gray-600">
								{connected
									? `Connected: ${publicKey?.toString().slice(0, 8)}...`
									: 'Connect your wallet to start trading'}
							</p>
						</div>
						<div className="flex items-center space-x-4">
							{connected && !userExists && !isCreatingUser && (
								<button
									onClick={handleCreateUser}
									className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
								>
									Create Account
								</button>
							)}
							{connected && isCreatingUser && (
								<button
									disabled
									className="bg-gray-400 text-white px-4 py-2 rounded-lg font-medium text-sm cursor-not-allowed"
								>
									Creating...
								</button>
							)}
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
			</div>
		</div>
	);
}
