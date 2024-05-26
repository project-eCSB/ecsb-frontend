import { type FC, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { CreateGameFormData, FileType } from '../../CreateGameForm'
import './AssetUpload.css'
import gameService from '../../../../../../services/game/GameService'

interface AssetUploadProps {
  createGameFormData: CreateGameFormData
  setCreateGameFormData: React.Dispatch<React.SetStateAction<CreateGameFormData>>
  fileExtension: string
  fileType: FileType
  title: string
  setAndShowSavedAssetModalForm: (fileType: FileType) => void
}

const AssetUpload: FC<AssetUploadProps> = ({
  createGameFormData,
  setCreateGameFormData,
  fileExtension,
  fileType,
  title,
  setAndShowSavedAssetModalForm,
}) => {
  const [url, setURL] = useState<string | null>(null)
  const uuid = uuidv4()

  const selectFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length !== 1) return

    const file = fileList[0]
    setCreateGameFormData((prevState: CreateGameFormData) => ({
      ...prevState,
      assets: {
        ...prevState.assets,
        [fileType]: {
          id: null,
          file,
          name: file.name,
        },
      },
    }))
  }

  const { id: fileId, name: fileName, file } = createGameFormData.assets[fileType] ?? {}

  useEffect(() => {
    if (fileId) {
      gameService
        .getAsset(fileId)
        .then(setURL)
        .catch((error) => {
          console.error('Error fetching asset:', error)
        })
    } else {
      setURL(null)
    }
  }, [fileId])

  return (
    <div className='asset-upload-container'>
      <h5 className='asset-title'>{title}</h5>
      {fileName && (
        <div className='asset-file'>
          <h5>Currently selected file: {fileName}</h5>
          {file && <img className='asset-image' src={URL.createObjectURL(file)} alt={fileName} />}
          {url && <img className='asset-image' src={url} alt={fileName} />}
        </div>
      )}
      {!fileName && url && (
        <>
          <h5>Currently selected file: {fileId}</h5>
          <img className='asset-image' src={url} alt='' />
        </>
      )}
      <div className='asset-buttons'>
        <div className='simple-button'>
          <label htmlFor={uuid} className='text'>
            Upload
          </label>
          <input
            accept={fileExtension}
            hidden
            id={uuid}
            type='file'
            onChange={(e) => {
              selectFiles(e.target.files)
            }}
          />
        </div>
        <button
          className='cta-button'
          onClick={() => {
            setAndShowSavedAssetModalForm(fileType)
          }}
        >
          <p className='text'>Saved Assets</p>
        </button>
      </div>
    </div>
  )
}

export default AssetUpload
