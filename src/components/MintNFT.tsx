import { FC, useState } from 'react'
import { useAccount, useWriteContract, useSimulateContract } from 'wagmi'
import { parseEther } from 'viem'
import { NFT_MARKETPLACE_ABI } from '../contracts/nftMarketplace'
import { uploadToIPFS } from '../utils/ipfs'

const MintNFT: FC = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [listForSale, setListForSale] = useState(false)
  const [price, setPrice] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const { address } = useAccount()

  // @ts-ignore - We know this is a valid contract address from our environment
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`

  const { writeContract: mintNFT } = useWriteContract()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mintNFT) return

    try {
      setIsUploading(true)
      
      // Upload metadata to IPFS
      const metadata = {
        name,
        description,
        image: imageUrl,
      }
      const tokenURI = await uploadToIPFS(metadata)

      // Call the contract with the IPFS metadata URL
      await mintNFT({
        address: contractAddress,
        abi: NFT_MARKETPLACE_ABI,
        functionName: listForSale ? 'mintAndListOnMarketplace' : 'mintNFT',
        args: listForSale && price ? [tokenURI, parseEther(price)] : [tokenURI],
      })
    } catch (error) {
      console.error('Error minting NFT:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            NFT Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="listForSale"
            checked={listForSale}
            onChange={(e) => setListForSale(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="listForSale" className="ml-2 block text-sm text-gray-900">
            List for sale
          </label>
        </div>

        {listForSale && (
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (ETH)
            </label>
            <input
              type="text"
              placeholder="Price in ETH"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex-1 p-2 border rounded-md"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={!address || !contractAddress || !name || !description || !imageUrl || (listForSale && !price) || isUploading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {isUploading ? 'Uploading...' : !contractAddress ? 'Contract Address Not Set' : !address ? 'Connect Wallet to Mint' : listForSale ? 'Mint and List' : 'Mint NFT'}
        </button>
      </form>
    </div>
  )
}

export default MintNFT 