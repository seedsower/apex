'use client';

import React, { FC, ReactNode, useMemo } from 'react';
import {
	ConnectionProvider,
	WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
	PhantomWalletAdapter,
	SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletProvidersProps {
	children: ReactNode;
}

export const WalletProviders: FC<WalletProvidersProps> = ({ children }) => {
	// Use mainnet configuration
	const network = WalletAdapterNetwork.Mainnet;

	// RPC endpoint - use mainnet
	const endpoint = useMemo(() => {
		return (
			process.env.NEXT_PUBLIC_RPC_URL ||
			process.env.RPC_URL ||
			'https://api.mainnet-beta.solana.com'
		);
	}, []);

	// Only use working wallet adapters
	const wallets = useMemo(
		() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
		[network]
	);

	// Always provide the wallet context, even during SSR
	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>{children}</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
};
