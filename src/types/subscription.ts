export interface Author {
  name: string;
  avatar: string;
  link: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  author: Author;
  version: string;
  changelog: string;
  releaseDate: string;
  toolFileUrl: string;
  downloadUrl: string;
  downloads: number;
  documentation: string;
}

export interface SubscriptionData {
  success: boolean;
  message: string;
  count: number;
  data: {
    tools: Tool[];
  };
}

export type UpdateInterval = 'startup' | 'daily' | 'weekly' | 'monthly' | 'manual';

export interface Subscription {
  id: string;
  name: string;
  url: string;
  isLocal: boolean;
  isEnabled: boolean;
  isNative?: boolean;
  updateInterval: UpdateInterval;
  lastUpdated: string;
  data?: SubscriptionData;
}