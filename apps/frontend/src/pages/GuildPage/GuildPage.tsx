import type { ReactNode } from 'react';
import { useAPI } from '../../provider/hooks/useAPI';
import { GuildHeader } from '../../components/GuildHeader/GuildHeader';
import { GuildStatistics } from '../../components/GuildStatistics/GuildStatistics';
import { GuildSettings } from '../../components/GuildSettings/GuildSettings';
import { useParams } from 'react-router-dom';
import { Modules } from '../../components/Modules/Modules';
import { Commands } from '../../components/Commands/Commands';
import { LoadingCard } from '../../components/LoadingCard/LoadingCard';

export const GuildPage = function(): ReactNode {
  const { guild } = useAPI();

    if (guild.isLoading) {
    return <>
      <LoadingCard height="5rem" />
      <LoadingCard />
      <LoadingCard />
    </>;
  }

  if (null === guild.data) {
    return <p>Guild not found</p>;
  }

  return <>
    <GuildHeader />
    <GuildPageContent />
  </>;
};

const GuildPageContent = function(): ReactNode {
  const params = useParams();

  if ('modules' === params.content) {
    return <Modules />;
  }

  if ('commands' === params.content) {
    return <Commands />;
  }

  return <>
    <GuildStatistics />
    <GuildSettings />
  </>;
};