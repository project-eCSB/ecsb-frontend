import { type CreateGameFormData } from '../CreateGameForm'
import './GameResourcesForm.css'

interface GameResourcesFormProps {
  createGameFormData: CreateGameFormData
  setCreateGameFormData: React.Dispatch<React.SetStateAction<CreateGameFormData>>
}

const GameResourcesForm: React.FC<GameResourcesFormProps> = ({
  createGameFormData,
  setCreateGameFormData,
}) => {
  const handleChangeCharacterMapping = (index: number, value: number) => {
    if (value < 1 || value > createGameFormData.classResources.length) return

    const updatedResources = [...createGameFormData.classResources]
    updatedResources[index].characterMapping = value
    setCreateGameFormData((prevFormData) => ({
      ...prevFormData,
      classResources: updatedResources,
    }))
  }

  const handleChangeItemName = (index: number, value: string) => {
    const updatedResources = [...createGameFormData.classResources]
    updatedResources[index].itemName = value
    setCreateGameFormData((prevFormData) => ({
      ...prevFormData,
      classResources: updatedResources,
    }))
  }

  const handleChangeItemMapping = (index: number, value: number) => {
    if (value < 1 || value > createGameFormData.classResources.length) return

    const updatedResources = [...createGameFormData.classResources]
    updatedResources[index].itemMapping = value
    setCreateGameFormData((prevFormData) => ({
      ...prevFormData,
      classResources: updatedResources,
    }))
  }

  const handleChangeCostPerItem = (index: number, value: number) => {
    if (value < 1 || value > 1000000) return

    const updatedResources = [...createGameFormData.classResources]
    updatedResources[index].costPerItem = value
    setCreateGameFormData((prevFormData) => ({
      ...prevFormData,
      classResources: updatedResources,
    }))
  }

  const handleChangeItemPerWorkshop = (index: number, value: number) => {
    if (value < 1 || value > 1000000) return

    const updatedResources = [...createGameFormData.classResources]
    updatedResources[index].itemPerWorkshop = value
    setCreateGameFormData((prevFormData) => ({
      ...prevFormData,
      classResources: updatedResources,
    }))
  }

  return (
    <div className='game-details-form'>
      <h5 className='main-title'>Class representation</h5>
      <h6 className='sub-title'>Enter details for each class resource</h6>
      <table>
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Character Mapping</th>
            <th>Item Name</th>
            <th>Item Mapping</th>
            <th>Cost per Item</th>
            <th>Item per Workshop</th>
          </tr>
        </thead>
        <tbody>
          {createGameFormData.classResources.map((resource, index) => (
            <tr key={index}>
              <td>{resource.className}</td>
              <td>
                <input
                  min={1}
                  max={createGameFormData.classResources.length}
                  type='number'
                  value={resource.characterMapping}
                  onChange={(e) => {
                    handleChangeCharacterMapping(index, parseInt(e.target.value))
                  }}
                />
              </td>
              <td>
                <input
                  type='text'
                  value={resource.itemName}
                  onChange={(e) => {
                    handleChangeItemName(index, e.target.value)
                  }}
                />
              </td>
              <td>
                <input
                  min={1}
                  max={createGameFormData.classResources.length}
                  type='number'
                  value={resource.itemMapping}
                  onChange={(e) => {
                    handleChangeItemMapping(index, parseInt(e.target.value))
                  }}
                />
              </td>
              <td>
                <input
                  min={1}
                  max={1000000}
                  type='number'
                  value={resource.costPerItem}
                  onChange={(e) => {
                    handleChangeCostPerItem(index, parseInt(e.target.value))
                  }}
                />
              </td>
              <td>
                <input
                  min={1}
                  max={1000000}
                  type='number'
                  value={resource.itemPerWorkshop}
                  onChange={(e) => {
                    handleChangeItemPerWorkshop(index, parseInt(e.target.value))
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default GameResourcesForm
