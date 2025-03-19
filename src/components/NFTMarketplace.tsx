import { FC, useEffect, useState } from 'react'
import { useAccount, useContractRead, useContractReads, useWriteContract } from 'wagmi'
import { formatEther } from 'viem'
import { NFT_MARKETPLACE_ABI } from '../contracts/nftMarketplace'

interface MarketItem {
  tokenId: bigint
  seller: `0x${string}`
  buyer: `0x${string}`
  price: bigint
  status: number
  marketItemId: bigint
}

interface NFTMetadata {
  name: string
  description: string
  image: string
}

interface NFT {
  tokenId: bigint
  metadata: NFTMetadata
  price: bigint
  seller: `0x${string}`
  status: number
  buyer: `0x${string}`
}

const NFTMarketplace: FC = () => {
  const { address } = useAccount()
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`
  const [nfts, setNfts] = useState<NFT[]>([])
  const { writeContract: buyNFT } = useWriteContract()
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [isBuying, setIsBuying] = useState<Record<string, boolean>>({})

  // Fetch market items
  const { data: marketItems, refetch: refetchMarketItems } = useContractRead({
    address: contractAddress,
    abi: NFT_MARKETPLACE_ABI,
    functionName: 'allMarketItems',
  })

  // Fetch token URIs for all market items
  const { data: tokenURIs, refetch: refetchTokenURIs } = useContractReads({
    contracts: (marketItems as unknown as MarketItem[] || []).map((item: MarketItem) => ({
      address: contractAddress,
      abi: NFT_MARKETPLACE_ABI,
      functionName: 'tokenURI',
      args: [item.tokenId]
    }))
  })

  const { writeContract: cancelSale } = useWriteContract()

  // Function to refetch all data
  const refetchAllData = async () => {
    await Promise.all([
      refetchMarketItems(),
      refetchTokenURIs()
    ])
  }

  // Set up auto-refresh interval
  useEffect(() => {
    const interval = setInterval(refetchAllData, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [refetchMarketItems, refetchTokenURIs])

  const handleBuy = async (nft: NFT) => {
    setSelectedNFT(nft)
    setIsBuying(prev => ({ ...prev, [nft.tokenId.toString()]: true }))
    
    if (buyNFT) {
      try {
        await buyNFT({
          address: contractAddress,
          abi: NFT_MARKETPLACE_ABI,
          functionName: 'buyNFT',
          args: [nft.tokenId],
          value: nft.price,
        })
        // Refetch all data after successful purchase
        await refetchAllData()
      } finally {
        setSelectedNFT(null)
        setIsBuying(prev => ({ ...prev, [nft.tokenId.toString()]: false }))
      }
    }
  }

  const handleCancel = async (nft: NFT) => {
    setSelectedNFT(nft)
    if (cancelSale) {
      try {
        await cancelSale({
          address: contractAddress,
          abi: NFT_MARKETPLACE_ABI,
          functionName: 'cancelSale',
          args: [nft.tokenId],
        })
        // Refetch all data after successful cancellation
        await refetchAllData()
      } finally {
        setSelectedNFT(null)
      }
    }
  }

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!tokenURIs || !marketItems) return

      const nftPromises = tokenURIs.map(async (uri, index) => {
        const marketItem = (marketItems as unknown as MarketItem[])[index]
        if (!uri.result || !marketItem) return null
        try {
          const response = await fetch(`https://ipfs.io/ipfs/${uri.result.toString().replace('ipfs://', '')}`)
          const metadata = await response.json()
          const nft: NFT = {
            tokenId: marketItem.tokenId,
            price: marketItem.price,
            seller: marketItem.seller,
            buyer: marketItem.buyer,
            status: marketItem.status,
            metadata,
          }
          return nft
        } catch (error) {
          console.error('Error fetching NFT metadata:', error)
          return null
        }
      })

      const results = await Promise.all(nftPromises)
      setNfts(results.filter((nft): nft is NFT => nft !== null))
    }

    fetchNFTs()
  }, [tokenURIs, marketItems])

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">NFTs for Sale</h2>
        <p className="text-gray-600">Please connect your wallet to view NFTs for sale.</p>
      </div>
    )
  }

  const activeSales = nfts.filter(nft => nft.seller !== address && nft.status === 0)
  const pastSales = nfts.filter(nft => nft.seller !== address && nft.status !== 0)
  const mySales = nfts.filter(nft => nft.seller === address && nft.status === 0)
  const myPastSales = nfts.filter(nft => nft.seller === address && nft.status !== 0)
  const myPurchases = nfts.filter(nft => nft.buyer === address)

  const renderNFTCard = (nft: NFT, section: string) => (
    <div key={nft.tokenId.toString()} className="border rounded-lg overflow-hidden shadow-lg">
      <img src={nft.metadata.image} alt={nft.metadata.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{nft.metadata.name}</h3>
        <p className="text-gray-600 mb-2">{nft.metadata.description}</p>
        <p className="text-sm text-gray-500 mb-2">Token ID: {nft.tokenId.toString()}</p>
        <p className="text-lg font-semibold mb-4">Price: {formatEther(nft.price)} ETH</p>
        
        {/* Show seller for Active Sales, Past Sales, and My Past Sales */}
        {(section === 'Active Sales' || section === 'Past Sales' || section === 'My Past Sales') && (
          <div className="mb-2">
            <p className="text-xs text-gray-500">Seller:</p>
            <p className="text-xs text-gray-500 truncate">{nft.seller}</p>
          </div>
        )}
        
        {/* Show buyer for Past Sales, My Past Sales, and My Purchases */}
        {(section === 'Past Sales' || section === 'My Past Sales' || section === 'My Purchases') && (
          <div className="mb-2">
            <p className="text-xs text-gray-500">Buyer:</p>
            <p className="text-xs text-gray-500 truncate">
              {section === 'My Purchases' || nft.status === 1 ? nft.buyer : 'N/A'}
            </p>
          </div>
        )}

        {/* Show Buy button for Active Sales */}
        {section === 'Active Sales' && nft.status === 0 && (
          <button
            onClick={() => handleBuy(nft)}
            disabled={selectedNFT?.tokenId === nft.tokenId || isBuying[nft.tokenId.toString()]}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {selectedNFT?.tokenId === nft.tokenId ? 'Buying...' : 'Buy'}
          </button>
        )}

        {/* Show Cancel button for My Sales */}
        {section === 'My Sales' && nft.status === 0 && (
          <button
            onClick={() => handleCancel(nft)}
            disabled={selectedNFT?.tokenId === nft.tokenId}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400"
          >
            {selectedNFT?.tokenId === nft.tokenId ? 'Cancelling...' : 'Cancel'}
          </button>
        )}

        {/* Show status for Past Sales and My Past Sales */}
        {(section === 'Past Sales' || section === 'My Past Sales') && (
          <>
            {nft.status === 1 && <p className="text-green-600 font-semibold">Sold</p>}
            {nft.status === 2 && <p className="text-red-600 font-semibold">Cancelled</p>}
          </>
        )}
      </div>
    </div>
  )

  const renderSection = (title: string, items: NFT[]) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-600">No NFTs in this section.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(nft => renderNFTCard(nft, title))}
        </div>
      )}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {renderSection('Active Sales', activeSales)}
      {renderSection('Past Sales', pastSales)}
      {renderSection('My Sales', mySales)}
      {renderSection('My Past Sales', myPastSales)}
      {renderSection('My Purchases', myPurchases)}
    </div>
  )
}

export default NFTMarketplace 