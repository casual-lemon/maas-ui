import { Code, Spinner } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useStorageState } from "react-storage-hooks";

import { sendAnalyticsEvent } from "analytics";
import type { RootState } from "app/store/root/types";
import { actions as podActions } from "app/store/pod";
import configSelectors from "app/store/config/selectors";
import podSelectors from "app/store/pod/selectors";
import { useWindowTitle } from "app/base/hooks";
import KVMAggregateResources from "./KVMAggregateResources";
import KVMNumaResources from "./KVMNumaResources";
import KVMStorage from "./KVMStorage";
import Switch from "app/base/components/Switch";

type RouteParams = {
  id: string;
};

export const fakeNumas = [
  {
    cores: { allocated: 1, free: 2, total: 3 },
    index: 0,
    nics: ["eth0", "eth2"],
    ram: {
      general: {
        allocated: 12,
        free: 12,
        total: 24,
        unit: "GiB",
      },
      hugepage: {
        allocated: 540,
        free: 420,
        pagesize: 4068,
        total: 960,
        unit: "MiB",
      },
    },
    vfs: { allocated: 13, free: 1, total: 14 },
    vms: ["machine1", "machine2", "machine3"],
  },
  {
    cores: { allocated: 200, free: 100, total: 300 },
    index: 1,
    nics: ["eth1", "eth3"],
    ram: {
      general: {
        allocated: 3,
        free: 1,
        total: 4,
        unit: "GiB",
      },
      hugepage: {
        allocated: 1,
        free: 1,
        pagesize: 2048,
        total: 2,
        unit: "GiB",
      },
    },
    vms: ["machine4"],
  },
  {
    cores: { allocated: 5, free: 5, total: 10 },
    index: 2,
    nics: [],
    ram: {
      general: {
        allocated: 5,
        free: 2,
        total: 7,
        unit: "GiB",
      },
    },
    vms: [],
  },
];

const KVMSummary = (): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams<RouteParams>();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const analyticsEnabled = useSelector(configSelectors.analyticsEnabled);
  const [viewByNuma, setViewByNuma] = useStorageState(
    localStorage,
    `viewPod${id}ByNuma`,
    false
  );

  useWindowTitle(`KVM ${`${pod?.name} ` || ""} details`);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  if (!!pod) {
    return (
      <>
        <div className="u-flex">
          <p className="u-nudge-left">
            {pod.type === "virsh" ? "Virsh:" : "LXD URL:"}
          </p>
          <Code copyable className="u-flex--grow">
            {pod.power_address}
          </Code>
        </div>
        <hr className="u-sv1" />
        <div className="u-flex--between">
          <h4 className="u-sv1">Resources</h4>
          <Switch
            checked={viewByNuma}
            className="p-switch--inline-label"
            data-test="numa-switch"
            label="View by NUMA node"
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
              const checked = evt.target.checked;
              setViewByNuma(checked);
              if (analyticsEnabled) {
                sendAnalyticsEvent(
                  "KVM details",
                  "Toggle NUMA view",
                  checked ? "View by NUMA node" : "View aggregate"
                );
              }
            }}
          />
        </div>
        {viewByNuma ? (
          <KVMNumaResources numaNodes={fakeNumas} />
        ) : (
          <KVMAggregateResources id={pod.id} />
        )}
        <KVMStorage id={pod.id} />
      </>
    );
  }
  return <Spinner text="Loading" />;
};

export default KVMSummary;
