import { useEffect, useRef, useState } from 'react'
import type {
  AssetConfig,
  DefaultAssetsResponse,
  GameSettings,
  GameSettingsTravels,
  SavedAssetsResponse,
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
  regenTime: number
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
  minPlayersToStart: number
  assets: Record<
    string,
    {
      id: number | null
      file: File | null
      name: string | null
    } | null
  >
  movingSpeed: number
  maxTimeTokens: number
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
  const emptyForm: CreateGameFormData = {
    classResources: [],
    lowTravels: [],
    mediumTravels: [],
    highTravels: [],
    gameName: '',
    gameFullTime: 0,
    minPlayersToStart: 0,
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
    maxTimeTokens: 0,
    interactionRadius: 0,
    defaultMoney: 0,
  }

  const [page, setPage] = useState(1)
  const [requestInProgress, setRequestInProgress] = useState<boolean>(false)
  const [createGameFormData, setCreateGameFormData] = useState<CreateGameFormData>(
    JSON.parse(JSON.stringify(emptyForm)),
  )
  const [showModifyTravelModal, setShowModifyTravelModal] = useState<boolean>(false)
  const [modifyTravelData, setModifyTravelData] = useState<ModifyTravelData>({
    index: 0,
    travel: { type: 'low', townName: '', cost: [], minReward: 0, maxReward: 0, regenTime: 0 },
  })
  const [showSavedAssetModal, setShowSavedAssetModal] = useState<boolean>(false)
  const [savedAssets, setSavedAssets] = useState<SavedAssetData>({
    type: FileType.NONE,
    assets: [],
    defaultAssetId: 0,
  })
  const [showResultModal, setShowResultModal] = useState<boolean>(false)
  const [modalMessage, setModalMessage] = useState<string>('')
  const submitButton = useRef<HTMLButtonElement>(null)
  const [isConfigLoading, setIsConfigLoading] = useState<boolean>(false)
  const [gameSessionId, setGameSessionId] = useState<number>(0)

  const [error, setError] = useState<string | null>(null)
  const [showErrorTooltip, setShowErrorTooltip] = useState<boolean>(false)

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
    setCreateGameFormData(JSON.parse(JSON.stringify(emptyForm)))
    setGameSessionId(0)
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
      formData={createGameFormData}
      setCreateGameFormData={setCreateGameFormData}
      setAndShowResultModal={setAndShowResultModal}
      setRequestInProgress={setRequestInProgress}
    />,
  ]

  const maxPage = formPages.length

  const validatePage = (): string | null => {
    const characterMappings = new Set<number>()
    const itemNames = new Set<string>()
    const itemMappings = new Set<number>()
    const allTravels = createGameFormData.lowTravels.concat(
      createGameFormData.mediumTravels,
      createGameFormData.highTravels,
    )
    const allTravelNames = [
      ...createGameFormData.lowTravels.map((travel) => travel.townName),
      ...createGameFormData.mediumTravels.map((travel) => travel.townName),
      ...createGameFormData.highTravels.map((travel) => travel.townName),
    ]
    const uniqueTravelNames = new Set(allTravelNames)

    switch (page) {
      case 1:
        if (
          (createGameFormData.assets[FileType.CHARACTER]!.file === null &&
            createGameFormData.assets[FileType.CHARACTER]!.id === null) ||
          (createGameFormData.assets[FileType.RESOURCE]!.file === null &&
            createGameFormData.assets[FileType.RESOURCE]!.id === null) ||
          (createGameFormData.assets[FileType.TILE]!.file === null &&
            createGameFormData.assets[FileType.TILE]!.id === null) ||
          (createGameFormData.assets[FileType.MAP]!.file === null &&
            createGameFormData.assets[FileType.MAP]!.id === null)
        ) {
          return 'Wszystkie zasoby muszą być dodane.'
        }
        break
      case 2:
        for (const classResource of createGameFormData.classResources) {
          // Character
          if (
            classResource.characterMapping < 1 ||
            classResource.characterMapping > createGameFormData.classResources.length
          ) {
            return `Mapowania postaci muszą mieć wartości od 1 do ${createGameFormData.classResources.length}.`
          }

          if (characterMappings.has(classResource.characterMapping)) {
            return 'Mapowania postaci muszą być unikalne.'
          }

          // Resource
          if (classResource.itemName === '') {
            return 'Nazwy przedmiotów nie mogą być puste.'
          }

          if (itemNames.has(classResource.itemName)) {
            return 'Nazwy przedmiotów muszą być unikalne.'
          }

          if (
            classResource.itemMapping < 1 ||
            classResource.itemMapping > createGameFormData.classResources.length
          ) {
            return `Mapowania przedmiotów muszą mieć wartości od 1 do ${createGameFormData.classResources.length}.`
          }

          if (itemMappings.has(classResource.itemMapping)) {
            return 'Mapowania przedmiotów muszą być unikalne.'
          }

          if (
            classResource.costPerItem < 1 ||
            classResource.costPerItem > 1000000 ||
            classResource.itemPerWorkshop < 1 ||
            classResource.itemPerWorkshop > 1000000
          ) {
            return 'Koszt za przedmiot oraz ilość przedmiotów na warsztat muszą wynosić od 1 do 1,000,000.'
          }

          // Token
          if (classResource.classTokenRegeneration <= 0) {
            return 'Regeneracja tokenów musi być większa niż 0.'
          }

          characterMappings.add(classResource.characterMapping)
          itemNames.add(classResource.itemName)
          itemMappings.add(classResource.itemMapping)
        }

        if (createGameFormData.maxTimeTokens <= 0) {
          return 'Maksymalna liczba tokenów czasowych musi być większa niż 0.'
        }

        if (createGameFormData.interactionRadius <= 0) {
          return 'Promień interakcji musi być większy niż 0.'
        }

        if (createGameFormData.movingSpeed <= 0) {
          return 'Prędkość ruchu musi być większa niż 0.'
        }

        if (createGameFormData.defaultMoney <= 0) {
          return 'Domyślna ilość monet nie może być ujemna.'
        }
        break
      case 3:
        if (createGameFormData.lowTravels.length === 0) {
          return 'Musisz dodać podróże dla niskiego poziomu.'
        }

        if (createGameFormData.mediumTravels.length === 0) {
          return 'Musisz dodać podróże dla średniego poziomu.'
        }

        if (createGameFormData.highTravels.length === 0) {
          return 'Musisz dodać podróże dla wysokiego poziomu.'
        }

        for (const travel of allTravels) {
          const timeCost = travel.cost.find((itemCost) => itemCost.itemName === 'time')
          if (!timeCost || timeCost.itemCost <= 0) {
            return `Podróż do miasta ${travel.townName} musi mieć określony koszt czasu większy niż 0.`
          }

          const otherCosts = travel.cost.filter((itemCost) => itemCost.itemName !== 'time')
          const hasOtherPositiveCost = otherCosts.some((itemCost) => itemCost.itemCost > 0)
          if (!hasOtherPositiveCost) {
            return `Podróż do miasta ${travel.townName} musi mieć przynajmniej jeden przedmiot z dodatnią wartością.`
          }

          if (travel.cost.length === 0) {
            return `Podróż do miasta ${travel.townName} musi mieć określony koszt.`
          }

          if (travel.minReward <= 0) {
            return `Podróż do miasta ${travel.townName} musi mieć minimalną nagrodę większą niż 0.`
          }

          if (travel.maxReward <= 0) {
            return `Podróż do miasta ${travel.townName} musi mieć maksymalną nagrodę większą niż 0.`
          }

          if (travel.minReward > travel.maxReward) {
            return `Podróż do miasta ${travel.townName} musi mieć maksymalną nagrodę większą niż minimalna.`
          }

          if (travel.regenTime <= 0) {
            return `Podróż do miasta ${travel.townName} musi mieć czas regeneracji większy niż 0.`
          }

          if (travel.townName.trim() === '') {
            return 'Podróże muszą mieć nazwy miast.'
          }
        }

        if (allTravelNames.length !== uniqueTravelNames.size) {
          return 'Nazwy miast muszą być unikalne.'
        }
        break
      case 4:
        if (createGameFormData.gameName === '' || createGameFormData.gameFullTime <= 0) {
          return 'Nazwa gry nie może być pusta oraz czas trwania gry musi być większy niż 0.'
        }
        break
      default:
        return 'Nieznana strona.'
    }
    return null
  }

  const isNextPageDisabled = (): boolean => {
    if (page + 1 > maxPage) {
      return true
    }

    return validatePage() !== null
  }

  useEffect(() => {
    setError(null)

    if (page + 1 > maxPage) {
      return
    }

    const error = validatePage()
    if (error) {
      setShowErrorTooltip(false)
      setError(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createGameFormData, page])

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
        !createGameFormData.assets[FileType.CHARACTER]!.id ||
        !createGameFormData.assets[FileType.RESOURCE]!.id ||
        !createGameFormData.assets[FileType.TILE]!.id ||
        !createGameFormData.assets[FileType.MAP]!.id
      ) {
        if (!showResultModal) {
          setAndShowResultModal('Something went wrong while uploading assets')
        }

        setRequestInProgress(false)
        return
      }

      await gameService.getAssetConfig(createGameFormData.assets[FileType.MAP]!.id).then(
        (response: AssetConfig) => {
          if (createGameFormData.classResources.length === 0) {
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
          }

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

  const disableSubmitButton = () => {
    if (submitButton.current) {
      submitButton.current.disabled = true
      submitButton.current.classList.add('disabled')
    }
  }

  const enableSubmitButton = () => {
    if (submitButton.current) {
      submitButton.current.disabled = false
      submitButton.current.classList.remove('disabled')
    }
  }

  const copyConfigFromGivenSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsConfigLoading(true)
    disableSubmitButton()

    await gameService
      .getAdminGameSettings(gameSessionId)
      .then((res: GameSettings) => {
        setCreateGameFormData({
          ...createGameFormData,
          assets: Object.fromEntries(
            res.gameAssets.map((entry) => [
              entry.key,
              {
                id: entry.value,
                file: null,
                name: null,
              },
            ]),
          ),
          classResources: res.classResourceRepresentation.map((repr) => ({
            className: repr.key,
            classTokenRegeneration: repr.value.regenTime / 1000,
            characterMapping: repr.value.classAsset,
            itemName: repr.value.gameResourceName,
            itemMapping: repr.value.resourceAsset,
            costPerItem: repr.value.unitPrice,
            itemPerWorkshop: repr.value.maxProduction,
            itemBuyout: repr.value.buyoutPrice,
          })),
          lowTravels: res.travels
            .find((entry: GameSettingsTravels) => entry.key === 'low')!
            .value.map((travel) => ({
              type: 'low',
              townName: travel.value.name,
              cost: travel.value.resources.map((resource) => ({
                itemName: resource.key,
                itemCost: resource.value,
              })),
              minReward: travel.value.moneyRange.from,
              maxReward: travel.value.moneyRange.to,
              regenTime: travel.value.regenTime,
            })),
          mediumTravels: res.travels
            .find((entry: GameSettingsTravels) => entry.key === 'medium')!
            .value.map((travel) => ({
              type: 'medium',
              townName: travel.value.name,
              cost: travel.value.resources.map((resource) => ({
                itemName: resource.key,
                itemCost: resource.value,
              })),
              minReward: travel.value.moneyRange.from,
              maxReward: travel.value.moneyRange.to,
              regenTime: travel.value.regenTime,
            })),
          highTravels: res.travels
            .find((entry: GameSettingsTravels) => entry.key === 'high')!
            .value.map((travel) => ({
              type: 'high',
              townName: travel.value.name,
              cost: travel.value.resources.map((resource) => ({
                itemName: resource.key,
                itemCost: resource.value,
              })),
              minReward: travel.value.moneyRange.from,
              maxReward: travel.value.moneyRange.to,
              regenTime: travel.value.regenTime,
            })),
          gameName: res.name,
          gameFullTime: res.timeForGame / 60000,
          minPlayersToStart: res.minPlayersToStart,
          movingSpeed: res.walkingSpeed,
          maxTimeTokens: res.maxTimeTokens,
          interactionRadius: res.interactionRadius,
          defaultMoney: res.defaultMoney,
        })
        setIsConfigLoading(false)
        setModalMessage(`Game config from session ${gameSessionId} loaded`)
        setShowResultModal(true)
      })
      .catch((err) => {
        setModalMessage(`Error occurred while loading config - ${err}`)
        setShowResultModal(true)
      })

    setIsConfigLoading(false)
    enableSubmitButton()
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
        {page === 1 && (
          <>
            <div className={'load-previous-config'}>
              <form className='game-settings-form' onSubmit={copyConfigFromGivenSession}>
                <label htmlFor='gameSessionId'>Game Session ID</label>
                <input
                  id='gameSessionId'
                  type='number'
                  value={gameSessionId}
                  min={1}
                  onChange={(e) => {
                    setGameSessionId(Number(e.target.value))
                  }}
                  required
                />
                <button
                  ref={submitButton}
                  type='submit'
                  className={`${gameSessionId < 1 ? 'disabled' : ''}`}
                  disabled={gameSessionId < 1}
                >
                  Copy
                </button>
              </form>
            </div>
            <div className={'line'}></div>
          </>
        )}
        {formPages[page - 1]}
        <div className={'line'}></div>
        <div className='create-game-form-pages-buttons'>
          <button id={'reset-btn'} onClick={resetForm}>
            <p className='text'>Reset</p>
          </button>
          <div className='next-button-container'>
            <>
              {error && (
                <>
                  {showErrorTooltip && (
                    <div className='error-tooltip'>
                      <span className='text-danger'>{error}</span>
                    </div>
                  )}
                  <svg
                    onMouseOver={() => {
                      setShowErrorTooltip(true)
                    }}
                    onMouseOut={() => {
                      setShowErrorTooltip(false)
                    }}
                    xmlns='http://www.w3.org/2000/svg'
                    width='30'
                    height='30'
                    fill='currentColor'
                    className='bi bi-exclamation-triangle'
                    viewBox='0 0 16 16'
                  >
                    <path d='M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z' />
                    <path d='M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z' />
                  </svg>
                </>
              )}
              <button
                disabled={isNextPageDisabled() || requestInProgress}
                className={`${isNextPageDisabled() || requestInProgress ? 'disabled' : ''}`}
                onClick={async () => {
                  await handleNextPage()
                }}
              >
                <p className='text'>Next</p>
              </button>
            </>
          </div>
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
      {(requestInProgress || isConfigLoading) && <LoadingSpinner />}
    </>
  )
}

export default CreateGameForm
