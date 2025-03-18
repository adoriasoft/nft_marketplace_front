import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import NFTCard from './components/NFTCard'
import MintNFT from './components/MintNFT'

// Sample NFT data - replace with actual data from your smart contract
const sampleNFTs = [
  {
    id: '1',
    name: 'Sample NFT 1',
    description: 'This is a sample NFT description',
    imageUrl: 'https://via.placeholder.com/300',
    price: '0.1',
    owner: '0x1234...5678',
  },
  {
    id: '2',
    name: 'Sample NFT 2',
    description: 'Another sample NFT description',
    imageUrl: 'https://via.placeholder.com/300',
    price: '0.2',
    owner: '0x8765...4321',
  },
]

function App() {
  const [activeTab, setActiveTab] = useState('marketplace')

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">NFT Marketplace</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className={`${
                    activeTab === 'marketplace'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Marketplace
                </button>
                <button
                  onClick={() => setActiveTab('mint')}
                  className={`${
                    activeTab === 'mint'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Mint NFT
                </button>
                <button
                  onClick={() => setActiveTab('my-nfts')}
                  className={`${
                    activeTab === 'my-nfts'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  My NFTs
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'marketplace' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">NFT Marketplace</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleNFTs.map((nft) => (
                  <NFTCard
                    key={nft.id}
                    {...nft}
                    onBuy={() => console.log('Buying NFT:', nft.id)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'mint' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Mint Your NFT</h2>
              <MintNFT />
            </div>
          )}
          
          {activeTab === 'my-nfts' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">My NFTs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleNFTs.map((nft) => (
                  <NFTCard
                    key={nft.id}
                    {...nft}
                    onBuy={() => console.log('Selling NFT:', nft.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
