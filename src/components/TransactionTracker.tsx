import classNames from 'classnames'
import { FC, ReactNode } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { IoIosClose } from 'react-icons/io'
import { useWaitForTransaction } from 'wagmi'

const TransactionTracker: FC<{
  txHash: string
  type?: string
  additionalSuccessContent?: ReactNode
  onClose: () => void
}> = ({ txHash, additionalSuccessContent, type = 'Transaction', onClose }) => {
  const { isLoading, isError, isSuccess, isFetching } = useWaitForTransaction({
    hash: txHash,
  })
  const loading = isLoading || isFetching

  const statusText = loading
    ? `${type} Pending`
    : isSuccess
    ? `${type} Complete`
    : `${type} Failed`

  return (
    <div className="relative flex flex-col items-center">
      <button
        type="button"
        className="absolute right-0 top-0 rounded-full bg-gray-800 cursor-pointer"
        onClick={onClose}
      >
        <IoIosClose className="text-white text-3xl" />
      </button>
      <div
        className={classNames([
          'rounded-full w-16 h-16 border-4 transition-colors',
          {
            'border-white bg-transparent': loading,
            'border-transparent': !loading,
            'bg-green-600': !loading && isSuccess,
            'bg-red-700': !loading && isError,
          },
        ])}
      ></div>
      <div className="flex flex-row items-center gap-2">
        <h2
          className={classNames(
            'font-bold text-xl uppercase my-3 transition-colors',
            {
              'text-green-600': !loading && isSuccess,
              'text-red-700': !loading && isError,
            }
          )}
        >
          {statusText}
        </h2>
        <a href={`https://arbiscan.io/tx/${txHash}`} target="_blank ">
          <FaExternalLinkAlt className="rounded-md p-1 text-gray-300 bg-gray-800 text-lg" />
        </a>
      </div>
      {additionalSuccessContent && (
        <div
          className={classNames([
            'w-full transition-opacity flex flex-col items-center',
            {
              'opacity-0': loading,
              'opacity-100': !loading && isSuccess,
            },
          ])}
        >
          <div className="h-px bg-gray-500 w-full mb-3" />
          <div>{additionalSuccessContent}</div>
        </div>
      )}
    </div>
  )
}

export default TransactionTracker
