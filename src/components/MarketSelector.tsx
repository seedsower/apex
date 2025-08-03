'use client';

import React from 'react';
import { useMarkets } from '../hooks/useMarkets';
import { UIMarketData } from '../types';

interface MarketSelectorProps {
	onSelectMarket: (market: UIMarketData) => void;
}

export const MarketSelector: React.FC<MarketSelectorProps> = ({
	onSelectMarket,
}) => {
	const {
		filteredMarkets,
		loading,
		error,
		selectorState,
		updateSelectorState,
	} = useMarkets();

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="p-4 border-b border-dark-200">
				<h2 className="text-lg font-semibold text-dark-900 mb-3">Markets</h2>

				{/* Search */}
				<input
					type="text"
					placeholder="Search markets..."
					value={selectorState.searchTerm}
					onChange={(e) => updateSelectorState({ searchTerm: e.target.value })}
					className="input-field mb-3"
				/>

				{/* Filters */}
				<div className="flex gap-2 mb-3">
					<select
						value={selectorState.marketType}
						onChange={(e) =>
							updateSelectorState({ marketType: e.target.value as any })
						}
						className="input-field text-sm"
					>
						<option value="all">All Markets</option>
						<option value="perp">Perpetuals</option>
						<option value="spot">Spot</option>
					</select>
				</div>

				{/* Sort Options */}
				<div className="flex gap-2">
					<select
						value={selectorState.sortBy}
						onChange={(e) =>
							updateSelectorState({ sortBy: e.target.value as any })
						}
						className="input-field text-sm flex-1"
					>
						<option value="symbol">Symbol</option>
						<option value="volume">Volume</option>
						<option value="priceChange">Change %</option>
					</select>
					<button
						onClick={() =>
							updateSelectorState({
								sortDirection:
									selectorState.sortDirection === 'asc' ? 'desc' : 'asc',
							})
						}
						className="btn-secondary px-3 py-1 text-sm"
					>
						{selectorState.sortDirection === 'asc' ? '↑' : '↓'}
					</button>
				</div>
			</div>

			{/* Markets List */}
			<div className="flex-1 overflow-y-auto">
				{loading && (
					<div className="p-4 text-center text-dark-500">
						<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto mb-2"></div>
						Loading markets...
					</div>
				)}

				{error && (
					<div className="p-4 text-danger-600 text-sm">Error: {error}</div>
				)}

				{!loading && !error && filteredMarkets.length === 0 && (
					<div className="p-4 text-center text-dark-500">No markets found</div>
				)}

				{!loading &&
					!error &&
					filteredMarkets.map((market) => (
						<div
							key={`${market.marketType}-${market.marketIndex}`}
							onClick={() => onSelectMarket(market)}
							className={`p-3 border-b border-dark-100 cursor-pointer hover:bg-dark-50 transition-colors ${
								selectorState.selectedMarket?.marketIndex ===
									market.marketIndex &&
								selectorState.selectedMarket?.marketType === market.marketType
									? 'bg-primary-50 border-l-4 border-l-primary-600'
									: ''
							}`}
						>
							<div className="flex items-center justify-between mb-1">
								<div className="flex items-center gap-2">
									<span className="font-medium text-dark-900">
										{market.symbol}
									</span>
									<span
										className={`text-xs px-2 py-1 rounded ${
											market.marketType === 'perp'
												? 'bg-primary-100 text-primary-700'
												: 'bg-success-100 text-success-700'
										}`}
									>
										{market.marketType.toUpperCase()}
									</span>
								</div>
								<span className="text-sm font-medium text-dark-900">
									${market.lastPrice.toFixed(2)}
								</span>
							</div>

							<div className="flex items-center justify-between text-xs">
								<span className="text-dark-500">
									Vol: ${(market.volume24h / 1000000).toFixed(1)}M
								</span>
								<span
									className={`font-medium ${
										market.priceChange24h >= 0
											? 'text-success-600'
											: 'text-danger-600'
									}`}
								>
									{market.priceChange24h >= 0 ? '+' : ''}
									{market.priceChange24h.toFixed(2)}%
								</span>
							</div>

							{market.marketType === 'perp' && market.funding !== undefined && (
								<div className="flex items-center justify-between text-xs mt-1">
									<span className="text-dark-500">Funding:</span>
									<span
										className={`font-medium ${
											market.funding >= 0
												? 'text-success-600'
												: 'text-danger-600'
										}`}
									>
										{(market.funding * 100).toFixed(4)}%
									</span>
								</div>
							)}
						</div>
					))}
			</div>
		</div>
	);
};
