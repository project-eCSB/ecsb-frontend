import { type CreateGameFormData, type SavedAssetData } from '../../../CreateGameForm'
import './SavedAssets.css'

interface SavedAssetsProps {
  setCreateGameFormData: React.Dispatch<React.SetStateAction<CreateGameFormData>>
  data: SavedAssetData
  onClose: () => void
}

const SavedAssets: React.FC<SavedAssetsProps> = ({ setCreateGameFormData, onClose, data }) => {
  const handleSelectAsset = (index: number) => {
    setCreateGameFormData((prevState: CreateGameFormData) => {
      return {
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
    })
    onClose()
  }

  const handleSelectDefaultAsset = () => {
    setCreateGameFormData((prevState: CreateGameFormData) => {
      return {
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
    })

    onClose()
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
          <button className='saved-assets-close' onClick={onClose}>
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
