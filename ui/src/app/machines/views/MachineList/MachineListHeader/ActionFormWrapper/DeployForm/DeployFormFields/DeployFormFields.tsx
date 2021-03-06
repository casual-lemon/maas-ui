import { Col, Notification, Row, Select } from "@canonical/react-components";
import classNames from "classnames";
import React, { useState } from "react";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { DeployFormValues } from "../DeployForm";
import authSelectors from "app/store/auth/selectors";
import configSelectors from "app/store/config/selectors";
import FormikField from "app/base/components/FormikField";
import generalSelectors from "app/store/general/selectors";
import type { RootState } from "app/store/root/types";
import LegacyLink from "app/base/components/LegacyLink";
import UserDataField from "./UserDataField";

export const DeployFormFields = (): JSX.Element => {
  const [userDataVisible, setUserDataVisible] = useState(false);
  const formikProps = useFormikContext<DeployFormValues>();
  const { handleChange, setFieldValue, values } = formikProps;

  const user = useSelector(authSelectors.get);
  const osOptions = useSelector(configSelectors.defaultOSystemOptions);
  const { osystems, releases } = useSelector(generalSelectors.osInfo.get);
  const allReleaseOptions = useSelector(
    generalSelectors.osInfo.getAllOsReleases
  );
  const releaseOptions = allReleaseOptions[values.oSystem] || [];
  const kernelOptions = useSelector((state: RootState) =>
    generalSelectors.osInfo.getUbuntuKernelOptions(state, values.release)
  );
  const canBeKVMHost =
    values.oSystem === "ubuntu" && values.release === "bionic";
  const noImages = osystems.length === 0 || releases.length === 0;

  return (
    <>
      {noImages && (
        <Notification data-test="images-error" type="negative">
          You will not be able to deploy a machine until at least one valid
          image has been downloaded. To download an image, visit the{" "}
          <LegacyLink route="/images">images page</LegacyLink>.
        </Notification>
      )}
      <div className="u-sv2">
        <Row>
          <Col size="3">
            <FormikField
              component={Select}
              disabled={noImages}
              label="OS"
              name="oSystem"
              options={osOptions}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(e);
                const value = e.target.value;
                if (
                  allReleaseOptions[value] &&
                  allReleaseOptions[value].length
                ) {
                  setFieldValue("release", allReleaseOptions[value][0].value);
                }
                if (value !== "ubuntu") {
                  setFieldValue("installKVM", false);
                }
              }}
            />
          </Col>
          <Col size="3">
            <FormikField
              component={Select}
              disabled={noImages}
              label="Release"
              name="release"
              options={releaseOptions}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                handleChange(e);
                if (e.target.value !== "bionic") {
                  setFieldValue("installKVM", false);
                }
              }}
            />
          </Col>
          <Col size="3">
            {values.oSystem === "ubuntu" && (
              <FormikField
                component={Select}
                label="Kernel"
                name="kernel"
                options={kernelOptions}
              />
            )}
          </Col>
        </Row>
        <div className="u-sv2">
          <hr className="u-sv2" />
        </div>
        <Row>
          <Col size="3">
            <p>Customise options</p>
          </Col>
          <Col size="9">
            <FormikField
              disabled={!canBeKVMHost || noImages}
              label={
                <>
                  Register as MAAS KVM host (Ubuntu 18.04 LTS required).{" "}
                  <a
                    className="p-link--external"
                    href="https://maas.io/docs/kvm-introduction"
                  >
                    Read more
                  </a>
                </>
              }
              name="installKVM"
              type="checkbox"
            />
            <FormikField
              disabled={noImages}
              label={
                <>
                  Cloud-init user-data&hellip;{" "}
                  <a
                    className="p-link--external"
                    href="https://maas.io/docs/custom-node-setup-preseed#heading--cloud-init"
                  >
                    Read more
                  </a>
                </>
              }
              name="includeUserData"
              type="checkbox"
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(evt);
                setUserDataVisible(evt.target.checked);
              }}
              wrapperClassName={classNames({
                "u-sv2": userDataVisible,
              })}
            />
            {userDataVisible && <UserDataField />}
          </Col>
        </Row>
        {user.sshkeys_count === 0 && (
          <Row>
            <Col size="12">
              <p className="u-no-max-width" data-test="sshkeys-warning">
                <i className="p-icon--warning is-inline"></i>
                Login will not be possible because no SSH keys have been added
                to your account. To add an SSH key, visit your{" "}
                <Link to="/account/prefs/ssh-keys">account page</Link>.
              </p>
            </Col>
          </Row>
        )}
        <hr className="u-sv1" />
      </div>
    </>
  );
};

export default DeployFormFields;
