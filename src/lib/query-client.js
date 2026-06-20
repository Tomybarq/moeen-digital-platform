import { QueryClient } from '@tanstack/react-query';


export const queryClientInstance = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 300000,        // 5 minutes — avoid redundant refetches
			gcTime: 600000,           // 10 minutes — keep server data in cache
			refetchOnWindowFocus: false,
			retry: 1,
		},
	},
});