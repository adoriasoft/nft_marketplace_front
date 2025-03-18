import { FC, useState } from 'react'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'

const MintNFT: FC = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [price, setPrice] = useState('')
  const { address } = useAccount()

  // @ts-ignore - We know this is a valid contract address from our environment
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: [], // Add your contract ABI here
    functionName: 'mintNFT',
    args: [name, description, imageUrl, price],
    enabled: Boolean(contractAddress),
  })

  const { write: mintNFT } = useContractWrite(config)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mintNFT) {
      mintNFT()
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

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price (ETH)
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!address || !contractAddress}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {!contractAddress ? 'Contract Address Not Set' : !address ? 'Connect Wallet to Mint' : 'Mint NFT'}
        </button>
      </form>
    </div>
  )
}

export default MintNFT 