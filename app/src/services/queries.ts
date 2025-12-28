import { useQuery, useInfiniteQuery, useMutation, UseQueryOptions, UseInfiniteQueryOptions } from '@tanstack/react-query';
import * as api from './api';

// Keys
export const QUERY_KEYS = {
  ipos: 'ipos',
  buybacks: 'buybacks',
  brokers: 'brokers',
  gmpTrends: 'gmpTrends',
  marketIndices: 'marketIndices',
  ipoDetails: 'ipoDetails',
};

// Hooks

export const useMarketIndices = (options?: Partial<UseQueryOptions<any, Error>>) => {
  return useQuery({
    queryKey: [QUERY_KEYS.marketIndices],
    queryFn: api.getMarketIndices,
    ...options,
  });
};

export const useIPOs = (
  status?: string, 
  is_sme?: number, 
  page: number = 1, 
  limit: number = 20,
  options?: Partial<UseQueryOptions<any, Error>>
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ipos, status, is_sme, page, limit],
    queryFn: () => api.getIPOs(status, is_sme, page, limit),
    ...options,
  });
};

export const useIPOsInfinite = (
  status?: string,
  is_sme?: number,
  limit: number = 20,
  options?: Partial<UseInfiniteQueryOptions<any, Error>>
) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.ipos, 'infinite', status, is_sme, limit],
    queryFn: ({ pageParam = 1 }) => api.getIPOs(status, is_sme, pageParam as number, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
        // Assuming the API returns pagination info or we check if lastPage.ipos.length < limit
        if (lastPage.ipos.length < limit) return undefined;
        return allPages.length + 1;
    },
    ...options,
  });
};

export const useBuybacks = (options?: Partial<UseQueryOptions<api.Buyback[], Error>>) => {
  return useQuery({
    queryKey: [QUERY_KEYS.buybacks],
    queryFn: api.getBuybacks,
    ...options,
  });
};

export const useBrokers = (options?: Partial<UseQueryOptions<api.Broker[], Error>>) => {
  return useQuery({
    queryKey: [QUERY_KEYS.brokers],
    queryFn: api.getBrokers,
    ...options,
  });
};

export const useGMPTrends = (
  page: number = 1,
  limit: number = 20,
  is_sme?: number,
  status?: string,
  minPremium: number = 1,
  maxPremium?: number,
  sort: 'date' | 'gmp_high' | 'gmp_low' = 'gmp_high',
  options?: Partial<UseQueryOptions<any, Error>>
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.gmpTrends, page, limit, is_sme, status, minPremium, maxPremium, sort],
    queryFn: () => api.getGMPTrends(page, limit, is_sme, status, minPremium, maxPremium, sort),
    ...options,
  });
};

// Also adding infinite query for GMP Trends if needed
export const useGMPTrendsInfinite = (
    limit: number = 20,
    is_sme?: number,
    status?: string,
    minPremium: number = 1,
    maxPremium?: number,
    sort: 'date' | 'gmp_high' | 'gmp_low' = 'gmp_high',
    options?: Partial<UseInfiniteQueryOptions<any, Error>>
  ) => {
    return useInfiniteQuery({
      queryKey: [QUERY_KEYS.gmpTrends, 'infinite', limit, is_sme, status, minPremium, maxPremium, sort],
      queryFn: ({ pageParam = 1 }) => api.getGMPTrends(pageParam as number, limit, is_sme, status, minPremium, maxPremium, sort),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
          if (lastPage.ipos.length < limit) return undefined;
          return allPages.length + 1;
      },
      ...options,
    });
  };

export const useIPODetails = (id: number, options?: Partial<UseQueryOptions<api.IPODetails | null, Error>>) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ipoDetails, id],
    queryFn: () => api.getIPODetails(id),
    enabled: !!id,
    ...options,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) => api.loginUser(username, password),
  });
};

export const useRegister = () => {
    return useMutation({
      mutationFn: ({ username, password }: { username: string; password: string }) => api.registerUser(username, password),
    });
};
