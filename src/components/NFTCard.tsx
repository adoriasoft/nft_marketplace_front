import { FC } from 'react'

interface NFTCardProps {
  id: string
  name: string
  description: string
  imageUrl: string
  price: string
  owner: string
  onBuy?: () => void
}

const NFTCard: FC<NFTCardProps> = ({
  id,
  name,
  description,
  imageUrl,
  price,
  owner,
  onBuy,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-w-1 aspect-h-1">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Owner: {owner.slice(0, 6)}...{owner.slice(-4)}
          </div>
          <div className="text-lg font-bold text-indigo-600">{price} ETH</div>
        </div>
        {onBuy && (
          <button
            onClick={onBuy}
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Buy Now
          </button>
        )}
      </div>
    </div>
  )
}

export default NFTCard 