import { useState } from 'react'
import {
  type SavedAssetsResponse,
  type AssetConfigResponse,
  type DefaultAssetsResponse,
} from '../../../../apis/game/Types'
import GameResourcesForm from './resourcesForm/GameResourcesForm'
import GameTravelsForm from './travelsForm/GameTravelsForm'
import ModifyTravel from './travelsForm/modifyTravel/ModifyTravel'
import SubmitForm from './submitForm/SubmitForm'
import AssetUpload from './assetsForm/assetUpload/AssetUpload'
import SavedAssets from './assetsForm/assetUpload/savedAsset/SavedAssets'
import AssetsForm from './assetsForm/AssetsForm'
import gameService from '../../../../services/game/GameService'
import './CreateGameForm.css'
import LoadingSpinner from '../../../common/spinner/LoadingSpinner'
import MessageModal from './messageModal/MessageModal'

export interface ClassResource {
  className: string
  classTokenRegeneration: number
  characterMapping: number
  itemName: string
  itemMapping: number
  costPerItem: number
  itemPerWorkshop: number
  itemBuyout: number
}

export interface ItemCost {
  itemName: string
  itemCost: number
}

export interface Travel {
  type: 'low' | 'medium' | 'high'
  townName: string
  cost: ItemCost[]
  minReward: number
  maxReward: number
}

export enum FileType {
  CHARACTER = 'CHARACTER_ASSET_FILE',
  RESOURCE = 'RESOURCE_ASSET_FILE',
  TILE = 'TILE_ASSET_FILE',
  MAP = 'MAP',
  NONE = '',
}

export interface CreateGameFormData {
  classResources: ClassResource[]
  lowTravels: Travel[]
  mediumTravels: Travel[]
  highTravels: Travel[]
  gameName: string
  gameFullTime: number
  maxPlayerAmount: number
  assets: Record<
    string,
    {
      id: number | null
      file: File | null
      name: string | null
    } | null
  >
  movingSpeed: number
  maxTimeAmount: number
  interactionRadius: number
  defaultMoney: number
}

export interface SavedAssetData {
  type: FileType
  assets: SavedAssetsResponse
  defaultAssetId: number
}

export interface ModifyTravelData {
  index: number
  travel: Travel
}

const CreateGameForm = () => {
  const [page, setPage] = useState(1)
  const [createGameFormData, setCreateGameFormData] = useState<CreateGameFormData>({
    classResources: [],
    lowTravels: [],
    mediumTravels: [],
    highTravels: [],
    gameName: '',
    gameFullTime: 0,
    maxPlayerAmount: 0,
    assets: {
      [FileType.CHARACTER]: {
        id: null,
        file: null,
        name: null,
      },
      [FileType.RESOURCE]: {
        id: null,
        file: null,
        name: null,
      },
      [FileType.TILE]: {
        id: null,
        file: null,
        name: null,
      },
      [FileType.MAP]: {
        id: null,
        file: null,
        name: null,
      },
    },
    movingSpeed: 0,
    maxTimeAmount: 0,
    interactionRadius: 0,
    defaultMoney: 0,
  })
  const [requestInProgress, setRequestInProgress] = useState<boolean>(false)
  const [showModifyTravelModal, setShowModifyTravelModal] = useState<boolean>(false)
  const [modifyTravelData, setModifyTravelData] = useState<ModifyTravelData>({
    index: 0,
    travel: { type: 'low', townName: '', cost: [], minReward: 0, maxReward: 0 },
  })
  const [showSavedAssetModal, setShowSavedAssetModal] = useState<boolean>(false)
  const [savedAssets, setSavedAssets] = useState<SavedAssetData>({
    type: FileType.NONE,
    assets: [],
    defaultAssetId: 0,
  })
  const [showResultModal, setShowResultModal] = useState<boolean>(false)
  const [modalMessage, setModalMessage] = useState<string>('')

  const setAndShowSavedAssetModalForm = (fileType: string) => {
    gameService
      .getSavedAssets(fileType)
      .then((response: SavedAssetsResponse) => {
        gameService
          .getDefaultAssets()
          .then((defaultAssets: DefaultAssetsResponse) => {
            setSavedAssets({
              type: fileType as FileType,
              assets: response,
              defaultAssetId: defaultAssets[fileType].id,
            })
            setShowSavedAssetModal(true)
          })
          .catch((error: Error) => {
            setAndShowResultModal(error.message)
          })
      })
      .catch((error: Error) => {
        setAndShowResultModal(error.message)
      })
  }

  const setAndShowModifyTravelModalForm = (travel: Travel, index: number) => {
    setShowModifyTravelModal(true)

    switch (travel.type) {
      case 'low':
        setModifyTravelData({ index: index, travel: createGameFormData.lowTravels[index] })
        break
      case 'medium':
        setModifyTravelData({ index: index, travel: createGameFormData.mediumTravels[index] })
        break
      case 'high':
        setModifyTravelData({ index: index, travel: createGameFormData.highTravels[index] })
        break
    }
  }

  const resetForm = () => {
    setCreateGameFormData({
      classResources: [],
      lowTravels: [],
      mediumTravels: [],
      highTravels: [],
      gameName: '',
      gameFullTime: 0,
      maxPlayerAmount: 0,
      assets: {
        [FileType.CHARACTER]: {
          id: null,
          file: null,
          name: null,
        },
        [FileType.RESOURCE]: {
          id: null,
          file: null,
          name: null,
        },
        [FileType.TILE]: {
          id: null,
          file: null,
          name: null,
        },
        [FileType.MAP]: {
          id: null,
          file: null,
          name: null,
        },
      },
      movingSpeed: 0,
      maxTimeAmount: 0,
      interactionRadius: 0,
      defaultMoney: 0,
    })
    setPage(1)
  }

  const setAndShowResultModal = (message: string) => {
    setModalMessage(message)
    setShowResultModal(true)
  }

  const formPages = [
    <AssetsForm
      key={1}
      title={'Assets'}
      subTitle='Choose images of characters, resources, tiles and map'
      assetUpload={[
        <AssetUpload
          key={1}
          title={'Character Asset file'}
          fileExtension={'image/png'}
          fileType={FileType.CHARACTER}
          createGameFormData={createGameFormData}
          setCreateGameFormData={setCreateGameFormData}
          setAndShowSavedAssetModalForm={setAndShowSavedAssetModalForm}
        />,
        <AssetUpload
          key={2}
          title={'Resource Asset file'}
          fileExtension={'image/png'}
          fileType={FileType.RESOURCE}
          createGameFormData={createGameFormData}
          setCreateGameFormData={setCreateGameFormData}
          setAndShowSavedAssetModalForm={setAndShowSavedAssetModalForm}
        />,
        <AssetUpload
          key={3}
          title={'Tile Asset file'}
          fileExtension={'image/png'}
          fileType={FileType.TILE}
          createGameFormData={createGameFormData}
          setCreateGameFormData={setCreateGameFormData}
          setAndShowSavedAssetModalForm={setAndShowSavedAssetModalForm}
        />,
        <AssetUpload
          key={4}
          title={'Map Asset file'}
          fileExtension={'.json'}
          fileType={FileType.MAP}
          createGameFormData={createGameFormData}
          setCreateGameFormData={setCreateGameFormData}
          setAndShowSavedAssetModalForm={setAndShowSavedAssetModalForm}
        />,
      ]}
    />,
    <GameResourcesForm
      key={3}
      createGameFormData={createGameFormData}
      setCreateGameFormData={setCreateGameFormData}
    />,
    <GameTravelsForm
      key={4}
      createGameFormData={createGameFormData}
      setCreateGameFormData={setCreateGameFormData}
      showModifyTravelModalForm={setAndShowModifyTravelModalForm}
    />,
    <SubmitForm
      key={5}
      createGameFormData={createGameFormData}
      setCreateGameFormData={setCreateGameFormData}
      setAndShowResultModal={setAndShowResultModal}
      setRequestInProgress={setRequestInProgress}
    />,
  ]

  const maxPage = formPages.length

  const isNextPageDisabled = (): boolean => {
    if (page + 1 > maxPage) {
      return true
    }

    const characterMappings = new Set<number>()
    const itemNames = new Set<string>()
    const itemMappings = new Set<number>()
    const allTravelNames = [
      ...createGameFormData.lowTravels.map((travel) => travel.townName),
      ...createGameFormData.mediumTravels.map((travel) => travel.townName),
      ...createGameFormData.highTravels.map((travel) => travel.townName),
    ]
    const uniqueTravelNames = new Set(allTravelNames)

    switch (page) {
      case 1:
        return (
          (createGameFormData.assets[FileType.CHARACTER]!.file === null &&
            createGameFormData.assets[FileType.CHARACTER]!.id === null) ||
          (createGameFormData.assets[FileType.RESOURCE]!.file === null &&
            createGameFormData.assets[FileType.RESOURCE]!.id === null) ||
          (createGameFormData.assets[FileType.TILE]!.file === null &&
            createGameFormData.assets[FileType.TILE]!.id === null) ||
          (createGameFormData.assets[FileType.MAP]!.file === null &&
            createGameFormData.assets[FileType.MAP]!.id === null)
        )
      case 2:
        for (const classResource of createGameFormData.classResources) {
          if (
            characterMappings.has(classResource.characterMapping) ||
            classResource.characterMapping < 1 ||
            classResource.characterMapping > createGameFormData.classResources.length
          ) {
            return true
          }

          if (classResource.classTokenRegeneration <= 0) {
            return true
          }

          if (itemNames.has(classResource.itemName) || classResource.itemName === '') {
            return true
          }

          if (
            itemMappings.has(classResource.itemMapping) ||
            classResource.itemMapping < 1 ||
            classResource.itemMapping > createGameFormData.classResources.length
          ) {
            return true
          }

          characterMappings.add(classResource.characterMapping)
          itemNames.add(classResource.itemName)
          itemMappings.add(classResource.itemMapping)

          if (
            classResource.costPerItem < 1 ||
            classResource.costPerItem > 1000000 ||
            classResource.itemPerWorkshop < 1 ||
            classResource.itemPerWorkshop > 1000000
          ) {
            return true
          }
        }

        if (createGameFormData.movingSpeed <= 0) {
          return true
        }

        if (createGameFormData.maxTimeAmount <= 0) {
          return true
        }

        if (createGameFormData.interactionRadius <= 0) {
          return true
        }

        if (createGameFormData.defaultMoney < 0) {
          return true
        }

        return false
      case 3:
        if (
          createGameFormData.lowTravels.length === 0 ||
          createGameFormData.mediumTravels.length === 0 ||
          createGameFormData.highTravels.length === 0 ||
          createGameFormData.lowTravels.some((travel) => travel.townName === '') ||
          createGameFormData.mediumTravels.some((travel) => travel.townName === '') ||
          createGameFormData.highTravels.some((travel) => travel.townName === '')
        ) {
          return true
        }

        for (const travel of createGameFormData.lowTravels) {
          if (travel.cost.length === 0 || travel.minReward === 0 || travel.maxReward === 0) {
            return true
          }
        }

        for (const travel of createGameFormData.mediumTravels) {
          if (travel.cost.length === 0 || travel.minReward === 0 || travel.maxReward === 0) {
            return true
          }
        }

        for (const travel of createGameFormData.highTravels) {
          if (travel.cost.length === 0 || travel.minReward === 0 || travel.maxReward === 0) {
            return true
          }
        }

        if (allTravelNames.length !== uniqueTravelNames.size) {
          return true
        }

        return false
      case 4:
        return createGameFormData.gameName === '' || createGameFormData.gameFullTime <= 0
      default:
        return true
    }
  }

  const uploadCharacterAssetFile = async () => {
    await new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        if (
          !e ||
          !e.target ||
          !e.target.result ||
          !createGameFormData.assets[FileType.CHARACTER]!.file
        )
          return

        await gameService
          .uploadAsset(
            e.target.result as ArrayBuffer,
            createGameFormData.assets[FileType.CHARACTER]!.name!,
            FileType.CHARACTER,
          )
          .then(
            (assetId: number) => {
              if (showResultModal) return

              createGameFormData.assets[FileType.CHARACTER] = {
                id: assetId,
                file: null,
                name: createGameFormData.assets[FileType.CHARACTER]!.name,
              }

              resolve(assetId)
            },
            (error: Error) => {
              if (showResultModal) return

              setAndShowResultModal(error.message)

              reject(error)
            },
          )
      }

      if (!createGameFormData.assets[FileType.CHARACTER]!.file) {
        reject(new Error('No character asset file selected'))
        return
      }

      reader.readAsArrayBuffer(createGameFormData.assets[FileType.CHARACTER]!.file)
    })
  }

  const uploadResourceAssetFile = async () => {
    await new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        if (
          !e ||
          !e.target ||
          !e.target.result ||
          !createGameFormData.assets[FileType.RESOURCE]!.file
        )
          return

        await gameService
          .uploadAsset(
            e.target.result as ArrayBuffer,
            createGameFormData.assets[FileType.RESOURCE]!.name!,
            FileType.RESOURCE,
          )
          .then(
            (assetId: number) => {
              if (showResultModal) return

              createGameFormData.assets[FileType.RESOURCE] = {
                id: assetId,
                file: null,
                name: createGameFormData.assets[FileType.RESOURCE]!.name,
              }

              resolve(assetId)
            },
            (error: Error) => {
              if (showResultModal) return

              setAndShowResultModal(error.message)

              reject(error)
            },
          )
      }

      if (!createGameFormData.assets[FileType.RESOURCE]!.file) {
        reject(new Error('No resource asset file selected'))
        return
      }

      reader.readAsArrayBuffer(createGameFormData.assets[FileType.RESOURCE]!.file)
    })
  }

  const uploadTileAssetFile = async () => {
    await new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        if (!e || !e.target || !e.target.result || !createGameFormData.assets[FileType.TILE]!.file)
          return

        await gameService
          .uploadAsset(
            e.target.result as ArrayBuffer,
            createGameFormData.assets[FileType.TILE]!.name!,
            FileType.TILE,
          )
          .then(
            (assetId: number) => {
              if (showResultModal) return

              createGameFormData.assets[FileType.TILE] = {
                id: assetId,
                file: null,
                name: createGameFormData.assets[FileType.TILE]!.name,
              }

              resolve(assetId)
            },
            (error: Error) => {
              if (showResultModal) return

              setAndShowResultModal(error.message)

              reject(error)
            },
          )
      }

      if (!createGameFormData.assets[FileType.TILE]!.file) {
        reject(new Error('No tile asset file selected'))
        return
      }

      reader.readAsArrayBuffer(createGameFormData.assets[FileType.TILE]!.file)
    })
  }

  const uploadMapAssetFile = async () => {
    await new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        if (!e || !e.target || !e.target.result || !createGameFormData.assets[FileType.MAP]!.file)
          return

        await gameService
          .uploadAsset(
            e.target.result as ArrayBuffer,
            createGameFormData.assets[FileType.MAP]!.name!,
            FileType.MAP,
          )
          .then(
            (assetId: number) => {
              if (showResultModal) return

              createGameFormData.assets[FileType.MAP] = {
                id: assetId,
                file: null,
                name: createGameFormData.assets[FileType.MAP]!.name,
              }

              resolve(assetId)
            },
            (error: Error) => {
              if (showResultModal) return

              setAndShowResultModal(error.message)

              reject(error)
            },
          )
      }

      if (!createGameFormData.assets[FileType.MAP]!.file) {
        reject(new Error('No map asset file selected'))
        return
      }

      reader.readAsArrayBuffer(createGameFormData.assets[FileType.MAP]!.file)
    })
  }

  const handleNextPage = async () => {
    setRequestInProgress(true)

    if (page === 1) {
      if (!createGameFormData.assets[FileType.CHARACTER]!.id) {
        if (!createGameFormData.assets[FileType.CHARACTER]!.file) {
          setAndShowResultModal('No character asset file selected')
          setRequestInProgress(false)
          return
        }

        await uploadCharacterAssetFile()
      }

      if (!createGameFormData.assets[FileType.RESOURCE]!.id) {
        if (!createGameFormData.assets[FileType.RESOURCE]!.file) {
          setAndShowResultModal('No resource asset file selected')
          setRequestInProgress(false)
          return
        }

        await uploadResourceAssetFile()
      }

      if (!createGameFormData.assets[FileType.TILE]!.id) {
        if (!createGameFormData.assets[FileType.TILE]!.file) {
          setAndShowResultModal('No tile asset file selected')
          setRequestInProgress(false)
          return
        }

        await uploadTileAssetFile()
      }

      if (!createGameFormData.assets[FileType.MAP]!.id) {
        if (!createGameFormData.assets[FileType.MAP]!.file) {
          setAndShowResultModal('No map asset file selected')
          setRequestInProgress(false)
          return
        }

        await uploadMapAssetFile()
      }

      if (
        !createGameFormData.assets[FileType.CHARACTER]?.id ||
        !createGameFormData.assets[FileType.RESOURCE]?.id ||
        !createGameFormData.assets[FileType.TILE]?.id ||
        !createGameFormData.assets[FileType.MAP]?.id
      ) {
        if (!showResultModal) {
          setAndShowResultModal('Something went wrong while uploading assets')
        }

        setRequestInProgress(false)
        return
      }

      await gameService.getAssetConfig(createGameFormData.assets[FileType.MAP].id).then(
        (response: AssetConfigResponse) => {
          const classResources: ClassResource[] = []

          for (const resource in response.professionWorkshops) {
            classResources.push({
              className: resource,
              classTokenRegeneration: 0,
              characterMapping: 0,
              itemName: '',
              itemMapping: 0,
              costPerItem: 0,
              itemPerWorkshop: 0,
              itemBuyout: 0,
            })
          }

          setCreateGameFormData({
            ...createGameFormData,
            classResources: classResources,
          })

          setPage(page + 1)
        },
        (error: Error) => {
          if (showResultModal) return

          setAndShowResultModal(error.message)
        },
      )
    } else {
      setPage(page + 1)
    }

    setRequestInProgress(false)
  }

  return (
    <>
      <div className={'create-game-form'}>
        <div className={'create-game-form-pages-number'}>
          {formPages.map((_, index) => (
            <div key={index} className={page === index + 1 ? 'circle-actual' : 'circle'}>
              {index + 1}
            </div>
          ))}
        </div>
        <div className={'line'}></div>
        {formPages[page - 1]}
        <div className={'line'}></div>
        <div className='create-game-form-pages-buttons'>
          <button
            id={'reset-btn'}
            onClick={() => {
              resetForm()
            }}
          >
            <p className='text'>Reset</p>
          </button>
          <button
            disabled={isNextPageDisabled() || requestInProgress}
            className={`${isNextPageDisabled() || requestInProgress ? 'disabled' : ''}`}
            onClick={async () => {
              await handleNextPage()
            }}
          >
            <p className='text'>Next</p>
          </button>
        </div>
      </div>
      {showSavedAssetModal && (
        <SavedAssets
          setCreateGameFormData={setCreateGameFormData}
          onClose={() => {
            setShowSavedAssetModal(false)
          }}
          data={savedAssets}
        />
      )}
      {showModifyTravelModal && (
        <ModifyTravel
          createGameFormData={createGameFormData}
          setCreateGameFormData={setCreateGameFormData}
          onClose={() => {
            setShowModifyTravelModal(false)
          }}
          travelData={modifyTravelData}
        />
      )}
      {showResultModal && (
        <MessageModal
          message={modalMessage}
          onClose={() => {
            setShowResultModal(false)
          }}
        />
      )}
      {requestInProgress && <LoadingSpinner />}
    </>
  )
}

export default CreateGameForm
