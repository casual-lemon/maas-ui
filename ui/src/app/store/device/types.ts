import type { ModelRef } from "app/store/types/model";
import type { SimpleNode } from "app/store/types/node";
import type { TSFixMe } from "app/base/types";

export type Device = SimpleNode & {
  extra_macs: string[];
  fabrics: string[];
  ip_address?: string;
  ip_assignment: "external" | "dynamic" | "static";
  link_speeds: number[];
  owner: string;
  parent: string | null; // `parent` is a `system_id`
  primary_mac: string;
  spaces: string[];
  subnets: string[];
  zone: ModelRef;
};

export type DeviceState = {
  errors: TSFixMe;
  items: Device[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
