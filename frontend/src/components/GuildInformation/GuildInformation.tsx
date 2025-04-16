import type { JSX } from 'react';
import { Card } from '../Card/Card';
import { useAPI } from '../../provider/hooks/useAPI';
import'./GuildInformation.scss';

export const GuildInformation = function(): JSX.Element {
  const { guild } = useAPI();

  const counts =
    (guild.data?.channels || [])
      .reduce<{categories: number, textChannels: number, voiceChannels: number}>((counts, channel) => {
        switch (channel.type) {
          case 'CATEGORY': {
            counts.categories++;
            break;
          }
          case 'TEXT': {
            counts.textChannels++;
            break;
          }
          case 'VOICE': {
            counts.voiceChannels++;
            break;
          }
        }
        return counts;
      }, { categories: 0, textChannels: 0, voiceChannels: 0 });


  return (
    <Card className="guild-information" title="Guild information">
      <ul className="guild-stats">
        <li className="guild-stats__list-item"><b>Roles:</b><span>{guild.data?.roles?.length || 0}</span></li>
        <li className="guild-stats__list-item"><b>Categories:</b><span>{counts.categories}</span></li>
        <li className="guild-stats__list-item"><b>Text channels:</b><span>{counts.textChannels}</span></li>
        <li className="guild-stats__list-item"><b>VoiceChannels:</b><span>{counts.voiceChannels}</span></li>
      </ul>
    </Card>
  );
};