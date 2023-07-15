interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyShow {
  available_markets: string;
  copyrights: {
    text: string;
    type: string;
  }[];
  description: string;
  html_description: string;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  is_externally_hosted: boolean;
  languages: string[];
  media_type: string;
  name: string;
  publisher: string;
  type: string;
  uri: string;
  total_episodes: number;
}

type SpotifySearchResult = {
  shows?: {
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
    items: SpotifyShow[];
  }
};

interface SpotifyShowEpisodes {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: {
    audio_preview_url: string;
    description: string;
    html_description: string;
    duration_ms: number;
    explicit: boolean;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: {
      url: string;
      height: number;
      width: number;
    }[];
    is_externally_hosted: boolean;
    is_playable: boolean;
    language: string;
    languages: string[];
    name: string;
    release_date: string;
    release_date_precision: string;
    resume_point: {
      fully_played: boolean;
      resume_position_ms: number;
    };
    type: string;
    uri: string;
    restrictions: {
      reason: string;
    };
  }[];
}

interface SpotifyErrorResponse {
  error: {
    status: number;
    message: string;
  };
}
