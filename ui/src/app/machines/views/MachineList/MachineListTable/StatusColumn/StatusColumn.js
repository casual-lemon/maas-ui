import { Spinner, Tooltip } from "@canonical/react-components";
import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import { generateLegacyURL, navigateToLegacy } from "@maas-ui/maas-ui-shared";
import { getStatusText } from "app/utils";
import { nodeStatus, scriptStatus } from "app/base/enum";
import { useMachineActions } from "app/base/hooks";
import { useToggleMenu } from "app/machines/hooks";
import DoubleRow from "app/base/components/DoubleRow";
import generalSelectors from "app/store/general/selectors";
import machineSelectors from "app/store/machine/selectors";

// Node statuses for which the failed test warning is not shown.
const hideFailedTestWarningStatuses = [
  nodeStatus.COMMISSIONING,
  nodeStatus.FAILED_COMMISSIONING,
  nodeStatus.FAILED_TESTING,
  nodeStatus.NEW,
  nodeStatus.TESTING,
];

// Node statuses that are temporary.
const transientStatuses = [
  nodeStatus.COMMISSIONING,
  nodeStatus.DEPLOYING,
  nodeStatus.DISK_ERASING,
  nodeStatus.ENTERING_RESCUE_MODE,
  nodeStatus.EXITING_RESCUE_MODE,
  nodeStatus.RELEASING,
  nodeStatus.TESTING,
];

// Script statuses associated with failure.
const failedScriptStatuses = [
  scriptStatus.DEGRADED,
  scriptStatus.FAILED,
  scriptStatus.FAILED_APPLYING_NETCONF,
  scriptStatus.FAILED_INSTALLING,
  scriptStatus.TIMEDOUT,
];

const getProgressText = (machine) => {
  if (transientStatuses.includes(machine.status_code)) {
    return machine.status_message;
  }
  return "";
};

const getStatusIcon = (machine) => {
  if (transientStatuses.includes(machine.status_code)) {
    return (
      <Spinner
        className="u-no-margin u-no-padding"
        data-test="status-icon"
        inline
      />
    );
  } else if (
    failedScriptStatuses.includes(machine.testing_status.status) &&
    !hideFailedTestWarningStatuses.includes(machine.status_code)
  ) {
    return (
      <Tooltip
        message="Machine has failed tests; use with caution."
        position="top-left"
      >
        <i className="p-icon--warning" data-test="status-icon" />
      </Tooltip>
    );
  }
  return "";
};

export const StatusColumn = ({ onToggleMenu, systemId }) => {
  const machine = useSelector((state) =>
    machineSelectors.getById(state, systemId)
  );
  const osReleases = useSelector((state) =>
    generalSelectors.osInfo.getOsReleases(state, machine.osystem)
  );
  const toggleMenu = useToggleMenu(onToggleMenu, systemId);

  const actionLinks = useMachineActions(systemId, [
    "abort",
    "acquire",
    "commission",
    "deploy",
    "exit-rescue-mode",
    "lock",
    "mark-broken",
    "mark-fixed",
    "override-failed-testing",
    "release",
    "rescue-mode",
    "test",
    "unlock",
  ]);

  const menuLinks = [
    actionLinks,
    [
      {
        children: "See logs",
        element: "a",
        href: generateLegacyURL(`/machine/${systemId}?area=logs`),
        onClick: (evt) => {
          navigateToLegacy(`/machine/${systemId}?area=logs`, evt);
        },
      },
      {
        children: "See events",
        element: "a",
        href: generateLegacyURL(`/machine/${systemId}?area=events`),
        onClick: (evt) => {
          navigateToLegacy(`/machine/${systemId}?area=events`, evt);
        },
      },
    ],
  ];

  return (
    <DoubleRow
      icon={getStatusIcon(machine)}
      iconSpace={true}
      menuLinks={onToggleMenu && menuLinks}
      menuTitle="Take action:"
      onToggleMenu={toggleMenu}
      primary={
        <span
          data-test="status-text"
          title={getStatusText(machine, osReleases)}
        >
          {getStatusText(machine, osReleases)}
        </span>
      }
      secondary={
        <span data-test="progress-text" title={getProgressText(machine)}>
          {getProgressText(machine)}
        </span>
      }
    />
  );
};

StatusColumn.propTypes = {
  onToggleMenu: PropTypes.func,
  systemId: PropTypes.string.isRequired,
};

export default React.memo(StatusColumn);
