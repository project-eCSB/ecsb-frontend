import { type CreateGameRequest } from '../../../../../apis/game/Types'
import gameService from '../../../../../services/game/GameService'
import { type ClassResource, type CreateGameFormData, FileType, type Travel } from '../CreateGameForm'
import './SubmitForm.css'
import type React from 'react'

interface SubmitFormProps {
  formData: CreateGameFormData
  setCreateGameFormData: React.Dispatch<React.SetStateAction<CreateGameFormData>>
  setAndShowResultModal: (message: string) => void
  setRequestInProgress: (requestInProgress: boolean) => void
}

const SubmitForm: React.FC<SubmitFormProps> = ({
                                                 formData,
                                                 setCreateGameFormData,
                                                 setAndShowResultModal,
                                                 setRequestInProgress,
                                               }) => {
  const renderClassResources = (classResources: ClassResource[]) => {
    return classResources.map((resource, index) => (
      <>
        <div key={index} className='resource'>
          <p>Class Name: {resource.className}</p>
          <p>Class Token Regeneration: {resource.classTokenRegeneration}</p>
          <p>Character Mapping: {resource.characterMapping}</p>
          <p>Item Name: {resource.itemName}</p>
          <p>Item Mapping: {resource.itemMapping}</p>
          <p>Cost Per Item: {resource.costPerItem}</p>
          <p>Item Per Workshop: {resource.itemPerWorkshop}</p>
          <p>Item Buyout: {resource.itemBuyout}</p>
        </div>
        {index !== classResources.length - 1 && <hr />}
      </>
    ))
  }

  const renderTravels = (travels: Travel[]) => {
    return travels.map((travel, index) => (
      <>
        <div key={index} className='summary-travels-travel'>
          <div className='summary-travels-travel-info'>
            <p>Town Name: {travel.townName}</p>
          </div>
          <div className='summary-travels-travel-cost'>
            <p>Cost:</p>
            {travel.cost.map((cost, i) => (
              <div key={i}>
                <p>{cost.itemName} - {cost.itemCost}</p>
              </div>
            ))}
          </div>
          <div className='summary-travels-travel-reward'>
            <p>Time token regeneration: {(travel.regenTime)}</p>
            <p>Min Reward: {travel.minReward}</p>
            <p>Max Reward: {travel.maxReward}</p>
          </div>
        </div>
        {index !== travels.length - 1 && <hr />}
      </>
    ))
  }

  const transformFormData = (formData: CreateGameFormData): CreateGameRequest => {
    const transformedData: CreateGameRequest = {
      classResourceRepresentation: [],
      travels: [],
      gameName: '',
      assets: [],
      timeForGame: 0,
      minPlayersToStart: 0,
      maxTimeTokens: 0,
      walkingSpeed: 0,
      interactionRadius: 0,
      defaultMoney: 0,
    }

    transformedData.classResourceRepresentation = formData.classResources.map((classResource) => ({
      key: classResource.className,
      value: {
        classAsset: classResource.characterMapping,
        gameResourceName: classResource.itemName,
        resourceAsset: classResource.itemMapping,
        maxProduction: classResource.itemPerWorkshop,
        unitPrice: classResource.costPerItem,
        regenTime: classResource.classTokenRegeneration * 1000,
        buyoutPrice: classResource.itemBuyout,
      },
    }))

    transformedData.gameName = formData.gameName

    transformedData.travels = []

    if (formData.lowTravels.length > 0) {
      transformedData.travels.push({
        key: 'low',
        value: formData.lowTravels.map((travel) => ({
          key: travel.townName,
          value: transformTravelData(travel),
        })),
      })
    }

    if (formData.mediumTravels.length > 0) {
      transformedData.travels.push({
        key: 'medium',
        value: formData.mediumTravels.map((travel) => ({
          key: travel.townName,
          value: transformTravelData(travel),
        })),
      })
    }

    if (formData.highTravels.length > 0) {
      transformedData.travels.push({
        key: 'high',
        value: formData.highTravels.map((travel) => ({
          key: travel.townName,
          value: transformTravelData(travel),
        })),
      })
    }

    Object.entries(formData.assets).forEach(([key, value]) => {
      transformedData.assets.push({
        key: key,
        value: value!.id!,
      })
    })

    transformedData.timeForGame = formData.gameFullTime * 1000 * 60
    transformedData.minPlayersToStart = formData.minPlayersToStart
    transformedData.maxTimeTokens = formData.maxTimeTokens
    transformedData.walkingSpeed = formData.movingSpeed
    transformedData.interactionRadius = formData.interactionRadius
    transformedData.defaultMoney = formData.defaultMoney

    return transformedData
  }

  // eslint-disable-next-line
  const transformTravelData = (travel: Travel): any => {
    return {
      assets: travel.cost.slice(0, travel.cost.length - 1).map((item) => ({
        key: item.itemName,
        value: item.itemCost,
      })),
      moneyRange: {
        from: travel.minReward,
        to: travel.maxReward,
      },
      time: travel.cost[travel.cost.length - 1].itemCost,
      regenTime: travel.regenTime * 1000,
    }
  }

  const handleChangeGameFullTime = (value: string) => {
    if (value.length === 0) {
      setCreateGameFormData((prevFormData) => ({
        ...prevFormData,
        gameFullTime: 0,
      }))
      return
    }

    const parsedValue = Math.min(Math.max(0, parseInt(value)), 60)
    setCreateGameFormData((prevFormData) => ({
      ...prevFormData,
      gameFullTime: parsedValue,
    }))
  }

  const handleChangeNumberOfPlayers = (value: string) => {
    if (value.length === 0) {
      setCreateGameFormData((prevFormData) => ({
        ...prevFormData,
        minPlayersToStart: 0,
      }))
      return
    }

    const parsedValue = Math.min(Math.max(0, parseInt(value)), 30)
    setCreateGameFormData((prevFormData) => ({
      ...prevFormData,
      minPlayersToStart: parsedValue,
    }))
  }

  const handleSubmit = () => {
    setRequestInProgress(true)

    const transformedData = transformFormData(formData)
    gameService
      .createGame(transformedData)
      .then((gameSessionId: number) => {
        setRequestInProgress(false)
        setAndShowResultModal(`Game created successfully! Game ID: ${gameSessionId}`)
      })
      .catch((error: Error) => {
        setRequestInProgress(false)
        setAndShowResultModal(error.message)
      })
  }

  return (
    <div className='game-submit-form'>
      <div className='titles-container'>
        <p className='main-title'>Submit</p>
        <p className='sub-title'>Check if everything is correct, enter game name & submit</p>
      </div>
      <div className='summary-container'>
        <h4>Summary</h4>
        <div className='summary-files'>
          <h5>Assets</h5>
          <div>
            <p>Character Asset File: {formData.assets[FileType.CHARACTER]?.name}</p>
            <p>Resource Asset File: {formData.assets[FileType.RESOURCE]?.name}</p>
            <p>Tile Asset File: {formData.assets[FileType.TILE]?.name}</p>
            <p>Map Asset File: {formData.assets[FileType.MAP]?.name}</p>
          </div>
        </div>
        <div className='summary-class-resources'>
          <h5>Class Resources</h5>
          <div className='summary-class-resources-container'>{renderClassResources(formData.classResources)}</div>
        </div>
        <div className='summary-travels'>
          <h5>Low Travels</h5>
          <div className='summary-travels-container'>{renderTravels(formData.lowTravels)}</div>
        </div>
        <div className='summary-travels'>
          <h5>Medium Travels</h5>
          <div className='summary-travels-container'>{renderTravels(formData.mediumTravels)}</div>
        </div>
        <div className='summary-travels'>
          <h5>High Travels</h5>
          <div className='summary-travels-container'>{renderTravels(formData.highTravels)}</div>
        </div>
      </div>
      <div className='game-submit-form-input'>
        <label htmlFor=''>Game name</label>
        <input minLength={3} maxLength={254} value={formData.gameName} type='text'
               onChange={(e) => {
                 setCreateGameFormData({ ...formData, gameName: e.target.value })
               }} />
      </div>
      <div id='game-submit-form-input-gamefulltime' className='game-submit-form-input'>
        <label htmlFor=''>Game Full Time (in minutes)</label>
        <input min={1} max={60} value={formData.gameFullTime} type='number'
               onChange={(e) => {
                 handleChangeGameFullTime(e.target.value)
               }} />
      </div>
      <div id='game-submit-form-input-gamefulltime' className='game-submit-form-input'>
        <label htmlFor=''>Minimum number of players to start</label>
        <input min={1} max={30} value={formData.minPlayersToStart} type='number'
               onChange={(e) => {
                 handleChangeNumberOfPlayers(e.target.value)
               }} />
      </div>
      <div className='submit-form-button'>
        <button onClick={handleSubmit}
                disabled={formData.gameName.length < 3 || formData.gameFullTime < 1}
                className={`${formData.gameName.length < 3 || formData.gameFullTime < 1 ? 'disabled' : ''}`}>
          Submit
        </button>
      </div>
    </div>
  )
}

export default SubmitForm
