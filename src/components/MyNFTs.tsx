import { FC, useEffect, useState } from 'react'
import { useAccount, useContractReads, useContractRead, useWriteContract, useSimulateContract } from 'wagmi'
import { parseEther } from 'viem'
import { NFT_MARKETPLACE_ABI } from '../contracts/nftMarketplace'

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
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [listPrice, setListPrice] = useState('')

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

  // Simulate listing NFT for sale
  const { data: simulateData } = useSimulateContract({
    address: contractAddress,
    abi: NFT_MARKETPLACE_ABI,
    functionName: 'listMyNFT',
    args: selectedNFT && listPrice ? [selectedNFT.id, parseEther(listPrice)] : undefined,
  })

  const { writeContract: listNFT } = useWriteContract()

  const handleList = async (nft: NFT) => {
    if (!listPrice) return

    const priceInWei = parseEther(listPrice)
    if (priceInWei <= 0n) {
      alert('Price must be greater than 0')
      return
    }

    setSelectedNFT(nft)
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
        setListPrice('')
      }
    }
  }

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
      <h2 className="text-2xl font-bold mb-6">My NFTs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <div key={nft.id.toString()} className="border rounded-lg overflow-hidden shadow-lg">
            <img src={nft.metadata.image} alt={nft.metadata.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{nft.metadata.name}</h3>
              <p className="text-gray-600 mb-2">{nft.metadata.description}</p>
              <p className="text-sm text-gray-500 mb-2">Token ID: {nft.id.toString()}</p>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Price in ETH"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                />
                <button
                  onClick={() => handleList(nft)}
                  disabled={selectedNFT?.id === nft.id || !listPrice}
                  className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  {selectedNFT?.id === nft.id ? 'Listing...' : 'Sell'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyNFTs 