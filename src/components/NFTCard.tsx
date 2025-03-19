import { FC } from 'react'

interface NFTMetadata {
  name: string
  description: string
  image: string
}

interface NFTCardProps {
  metadata: NFTMetadata
  onList: (nft: { metadata: NFTMetadata }) => void
  onCancel: (nft: { metadata: NFTMetadata }) => void
  isListing: boolean
  isCancelling: boolean
}

const NFTCard: FC<NFTCardProps> = ({ metadata, onList, onCancel, isListing, isCancelling }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <img src={metadata.image} alt={metadata.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{metadata.name}</h3>
        <p className="text-gray-600 mb-2">{metadata.description}</p>
        <button
          onClick={() => onList({ metadata })}
          disabled={isListing}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {isListing ? 'Listing...' : 'List for Sale'}
        </button>
        <button
          onClick={() => onCancel({ metadata })}
          disabled={isCancelling}
          className="w-full mt-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400"
        >
          {isCancelling ? 'Cancelling...' : 'Cancel Sale'}
        </button>
      </div>
    </div>
  )
}

export default NFTCard 