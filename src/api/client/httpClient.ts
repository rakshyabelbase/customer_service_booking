import { ApiError, type ApiErrorPayload } from '../../types';

export interface HttpClientConfig {
  simulatedDelayMs?: number;
  forceServerError?: boolean;
}

let globalConfig: HttpClientConfig = {
  simulatedDelayMs: 600,
  forceServerError: false,
};

export const setHttpClientConfig = (config: Partial<HttpClientConfig>) => {
  globalConfig = { ...globalConfig, ...config };
};

export const getHttpClientConfig = (): HttpClientConfig => {
  return { ...globalConfig };
};

/**
 * Simulates network latency based on active client config
 */
export const delay = (ms?: number): Promise<void> => {
  const targetMs = ms ?? globalConfig.simulatedDelayMs ?? 600;
  return new Promise((resolve) => setTimeout(resolve, targetMs));
};

/**
 * Checks for global failure injection mode before executing handler
 */
export const executeRequest = async <T>(requestFn: () => Promise<T>): Promise<T> => {
  await delay();

  if (globalConfig.forceServerError) {
    const errorPayload: ApiErrorPayload = {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Simulated 500 Internal Server Error: The database cluster failed to respond.',
    };
    throw new ApiError(500, errorPayload);
  }

  try {
    return await requestFn();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    const fallbackPayload: ApiErrorPayload = {
      code: 'INTERNAL_SERVER_ERROR',
      message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
    throw new ApiError(500, fallbackPayload);
  }
};
