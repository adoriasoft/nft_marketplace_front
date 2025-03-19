import { FC } from 'react'

export interface NFTMetadata {
  name: string
  description: string
  image: string
}

interface NFTCardProps {
  metadata: NFTMetadata
  onList: () => void
  isListing: boolean
  price: string
  onPriceChange: (value: string) => void
}

const NFTCard: FC<NFTCardProps> = ({
  metadata,
  onList,
  isListing,
  price,
  onPriceChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-64">
        <img 
          src={metadata.image} 
          alt={metadata.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{metadata.name}</h3>
        <p className="text-gray-600 mb-4">{metadata.description}</p>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Price in ETH"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={onList}
            disabled={isListing || !price}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
          >
            {isListing ? 'Listing...' : 'Sell'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NFTCard 