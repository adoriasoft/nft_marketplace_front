import { FC } from 'react'

const Banner: FC = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-4 shadow-lg">
      <div className="container mx-auto">
        <p className="text-center text-lg">
          If you're looking to build a Web3 project or need comprehensive consulting on a Web3 venture—covering product and technology, legal, marketing, and business development—{' '}
          <a 
            href="https://www.primex-labs.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold text-yellow-300 underline hover:text-yellow-200 transition-colors"
          >
            PrimexLabs will help you
          </a>
          . You can also fill out the form{' '}
          <a 
            href="https://form.typeform.com/to/IphzcR93?typeform-source=article" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold text-yellow-300 underline hover:text-yellow-200 transition-colors"
          >
            here
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default Banner 