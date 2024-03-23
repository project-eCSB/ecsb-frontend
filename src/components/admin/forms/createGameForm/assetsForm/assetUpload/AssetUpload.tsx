import { useState, type FC, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { FileType, type CreateGameFormData } from '../../CreateGameForm'
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
    if (!fileList) {
      return
    }

    if (fileList.length === 1) {
      setCreateGameFormData((prevState: CreateGameFormData) => {
        const newFormData = {
          ...prevState,
          assets: {
            ...prevState.assets,
            [fileType]: {
              id: null,
              file: fileList.item(0)!,
              name: fileList.item(0)!.name,
            },
          },
        }
        return newFormData
      })
    }
  }

  const selectedFileId = (): number | null => {
    switch (fileType) {
      case FileType.CHARACTER:
        return createGameFormData.assets[FileType.CHARACTER]!.id
      case FileType.TILE:
        return createGameFormData.assets[FileType.TILE]!.id
      case FileType.RESOURCE:
        return createGameFormData.assets[FileType.RESOURCE]!.id
      case FileType.MAP:
        return createGameFormData.assets[FileType.MAP]!.id
      default:
        return null
    }
  }

  const selectedFileName = (): string | null => {
    switch (fileType) {
      case FileType.CHARACTER:
        return createGameFormData.assets[FileType.CHARACTER]!.name
      case FileType.TILE:
        return createGameFormData.assets[FileType.TILE]!.name
      case FileType.RESOURCE:
        return createGameFormData.assets[FileType.RESOURCE]!.name
      case FileType.MAP:
        return createGameFormData.assets[FileType.MAP]!.name
      default:
        return null
    }
  }

  const selectedFile = (): File | null => {
    switch (fileType) {
      case FileType.CHARACTER:
        return createGameFormData.assets[FileType.CHARACTER]!.file
      case FileType.TILE:
        return createGameFormData.assets[FileType.TILE]!.file
      case FileType.RESOURCE:
        return createGameFormData.assets[FileType.RESOURCE]!.file
      case FileType.MAP:
        return createGameFormData.assets[FileType.MAP]!.file
      default:
        return null
    }
  }

  const fileId = selectedFileId()
  const fileName = selectedFileName()
  const file = selectedFile()

  useEffect(() => {
    if (fileId) {
      gameService
        .getAsset(fileId)
        .then((response: string) => {
          setURL(response)
        })
        .catch((error) => {
          console.error('Error fetching asset:', error)
        })
    }
  }, [fileId])

  return (
    <div className={'asset-upload-container'}>
      <h5 className={'asset-title'}>{title}</h5>
      {fileName && (
        <div className='asset-file'>
          <h5>Currently selected file: {fileName}</h5>
          {file && <img className={'asset-image'} src={URL.createObjectURL(file)} alt={fileName} />}
          {url && <img className={'asset-image'} src={url} alt={fileName} />}
        </div>
      )}
      <div className={'asset-buttons'}>
        <div className={'simple-button'}>
          <label htmlFor={uuid} className={'text'}>
            Upload
          </label>
          <input
            onChange={(e) => {
              selectFiles(e.target.files)
            }}
            accept={fileExtension}
            hidden={true}
            id={uuid}
            type={'file'}
          />
        </div>
        <button
          className={'cta-button'}
          onClick={() => {
            setAndShowSavedAssetModalForm(fileType)
          }}
        >
          <p className={'text'}>Saved Assets</p>
        </button>
      </div>
    </div>
  )
}

export default AssetUpload
