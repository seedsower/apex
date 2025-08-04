import './globals.css';
import type { Metadata } from 'next';
import { WalletProviders } from '../src/providers/WalletProviders';
import { DriftProvider } from '../src/providers/DriftProvider';

export const metadata: Metadata = {
	title: 'Apex Commodities - Trading Platform',
	description:
		'High-performance commodities trading platform powered by Drift Protocol v2. Trade perpetuals and spot markets with institutional-grade infrastructure on Solana.',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="font-sans bg-gray-50 min-h-screen">
				<WalletProviders>
					<DriftProvider>{children}</DriftProvider>
				</WalletProviders>
			</body>
		</html>
	);
}
