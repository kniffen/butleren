import { ChatInputCommandInteraction } from 'discord.js';

import { profileCommand } from './profile';
import subCommandViewMock from './profile/view';
import subCommandDeleteMock from './profile/delete';
import subCommandSetlocationMock from './profile/setlocation';

jest.mock('./profile/view', () => ({__esModule: true, default: jest.fn()}));
jest.mock('./profile/delete', () => ({__esModule: true, default: jest.fn()}));
jest.mock('./profile/setlocation', () => ({__esModule: true, default: jest.fn()}));

describe('modules.users.commands.profile', function() {
  const interactions = [
    {id: 'interaction001', options: {getSubcommand: () => 'view'}},
    {id: 'interaction001', options: {getSubcommand: () => 'delete'}},
    {id: 'interaction001', options: {getSubcommand: () => 'setlocation'}},
  ] as unknown as ChatInputCommandInteraction[];

  beforeEach(function() {
    jest.clearAllMocks();
  });

  afterAll(function() {
    jest.restoreAllMocks();
  });

  it('should contain certain properties', function() {
    expect(profileCommand.isLocked);

    expect(profileCommand.data.toJSON?.()).toEqual({
      name: 'profile',
      description: 'User profile information',
      options: [
        {
          name: 'view',
          description: 'View your profile',
          options: [],
          type: 1,
        },
        {
          name: 'delete',
          description: 'Delete your profile',
          options: [],
          type: 1,
        },
        {
          name: 'setlocation',
          description: 'Set your location',
          type: 1,
          options: [
            {
              name: 'location',
              description: 'Location name or zip code',
              type: 3,
              required: true,
            }
          ],
        }
      ],
    });
  });

  it('should redirect to sub command executors', async function() {
    await Promise.all(interactions.map(interaction => profileCommand.execute(interaction)));

    expect(subCommandViewMock).toHaveBeenCalledWith(interactions[0]);
    expect(subCommandDeleteMock).toHaveBeenCalledWith(interactions[1]);
    expect(subCommandSetlocationMock).toHaveBeenCalledWith(interactions[2]);
  });
});
