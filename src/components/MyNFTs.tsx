import { FC, useEffect, useState } from 'react'
import { useAccount, useContractReads, useContractRead, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import { NFT_MARKETPLACE_ABI } from '../contracts/nftMarketplace'
import NFTCard from './NFTCard'

interface NFTMetadata {
  name: string
  description: string
  image: string
}

interface NFT {
  id: bigint
  metadata: NFTMetadata
}

const MyNFTs: FC = () => {
  const { address } = useAccount()
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`
  const [nfts, setNfts] = useState<NFT[]>([])
  const { writeContract: listNFT } = useWriteContract()
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [listPrices, setListPrices] = useState<Record<string, string>>({})
  const [isListing, setIsListing] = useState<Record<string, boolean>>({})

  // Get the number of NFTs owned by the user
  const { data: balance, refetch: refetchBalance } = useContractRead({
    address: contractAddress,
    abi: NFT_MARKETPLACE_ABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000']
  })

  // Create an array of indices to fetch token IDs
  const indices = Array.from({ length: Number(balance || 0) }, (_, i) => i)

  // Fetch all token IDs owned by the user
  const { data: tokenIds, refetch: refetchTokenIds } = useContractReads({
    contracts: indices.map((index) => ({
      address: contractAddress,
      abi: NFT_MARKETPLACE_ABI,
      functionName: 'tokenOfOwnerByIndex',
      args: [address || '0x0000000000000000000000000000000000000000', BigInt(index)]
    }))
  })

  // Fetch token URIs for all tokens
  const { data: tokenURIs, refetch: refetchTokenURIs } = useContractReads({
    contracts: (tokenIds?.map(id => id.result) || []).map((tokenId) => ({
      address: contractAddress,
      abi: NFT_MARKETPLACE_ABI,
      functionName: 'tokenURI',
      args: [tokenId]
    }))
  })

  const handleList = async (nft: NFT) => {
    const price = listPrices[nft.id.toString()]
    if (!price) return

    const priceInWei = parseEther(price)
    if (priceInWei <= 0n) {
      alert('Price must be greater than 0')
      return
    }

    setSelectedNFT(nft)
    setIsListing(prev => ({ ...prev, [nft.id.toString()]: true }))
    
    if (listNFT) {
      try {
        await listNFT({
          address: contractAddress,
          abi: NFT_MARKETPLACE_ABI,
          functionName: 'listMyNFT',
          args: [nft.id, priceInWei],
        })
        // Refetch all data after successful listing
        await Promise.all([
          refetchBalance(),
          refetchTokenIds(),
          refetchTokenURIs()
        ])
      } finally {
        setSelectedNFT(null)
        setIsListing(prev => ({ ...prev, [nft.id.toString()]: false }))
        setListPrices(prev => ({ ...prev, [nft.id.toString()]: '' }))
      }
    }
  }

  const handlePriceChange = (nftId: string, value: string) => {
    setListPrices(prev => ({ ...prev, [nftId]: value }))
  }

  // Function to refetch all data
  const refetchAllData = async () => {
    await Promise.all([
      refetchBalance(),
      refetchTokenIds(),
      refetchTokenURIs()
    ])
  }

  // Set up auto-refresh interval
  useEffect(() => {
    const interval = setInterval(refetchAllData, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [refetchBalance, refetchTokenIds, refetchTokenURIs])

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!tokenURIs || !tokenIds) return

      const nftPromises = tokenURIs.map(async (uri, index) => {
        const tokenId = tokenIds[index]?.result
        if (!uri.result || !tokenId) return null
        try {
          const response = await fetch(`https://ipfs.io/ipfs/${uri.result.toString().replace('ipfs://', '')}`)
          const metadata = await response.json()
          const nft: NFT = {
            id: BigInt(tokenId.toString()),
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
  }, [tokenURIs, tokenIds])

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">My NFTs</h2>
        <p className="text-gray-600">Please connect your wallet to view your NFTs.</p>
      </div>
    )
  }

  if (!nfts.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">My NFTs</h2>
        <p className="text-gray-600">You don't own any NFTs yet.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">My NFTs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <NFTCard
            key={nft.id.toString()}
            metadata={nft.metadata}
            onList={() => handleList(nft)}
            isListing={isListing[nft.id.toString()]}
            price={listPrices[nft.id.toString()]}
            onPriceChange={(value) => handlePriceChange(nft.id.toString(), value)}
          />
        ))}
      </div>
    </div>
  )
}

export default MyNFTs 