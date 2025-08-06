import { Logo } from '@/components/Logo';
import Link from 'next/link';

export default function Home() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
			<div className="container mx-auto px-4 py-16">
				<div className="text-center mb-16">
					<div className="flex justify-center mb-6">
						<Logo />
					</div>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						High-performance commodities trading platform powered by Drift
						Protocol v2. Trade perpetuals and spot markets with
						institutional-grade infrastructure on Solana.
					</p>
				</div>

				<div className="flex justify-center mb-12">
					<button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
						Connect Wallet
					</button>
				</div>

				<div className="text-center">
					<Link
						href="/trade"
						className="inline-block bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-xl font-semibold"
					>
						Start Trading
					</Link>
				</div>
			</div>
		</main>
	);
}
