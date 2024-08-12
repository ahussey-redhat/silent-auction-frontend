import { Trans } from '@lingui/macro';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Skeleton,
} from '@patternfly/react-core';

export default () => {
  return (
    <DescriptionList isHorizontal>
      <DescriptionListGroup>
        <Skeleton
          shape="square"
          width="30%"
          screenreaderText="Loading auction image"
        />
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>
            <strong>Current highest bid</strong>
          </Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          <strong>
            $<Skeleton screenreaderText="Loading auction bid amount" />
          </strong>
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <Trans>Description</Trans>
        </DescriptionListTerm>
        <DescriptionListDescription>
          <Skeleton screenreaderText="Loading auction description" />
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};
