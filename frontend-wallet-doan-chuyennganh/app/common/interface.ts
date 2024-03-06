export interface ISignInPayload {
  email: string;
}

export interface IProxyData {
  user_addr: string;
  username: string;
  ip_rotation_period: number;
  whitelisted_ips: string;
  city_geoname_id: number | null;
  country_geoname_id: number;
  rate_per_kb: number;
  rate_per_second: number;
  prioritized_ip: string;
  prioritized_ip_level: string | null;
}

export interface ICreateProxyAccount {
  whitelisted_ip: string | null;
  country_geoname_id: number;
  city_geoname_id: number | null;
  rate_per_second: number;
  rate_per_kb: number;
  prioritized_ip: string | null;
  prioritized_ip_level: string | null;
}

export interface IUpdateProxyAccount extends ICreateProxyAccount {
  ip_rotation_period: number;
  proxy_acc_id: string;
}
