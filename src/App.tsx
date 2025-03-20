import { ConnectButton } from '@rainbow-me/rainbowkit'
import MintNFT from './components/MintNFT'
import NFTMarketplace from './components/NFTMarketplace'
import MyNFTs from './components/MyNFTs'
import Banner from './components/Banner'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">NFT Marketplace</h1>
            </div>
            <div className="flex items-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      <Banner />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Mint New NFT</h2>
              <MintNFT />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <NFTMarketplace />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <MyNFTs />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
