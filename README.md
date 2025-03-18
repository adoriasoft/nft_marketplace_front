# NFT Marketplace

A modern React-based NFT marketplace application that allows users to mint, buy, and sell NFTs using smart contracts.

## Features

- Connect your crypto wallet using RainbowKit
- Browse available NFTs in the marketplace
- Mint your own NFTs
- View and manage your NFT collection
- Buy and sell NFTs

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A crypto wallet (MetaMask, WalletConnect, etc.)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd nft-marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your configuration:
```env
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
VITE_CONTRACT_ADDRESS=your_contract_address
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Smart Contract Integration

To integrate with your smart contract:

1. Deploy your NFT smart contract to the desired network
2. Update the contract address in the `.env` file
3. Add your contract ABI to the project
4. Update the contract interaction functions in the components

## Technologies Used

- React
- TypeScript
- Vite
- RainbowKit
- wagmi
- TailwindCSS
- ethers.js

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
