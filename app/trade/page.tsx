'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDrift } from '../../src/providers/DriftProvider';
import { TopNavigation } from '../../src/components/TopNavigation';
import { MarketHeader } from '../../src/components/MarketHeader';
import { MarketSelector } from '../../src/components/MarketSelector';
import { AdvancedChart } from '../../src/components/AdvancedChart';
import { OrderBook } from '../../src/components/OrderBook';
import { EnhancedOrderForm } from '../../src/components/EnhancedOrderForm';
import { TokenBalances } from '../../src/components/TokenBalances';
import { PositionsTable } from '../../src/components/PositionsTable';

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
	const { driftService, isReady, createUser } = useDrift();

	const [userExists, setUserExists] = useState<boolean>(false);
	const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);
	const [selectedMarket, setSelectedMarket] = useState<UIMarketData | null>(
		null
	);
	const [positions] = useState<any[]>([]);
	const [orderBookPrice, setOrderBookPrice] = useState<number | undefined>(
		undefined
	);

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

	// ✅ PROFESSIONAL TRADING INTERFACE - Drift-style layout
	return (
		<div className="min-h-screen bg-gray-900">
			{/* Top Navigation */}
			<TopNavigation
				onCreateAccount={
					connected && !userExists ? handleCreateUser : undefined
				}
				isCreatingAccount={isCreatingUser}
			/>

			{/* Market Header */}
			<MarketHeader
				selectedMarket={selectedMarket}
				_onMarketSelect={handleMarketSelect}
			/>

			{/* Main Trading Interface - Drift-style Grid Layout */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Trading Grid */}
				<div className="flex-1 grid grid-cols-12 gap-1 p-1 bg-gray-800">
					{/* Left Sidebar - Market Selection (hidden on mobile) */}
					<div className="hidden lg:block lg:col-span-2 bg-gray-900 rounded">
						<div className="p-4">
							<h3 className="text-white text-sm font-medium mb-3">Markets</h3>
							<MarketSelector onSelectMarket={handleMarketSelect} />
						</div>
					</div>

					{/* Main Chart Area */}
					<div className="col-span-12 lg:col-span-7 bg-gray-900 rounded">
						<div className="h-full">
							<AdvancedChart selectedMarket={selectedMarket} />
						</div>
					</div>

					{/* Right Sidebar - Order Book & Order Form */}
					<div className="col-span-12 lg:col-span-3 flex flex-col gap-1">
						{/* Order Book */}
						<div className="bg-gray-900 rounded flex-1">
							<OrderBook
								selectedMarket={selectedMarket}
								onPriceClick={setOrderBookPrice}
							/>
						</div>

						{/* Order Form */}
						<div className="bg-gray-900 rounded flex-1">
							<EnhancedOrderForm
								selectedMarket={selectedMarket}
								onSubmit={handlePlaceOrder}
								onPriceFromOrderBook={orderBookPrice}
							/>
						</div>

						{/* Token Balances */}
						<div className="bg-gray-900 rounded p-4">
							<h3 className="text-white text-sm font-medium mb-3">Balances</h3>
							<TokenBalances />
						</div>
					</div>
				</div>

				{/* Bottom Tabs - Positions, Orders, etc. */}
				<div className="bg-gray-900 border-t border-gray-800">
					<div className="max-w-7xl mx-auto">
						{/* Tab Navigation */}
						<div className="flex border-b border-gray-800">
							<button className="px-6 py-3 text-white bg-gray-800 border-b-2 border-purple-500 text-sm font-medium">
								Positions
							</button>
							<button className="px-6 py-3 text-gray-400 hover:text-white text-sm font-medium">
								Orders
							</button>
							<button className="px-6 py-3 text-gray-400 hover:text-white text-sm font-medium">
								Trades
							</button>
							<button className="px-6 py-3 text-gray-400 hover:text-white text-sm font-medium">
								Balances
							</button>
							<button className="px-6 py-3 text-gray-400 hover:text-white text-sm font-medium">
								Order History
							</button>
							<button className="px-6 py-3 text-gray-400 hover:text-white text-sm font-medium">
								Position History
							</button>
							<button className="px-6 py-3 text-gray-400 hover:text-white text-sm font-medium">
								Account
							</button>
							<div className="ml-auto flex items-center px-6">
								<button className="text-gray-400 hover:text-white">
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v18"
										/>
									</svg>
								</button>
								<span className="text-gray-400 text-sm ml-2">1</span>
							</div>
						</div>

						{/* Tab Content */}
						<div className="p-6">
							<PositionsTable positions={positions} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
