import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Subscription, Tool } from '../types/subscription';
import * as subscriptionService from '../services/subscriptionService';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  activeSubscription: Subscription | null;
  tools: Tool[];
  isLoading: boolean;
  error: string | null;
  addSubscription: (name: string, url: string, isLocal: boolean, updateInterval: string) => void;
  updateSubscription: (subscription: Subscription) => void;
  deleteSubscription: (id: string) => void;
  enableSubscription: (id: string) => void;
  refreshSubscription: (id: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化订阅
  useEffect(() => {
    try {
      const subs = subscriptionService.getSubscriptions();
      setSubscriptions(subs);
      
      // 设置激活的订阅
      const activeSub = subs.find(sub => sub.isEnabled);
      if (activeSub) {
        setActiveSubscription(activeSub);
        if (activeSub.data) {
          setTools(activeSub.data.data.tools);
        } else {
          loadSubscriptionData(activeSub);
        }
      }
    } catch (err) {
      setError('Failed to load subscriptions');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 加载订阅数据
  const loadSubscriptionData = async (subscription: Subscription) => {
    if (subscription.isLocal) return;
    
    setIsLoading(true);
    try {
      const data = await subscriptionService.fetchSubscriptionData(subscription.url);
      
      // 更新订阅数据
      const updatedSubscription = {
        ...subscription,
        lastUpdated: new Date().toISOString(),
        data
      };
      
      // 更新状态
      setSubscriptions(prev => 
        prev.map(sub => sub.id === updatedSubscription.id ? updatedSubscription : sub)
      );
      
      if (updatedSubscription.isEnabled) {
        setActiveSubscription(updatedSubscription);
        setTools(data.data.tools);
      }
      
      // 保存到本地存储
      subscriptionService.updateSubscription(updatedSubscription);
    } catch (err) {
      setError(`Failed to load subscription data: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 添加订阅
  const addSubscription = (name: string, url: string, isLocal: boolean, updateInterval: string) => {
    if (subscriptions.length >= 10) {
      setError('最多只能添加10个订阅');
      return;
    }
    try {
      const newSubscription = subscriptionService.addSubscription(
        name, 
        url, 
        isLocal, 
        updateInterval as any
      );
      
      setSubscriptions(prev => [...prev, newSubscription]);
      
      // 如果是本地文件，不需要加载数据
      if (!isLocal) {
        loadSubscriptionData(newSubscription);
      }
    } catch (err) {
      setError(`Failed to add subscription: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    }
  };

  // 更新订阅
  const updateSubscription = (subscription: Subscription) => {
    try {
      subscriptionService.updateSubscription(subscription);
      
      setSubscriptions(prev => 
        prev.map(sub => sub.id === subscription.id ? subscription : sub)
      );
      
      if (subscription.isEnabled) {
        setActiveSubscription(subscription);
        if (subscription.data) {
          setTools(subscription.data.data.tools);
        }
      }
    } catch (err) {
      setError(`Failed to update subscription: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    }
  };

  // 删除订阅
  const deleteSubscription = (id: string) => {
    try {
      subscriptionService.deleteSubscription(id);
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    } catch (err) {
      setError(`Failed to delete subscription: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    }
  };

  // 启用订阅
  const enableSubscription = (id: string) => {
    try {
      subscriptionService.enableSubscription(id);
      
      // 先设置加载状态
      setIsLoading(true);
      
      // 更新状态
      const updatedSubscriptions = subscriptions.map(sub => ({
        ...sub,
        isEnabled: sub.id === id
      }));
      
      setSubscriptions(updatedSubscriptions);
      
      // 设置激活的订阅
      const newActiveSubscription = updatedSubscriptions.find(sub => sub.id === id) || null;
      setActiveSubscription(newActiveSubscription);
      
      // 更新工具列表
      if (newActiveSubscription && newActiveSubscription.data) {
        setTools(newActiveSubscription.data.data.tools);
        setIsLoading(false);
      } else if (newActiveSubscription && !newActiveSubscription.isLocal) {
        // 异步加载数据，保持加载状态直到完成
        loadSubscriptionData(newActiveSubscription);
        // loadSubscriptionData 内部会处理 setIsLoading(false)
      } else {
        setTools([]);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      setError(`Failed to enable subscription: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    }
  };

  // 刷新订阅
  const refreshSubscription = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await subscriptionService.refreshSubscription(id);
      
      // 重新加载订阅列表
      const updatedSubscriptions = subscriptionService.getSubscriptions();
      setSubscriptions(updatedSubscriptions);
      
      // 更新激活的订阅
      const updatedActiveSubscription = updatedSubscriptions.find(sub => sub.isEnabled) || null;
      setActiveSubscription(updatedActiveSubscription);
      
      // 更新工具列表
      if (updatedActiveSubscription && updatedActiveSubscription.data) {
        setTools(updatedActiveSubscription.data.data.tools);
      } else {
        setTools([]);
      }
    } catch (err) {
      setError(`Failed to refresh subscription: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    subscriptions,
    activeSubscription,
    tools,
    isLoading,
    error,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    enableSubscription,
    refreshSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};