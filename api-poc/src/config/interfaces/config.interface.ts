interface ApiConfigProps {
  fengAuthUrl: string;
  fengApiUrl: string;
  fengLogin: string;
  fengPass: string;
  httpTimeout: number;
}

interface VtexConfigPros {
  clSearchUrl: string;
  clPathUrl: string;
  appKey: string;
  appToken: string;
}

export interface ConfigProps {
  port: number;
  tokenCacheTime: number;
  api: ApiConfigProps;
  vtex: VtexConfigPros;
}
