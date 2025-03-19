import { create } from 'ipfs-http-client'

// Get Pinata credentials from environment variables
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY

if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
  throw new Error('Pinata credentials are not set in environment variables')
}

// Initialize IPFS client with Pinata credentials
const ipfs = create({ 
  url: 'https://api.pinata.cloud',
  headers: {
    'pinata_api_key': PINATA_API_KEY,
    'pinata_secret_api_key': PINATA_SECRET_KEY
  }
})

export interface NFTMetadata {
  name: string
  description: string
  image: string
}

export async function uploadToIPFS(metadata: NFTMetadata): Promise<string> {
  try {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      throw new Error('Pinata credentials are not configured')
    }

    // Use Pinata's pinJSONToIPFS endpoint
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY
      },
      body: JSON.stringify(metadata)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Pinata API error: ${errorData.message || response.statusText}`)
    }

    const result = await response.json()
    return `ipfs://${result.IpfsHash}`
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
    }
    throw error
  }
} 