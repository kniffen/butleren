interface TwitterToken {
  access_token: string;
}

interface TwitterUsers {
  data: {
    id: string;
    username: string;
    name: string;
  }[];
}

interface TwitterTweets {
  data: {
    id: string;
    edit_history_tweet_ids: string[];
    text: string;
    created_at?: string;
    author_id?: string;
    in_reply_to_user_id?: string;
    referenced_tweets?: {
      type: unknown;
      id: string;
    }[];
    attachments?: {
      media_keys: unknown[];
      poll_ids: unknown[];
    };
    entities?: {
      annotations: {
        start: number;
        end: number;
        probability: number;
        type: string;
        normalized_text: string;
      }[];
      urls: {
        start: number;
        end: number;
        url: string;
        expanded_url: string;
        display_url: string;
        unwound_url: string;
      }[];
      hashtags: {
        start: number;
        end: number;
        tag: string;
      }[];
      mentions: {
        start: number;
        end: number;
        username: string;
      }[];
      cashtags: {
        start: number;
        end: number;
        tag: string;
      }[];
    }

  }[];
}