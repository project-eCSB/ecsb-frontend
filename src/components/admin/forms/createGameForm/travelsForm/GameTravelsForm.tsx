import type React from 'react'
import { useState } from 'react'
import { type CreateGameFormData, type Travel, TravelType } from '../CreateGameForm'
import './GameTravelsForm.css'

interface GameTravelsFormProps {
  createGameFormData: CreateGameFormData
  setCreateGameFormData: React.Dispatch<React.SetStateAction<CreateGameFormData>>
  showModifyTravelModalForm: (travel: Travel, index: number) => void
}

const GameTravelsForm: React.FC<GameTravelsFormProps> = ({
  createGameFormData,
  setCreateGameFormData,
  showModifyTravelModalForm,
}) => {
  const [selectedTab, setSelectedTab] = useState('low')

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab)
  }

  const modifyTravel = (travel: Travel, index: number) => {
    showModifyTravelModalForm(travel, index)
  }

  const handleChangeTownName = (index: number, townName: string) => {
    switch (selectedTab) {
      case 'low':
        handleChangeLowTownName(index, townName)
        break
      case 'medium':
        handleChangeMediumTownName(index, townName)
        break
      case 'high':
        handleChangeHighTownName(index, townName)
        break
    }
  }

  const handleChangeLowTownName = (index: number, townName: string) => {
    const newTravels = [...createGameFormData.lowTravels]
    newTravels[index].name = townName
    setCreateGameFormData({
      ...createGameFormData,
      lowTravels: newTravels,
    })
  }

  const handleChangeMediumTownName = (index: number, townName: string) => {
    const newTravels = [...createGameFormData.mediumTravels]
    newTravels[index].name = townName
    setCreateGameFormData({
      ...createGameFormData,
      mediumTravels: newTravels,
    })
  }

  const handleChangeHighTownName = (index: number, townName: string) => {
    const newTravels = [...createGameFormData.highTravels]
    newTravels[index].name = townName
    setCreateGameFormData({
      ...createGameFormData,
      highTravels: newTravels,
    })
  }

  const removeTravel = () => {
    switch (selectedTab) {
      case 'low':
        removeLowTravel()
        break
      case 'medium':
        removeMediumTravel()
        break
      case 'high':
        removeHighTravel()
        break
    }
  }

  const removeLowTravel = () => {
    const newTravels = [...createGameFormData.lowTravels]
    newTravels.splice(newTravels.length - 1, 1)
    setCreateGameFormData({
      ...createGameFormData,
      lowTravels: newTravels,
    })
  }

  const removeMediumTravel = () => {
    const newTravels = [...createGameFormData.mediumTravels]
    newTravels.splice(newTravels.length - 1, 1)
    setCreateGameFormData({
      ...createGameFormData,
      mediumTravels: newTravels,
    })
  }

  const removeHighTravel = () => {
    const newTravels = [...createGameFormData.highTravels]
    newTravels.splice(newTravels.length - 1, 1)
    setCreateGameFormData({
      ...createGameFormData,
      highTravels: newTravels,
    })
  }

  const addTravel = () => {
    switch (selectedTab) {
      case 'low':
        addLowTravel()
        break
      case 'medium':
        addMediumTravel()
        break
      case 'high':
        addHighTravel()
        break
    }
  }

  const addLowTravel = () => {
    const newTravels = [...createGameFormData.lowTravels]
    newTravels.push({
      type: TravelType.low,
      name: '',
      time: 0,
      regenTime: 0,
      moneyRange: {
        from: 0,
        to: 0,
      },
      resources: [],
    })

    for (const resource of createGameFormData.classResources) {
      newTravels[newTravels.length - 1].resources.push({
        key: resource.itemName,
        value: 0,
      })
    }

    setCreateGameFormData({
      ...createGameFormData,
      lowTravels: newTravels,
    })
  }

  const addMediumTravel = () => {
    const newTravels = [...createGameFormData.mediumTravels]
    newTravels.push({
      type: TravelType.medium,
      name: '',
      time: 0,
      regenTime: 0,
      moneyRange: {
        from: 0,
        to: 0,
      },
      resources: [],
    })

    for (const resource of createGameFormData.classResources) {
      newTravels[newTravels.length - 1].resources.push({
        key: resource.itemName,
        value: 0,
      })
    }

    setCreateGameFormData({
      ...createGameFormData,
      mediumTravels: newTravels,
    })
  }

  const addHighTravel = () => {
    const newTravels = [...createGameFormData.highTravels]
    newTravels.push({
      type: TravelType.high,
      name: '',
      time: 0,
      regenTime: 0,
      moneyRange: {
        from: 0,
        to: 0,
      },
      resources: [],
    })

    for (const resource of createGameFormData.classResources) {
      newTravels[newTravels.length - 1].resources.push({
        key: resource.itemName,
        value: 0,
      })
    }

    setCreateGameFormData({
      ...createGameFormData,
      highTravels: newTravels,
    })
  }

  const renderTravels = () => {
    let travels: Travel[] = []

    if (selectedTab === 'low') {
      travels = createGameFormData.lowTravels
    } else if (selectedTab === 'medium') {
      travels = createGameFormData.mediumTravels
    } else if (selectedTab === 'high') {
      travels = createGameFormData.highTravels
    }

    return travels.map((travel, index) => (
      <div key={index} className='travel'>
        <input
          maxLength={255}
          type='text'
          value={travel.name}
          onChange={(e) => {
            handleChangeTownName(index, e.target.value)
          }}
        />
        <div className='buttons'>
          <button
            id='modify-btn'
            onClick={() => {
              modifyTravel(travel, index)
            }}
            disabled={travel.name === ''}
            className={`${travel.name ? '' : 'disabled'}`}
          >
            <p>Modify</p>
          </button>
          <button
            id='remove-btn'
            onClick={() => {
              removeTravel()
            }}
          >
            <p>Remove</p>
          </button>
        </div>
      </div>
    ))
  }

  return (
    <div className='game-travels-form'>
      <div className='titles-container'>
        <p className='main-title'>Travels</p>
        <p className='sub-title'>Edit travels</p>
      </div>
      <div className='tabs'>
        <div
          className={`tab ${selectedTab === 'low' ? 'active' : ''}`}
          onClick={() => {
            handleTabChange('low')
          }}
        >
          Low Travels
        </div>
        <div
          className={`tab ${selectedTab === 'medium' ? 'active' : ''}`}
          onClick={() => {
            handleTabChange('medium')
          }}
        >
          Medium Travels
        </div>
        <div
          className={`tab ${selectedTab === 'high' ? 'active' : ''}`}
          onClick={() => {
            handleTabChange('high')
          }}
        >
          High Travels
        </div>
      </div>
      <div className='travels'>{renderTravels()}</div>
      <div className='add-travel'>
        <button onClick={addTravel}>Add travel</button>
      </div>
    </div>
  )
}

export default GameTravelsForm
