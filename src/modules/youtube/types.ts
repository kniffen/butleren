export interface YouTubeChannels {
  items: {
    id: string;
    snippet: {
      title: string;
      description: string;
      customUrl: string;
    }
  }[]
}

export interface YouTubeActivities {
  items: unknown[]
}

export interface YouTubeSearchResults {
  items: unknown[];
}