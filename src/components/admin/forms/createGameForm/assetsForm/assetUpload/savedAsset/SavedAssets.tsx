import { type SavedAssetData, type CreateGameFormData } from '../../../CreateGameForm'
import './SavedAssets.css'

interface SavedAssetsProps {
  setCreateGameFormData: React.Dispatch<React.SetStateAction<CreateGameFormData>>
  data: SavedAssetData
  onClose: () => void
}

const SavedAssets: React.FC<SavedAssetsProps> = ({ setCreateGameFormData, onClose, data }) => {
  const handleClose = () => {
    onClose()
  }

  const handleSelectAsset = (index: number) => {
    setCreateGameFormData((prevState: CreateGameFormData) => {
      const newFormData = {
        ...prevState,
        assets: {
          ...prevState.assets,
          [data.type]: {
            id: data.assets[index].id,
            file: null,
            name: data.assets[index].name,
          },
        },
      }
      return newFormData
    })

    handleClose()
  }

  const handleSelectDefaultAsset = () => {
    setCreateGameFormData((prevState: CreateGameFormData) => {
      const newFormData = {
        ...prevState,
        assets: {
          ...prevState.assets,
          [data.type]: {
            id: data.defaultAssetId,
            file: null,
            name: 'Default',
          },
        },
      }
      return newFormData
    })

    handleClose()
  }

  return (
    <div className='saved-assets-overlay'>
      <div className='saved-assets-modal'>
        <div className='saved-assets-list'>
          {Object.values(data.assets).map((asset, index) => (
            <div key={index} className='saved-asset-item'>
              <div className='saved-asset-name'>{asset.name}</div>
              <button
                className='saved-asset-select'
                onClick={() => {
                  handleSelectAsset(index)
                }}
              >
                Select
              </button>
            </div>
          ))}
        </div>
        <div className='saved-assets-buttons'>
          <button className='saved-assets-close' onClick={handleClose}>
            Close
          </button>
          <button className='saved-assets-default' onClick={handleSelectDefaultAsset}>
            Choose default
          </button>
        </div>
      </div>
    </div>
  )
}

export default SavedAssets
