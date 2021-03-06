import type { Model } from "app/store/types/model";
import type { TSFixMe } from "app/base/types";

export type Space = Model & {
  created: string;
  description: string;
  name: string;
  subnet_ids: number[];
  updated: string;
  vlan_ids: number[];
};

export type SpaceState = {
  errors: TSFixMe;
  items: Space[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
