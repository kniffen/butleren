interface TwitchToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

interface TwitchSchedule {
  data: {
    segments: {
      id: string;
      start_time: string;
      end_time: string;
      title: string;
      canceled_until: null,
      category: {
        id: string;
        name: string;
      },
      is_recurring: boolean;
    }[];
    broadcaster_id: string;
    broadcaster_name: string;
    broadcaster_login: string;
    vacation: null
  },
  pagination: {
    cursor?: string;
  }
}

interface TwitchSearchCategoryResult {
  data: {
    id: string;
    name: string;
    box_art_url: string;
  }[];
  pagination: {
    cursor: string;
  }
}

interface TwitchSearchChannelResult {
  data: {
    broadcaster_language: string;
    broadcaster_login: string;
    display_name: string;
    game_id: string;
    game_name: string;
    id: string;
    is_live: boolean;
    tag_ids: string[];
    tags: string[];
    thumbnail_url: string;
    title: string;
    started_at: string;
  }[];
  pagination: {
    cursor: string;
  }
}

interface TwitchStreams {
  data: {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    tags: string[];
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
    is_mature: boolean;
  }[];
  pagination: {
    cursor: string;
  }
}

interface TwitchUsers {
  data: {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    email: string;
    created_at: string;
  }[];
}
