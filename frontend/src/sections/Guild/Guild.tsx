import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAPI } from "../../provider/hooks/useAPI"
import type { Guild } from "../../types";
import { GuildHeader } from "./GuildHeader";
import { GuildInformation } from "./GuildInformation";
import './Guild.scss'

export function Guild() {
  const params = useParams();
  const { guild, setGuild } = useAPI();

  useEffect(() => {
    if (!params.id || guild?.id === params.id) {
      return;
    }

    setGuild(params.id);
  }, [])

  return <>
    <GuildHeader />
    <div className="sections">
      <GuildInformation />
    </div>
  </>
}

