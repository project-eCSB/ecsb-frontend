import { type CreateGameFormData, type ModifyTravelData } from '../../CreateGameForm'
import './ModifyTravel.css'
import type React from 'react'

interface ModifyTravelProps {
  createGameFormData: CreateGameFormData
  setCreateGameFormData: React.Dispatch<React.SetStateAction<CreateGameFormData>>
  travelData: ModifyTravelData
  onClose: () => void
}

const ModifyTravel: React.FC<ModifyTravelProps> = ({
  createGameFormData,
  setCreateGameFormData,
  travelData,
  onClose,
}) => {
  const handleItemCostChange = (value: number, itemIndex: number) => {
    if (!isNaN(value)) {
      const updatedTravels = { ...createGameFormData }
      const { travel, index } = travelData
      updatedTravels[`${travel.type}Travels`][index].resources[itemIndex].value = value
      setCreateGameFormData(updatedTravels)
    }
  }

  const handleMinRewardChange = (value: number) => {
    const updatedTravels = { ...createGameFormData }
    const { index, travel } = travelData
    updatedTravels[`${travel.type}Travels`][index].moneyRange.from = value
    setCreateGameFormData(updatedTravels)
  }

  const handleMaxRewardChange = (value: number) => {
    const updatedTravels = { ...createGameFormData }
    const { index, travel } = travelData
    updatedTravels[`${travel.type}Travels`][index].moneyRange.to = value
    setCreateGameFormData(updatedTravels)
  }

  const handleTimeChange = (value: number) => {
    const updatedTravels = { ...createGameFormData }
    const { index, travel } = travelData
    updatedTravels[`${travel.type}Travels`][index].time = value
    setCreateGameFormData(updatedTravels)
  }

  const handleTokenRegenerationChange = (value: number) => {
    const updatedTravels = { ...createGameFormData }
    const { index, travel } = travelData
    updatedTravels[`${travel.type}Travels`][index].regenTime = value
    setCreateGameFormData(updatedTravels)
  }

  return (
    <div className='modify-travel-modal'>
      <div className='modify-travel-modal-content'>
        <div className='modify-travel-modal-headers'>
          <h5>Travel info - {travelData.travel.name}</h5>
          <h6>Update your travel info</h6>
        </div>
        <table className='modify-travel-table'>
          <thead>
            <tr>
              <th>Item</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {travelData.travel.resources.map((item, index) => (
              <tr key={index}>
                <td className='td-name'>{item.key}</td>
                <td className='td-input'>
                  <input
                    min={0}
                    max={1000000}
                    type='number'
                    value={item.value}
                    onChange={(e) => {
                      handleItemCostChange(parseInt(e.target.value, 10), index)
                    }}
                  />
                </td>
              </tr>
            ))}
            <tr key={travelData.travel.resources.length}>
              <td className='td-name'>time</td>
              <td className='td-input'>
                <input
                  min={0}
                  max={1000000}
                  type='number'
                  value={travelData.travel.time}
                  onChange={(e) => {
                    handleTimeChange(parseInt(e.target.value, 10))
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className='modify-travel-modal-token-regeneration'>
          <h5>Time token regeneration</h5>
          <div className='token-reg'>
            <input
              min={0}
              max={1000}
              type='number'
              value={travelData.travel.regenTime}
              onChange={(e) => {
                handleTokenRegenerationChange(parseInt(e.target.value, 10))
              }}
            />
          </div>
        </div>
        <div className='modify-travel-modal-rewards'>
          <h5>Rewards</h5>
          <div className='rewards'>
            <div className='reward'>
              <label htmlFor=''>min</label>
              <input
                min={0}
                max={1000000}
                type='number'
                value={travelData.travel.moneyRange.from}
                onChange={(e) => {
                  handleMinRewardChange(parseInt(e.target.value, 10))
                }}
              />
            </div>
            <div className='reward'>
              <label htmlFor=''>max</label>
              <input
                min={0}
                max={1000000}
                type='number'
                value={travelData.travel.moneyRange.to}
                onChange={(e) => {
                  handleMaxRewardChange(parseInt(e.target.value, 10))
                }}
              />
            </div>
          </div>
        </div>
        <div className='modify-travel-data-button'>
          <button className='modify-travel-data-close' onClick={onClose}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModifyTravel
