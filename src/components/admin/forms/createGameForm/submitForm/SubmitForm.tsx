import gameAPI from '../../../../../apis/game/GameAPI'
import { type CreateGameRequest, type CreateGameResponse } from '../../../../../apis/game/Types'
import { type ClassResource, type CreateGameFormData, type Travel } from '../CreateGameForm'
import './SubmitForm.css'

interface SubmitFormProps {
  createGameFormData: CreateGameFormData
  setCreateGameFormData: React.Dispatch<React.SetStateAction<CreateGameFormData>>
  setAndShowResultModal: (message: string) => void
  setRequestInProgress: (requestInProgress: boolean) => void
}

const SubmitForm: React.FC<SubmitFormProps> = ({
  createGameFormData,
  setCreateGameFormData,
  setAndShowResultModal,
  setRequestInProgress,
}) => {
  const renderClassResources = (classResources: ClassResource[]) => {
    return classResources.map((resource, index) => (
      <>
        <div key={index} className='resource'>
          <p>Class Name: {resource.className}</p>
          <p>Character Mapping: {resource.characterMapping}</p>
          <p>Item Name: {resource.itemName}</p>
          <p>Item Mapping: {resource.itemMapping}</p>
          <p>Cost Per Item: {resource.costPerItem}</p>
          <p>Item Per Workshop: {resource.itemPerWorkshop}</p>
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
                <p>
                  {cost.itemName} - {cost.itemCost}
                </p>
              </div>
            ))}
          </div>
          <div className='summary-travels-travel-reward'>
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
      mapAssetId: 0,
      tileAssetId: 0,
      characterAssetId: 0,
      resourceAssetsId: 0,
    }

    transformedData.classResourceRepresentation = formData.classResources.map((classResource) => ({
      key: classResource.className,
      value: {
        classAsset: classResource.characterMapping,
        gameResourceName: classResource.itemName,
        resourceAsset: classResource.itemMapping,
        unitPrice: classResource.costPerItem,
        maxProduction: classResource.itemPerWorkshop,
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

    transformedData.mapAssetId = Number(formData.mapAssetId)
    transformedData.tileAssetId = Number(formData.tileAssetId)
    transformedData.characterAssetId = Number(formData.characterAssetsId)
    transformedData.resourceAssetsId = Number(formData.resourceAssetsId)

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
    }
  }

  const handleSubmit = () => {
    setRequestInProgress(true)

    gameAPI.createGame(transformFormData(createGameFormData)).then(
      (response: CreateGameResponse) => {
        setRequestInProgress(false)
        setAndShowResultModal(`Game created successfully! Game ID: ${response.gameSessionId}`)
      },
      (error: Error) => {
        setRequestInProgress(false)
        setAndShowResultModal(error.message)
      },
    )
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
            <p>Character Asset File: {createGameFormData.characterAssetsName}</p>
            <p>Resource Asset File: {createGameFormData.resourceAssetsName}</p>
            <p>Tile Asset File: {createGameFormData.tileAssetName}</p>
            <p>Map Asset File: {createGameFormData.mapAssetName}</p>
          </div>
        </div>
        <div className='summary-class-resources'>
          <h5>Class Resources</h5>
          <div className='summary-class-resources-container'>
            {renderClassResources(createGameFormData.classResources)}
          </div>
        </div>
        <div className='summary-travels'>
          <h5>Low Travels</h5>
          <div className='summary-travels-container'>
            {renderTravels(createGameFormData.lowTravels)}
          </div>
        </div>
        <div className='summary-travels'>
          <h5>Medium Travels</h5>
          <div className='summary-travels-container'>
            {renderTravels(createGameFormData.mediumTravels)}
          </div>
        </div>
        <div className='summary-travels'>
          <h5>High Travels</h5>
          <div className='summary-travels-container'>
            {renderTravels(createGameFormData.highTravels)}
          </div>
        </div>
      </div>
      <div className='game-submit-form-input'>
        <label htmlFor=''>Game name</label>
        <input
          minLength={3}
          maxLength={254}
          value={createGameFormData.gameName}
          onChange={(e) => {
            setCreateGameFormData({ ...createGameFormData, gameName: e.target.value })
          }}
          type='text'
        />
      </div>
      <div className='submit-form-button'>
        <button
          disabled={createGameFormData.gameName.length < 3}
          className={`${createGameFormData.gameName.length < 3 ? 'disabled' : ''}`}
          onClick={() => {
            handleSubmit()
          }}
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default SubmitForm
