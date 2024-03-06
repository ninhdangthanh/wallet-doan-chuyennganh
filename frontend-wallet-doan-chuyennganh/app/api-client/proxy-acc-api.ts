import { ICreateProxyAccount, IUpdateProxyAccount } from "../common";
import axiosClient from "./axios-client";

export const proxyAccApi = {
  getProxyAccounts() {
    return axiosClient.get("/proxies/proxy-acc-data");
  },

  createProxyAccount(payload: ICreateProxyAccount) {
    return axiosClient.post("/proxies/create_proxy_acc", payload);
  },

  updateProxyAccount(payload: IUpdateProxyAccount) {
    return axiosClient.put("/proxies/proxy-acc-data", payload);
  },
};
