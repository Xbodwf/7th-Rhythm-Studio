import { Subscription, SubscriptionData, UpdateInterval } from '../types/subscription';
import { v4 as uuidv4 } from 'uuid';

// 默认订阅
const DEFAULT_SUBSCRIPTION: Subscription = {
  id: 'default',
  name: 'Native Link',
  url: 'https://7th.rhythmdoctor.top/api/tools/get_tools.php',
  isLocal: false,
  isEnabled: true,
  isNative: true,
  updateInterval: 'startup',
  lastUpdated: new Date().toISOString(),
};

// 本地存储键
const SUBSCRIPTIONS_STORAGE_KEY = '7rs-subscriptions';

// 获取所有订阅
export const getSubscriptions = (): Subscription[] => {
  const storedSubscriptions = localStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY);
  if (!storedSubscriptions) {
    // 如果没有存储的订阅，返回默认订阅
    saveSubscriptions([DEFAULT_SUBSCRIPTION]);
    return [DEFAULT_SUBSCRIPTION];
  }
  
  try {
    const subscriptions: Subscription[] = JSON.parse(storedSubscriptions);
    // 确保默认订阅始终存在
    if (!subscriptions.some(sub => sub.id === 'default')) {
      subscriptions.push(DEFAULT_SUBSCRIPTION);
      saveSubscriptions(subscriptions);
    }
    return subscriptions;
  } catch (error) {
    console.error('Failed to parse subscriptions:', error);
    return [DEFAULT_SUBSCRIPTION];
  }
};

// 保存所有订阅
export const saveSubscriptions = (subscriptions: Subscription[]): void => {
  localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(subscriptions));
};

// 添加新订阅
export const addSubscription = (
  name: string,
  url: string,
  isLocal: boolean,
  updateInterval: UpdateInterval
): Subscription => {
  const newSubscription: Subscription = {
    id: uuidv4(),
    name,
    url,
    isLocal,
    isEnabled: false,
    updateInterval,
    lastUpdated: new Date().toISOString(),
  };
  
  const subscriptions = getSubscriptions();
  subscriptions.push(newSubscription);
  saveSubscriptions(subscriptions);
  
  return newSubscription;
};

// 更新订阅
export const updateSubscription = (updatedSubscription: Subscription): void => {
  const subscriptions = getSubscriptions();
  const index = subscriptions.findIndex(sub => sub.id === updatedSubscription.id);
  
  if (index !== -1) {
    subscriptions[index] = updatedSubscription;
    saveSubscriptions(subscriptions);
  }
};

// 删除订阅
export const deleteSubscription = (id: string): void => {
  // 不允许删除默认订阅
  if (id === 'default') return;
  
  const subscriptions = getSubscriptions();
  const filteredSubscriptions = subscriptions.filter(sub => sub.id !== id);
  saveSubscriptions(filteredSubscriptions);
};

// 启用订阅
export const enableSubscription = (id: string): void => {
  const subscriptions = getSubscriptions();
  
  // 禁用所有订阅
  const updatedSubscriptions = subscriptions.map(sub => ({
    ...sub,
    isEnabled: sub.id === id
  }));
  
  saveSubscriptions(updatedSubscriptions);
};

// 获取订阅数据
export const fetchSubscriptionData = async (url: string): Promise<SubscriptionData> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch subscription: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching subscription data:', error);
    throw error;
  }
};

// 更新订阅数据
export const refreshSubscription = async (id: string): Promise<void> => {
  const subscriptions = getSubscriptions();
  const subscription = subscriptions.find(sub => sub.id === id);
  
  if (!subscription || subscription.isLocal) return;
  
  try {
    const data = await fetchSubscriptionData(subscription.url);
    const updatedSubscription: Subscription = {
      ...subscription,
      lastUpdated: new Date().toISOString(),
      data
    };
    
    updateSubscription(updatedSubscription);
  } catch (error) {
    console.error(`Failed to refresh subscription ${id}:`, error);
    throw error;
  }
};