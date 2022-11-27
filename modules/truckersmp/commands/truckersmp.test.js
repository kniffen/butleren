import * as command from './truckersmp.js'
import statusSubCommand from './truckersmp/status.js'

jest.mock(
  './truckersmp/status.js',
  () => ({ __esModule: true, default: jest.fn()})
)

describe('modules.truckersmp.commands.truckersmp', function() {
  it('Should contain certain properties', function() {
    expect(command.isLocked).toEqual(false)
    expect(command.data.toJSON()).toEqual({
      name: 'truckersmp',
      description: 'TruckersMP integration',
      options: [
        {
          name: 'status',
          description: 'Get the current status of TruckersMP servers',
          type: 1,
          options: [],
        }
      ]
    })
  })

  it('Should forward sub commands', async function() {
    const interaction = {
      options: {
        getSubcommand: () => 'status'
      }
    }
    await command.execute(interaction)

    expect(statusSubCommand).toHaveBeenCalledWith(interaction)
  })
})