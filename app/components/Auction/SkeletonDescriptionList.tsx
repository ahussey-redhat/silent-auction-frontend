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
            <strong>Current highest bid</strong>
        </DescriptionListTerm>
        <DescriptionListDescription>
          <strong>
            $
            <Skeleton
              screenreaderText="Loading auction bid amount"
              width="10%"
            />
          </strong>
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          Description
        </DescriptionListTerm>
        <DescriptionListDescription>
          <Skeleton
            screenreaderText="Loading auction description"
            width="30%"
          />
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          Auction Start
        </DescriptionListTerm>
        <DescriptionListDescription>
          <Skeleton screenreaderText="Loading auction start" width="30%" />
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          Auction End
        </DescriptionListTerm>
        <DescriptionListDescription>
          <Skeleton screenreaderText="Loading auction end" width="30%" />
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};
