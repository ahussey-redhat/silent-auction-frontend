'use client'
import { Button, Content, ContentVariants } from '@patternfly/react-core';
import ErrorState from '@patternfly/react-component-groups/dist/dynamic/ErrorState';
import UnavailableContent from '@patternfly/react-component-groups/dist/dynamic/UnavailableContent';

export default () => {
  return 'message' in error ? (
    <ErrorState
      titleText={error.message}
      bodyText={error.stack}
      customFooter={
        <Button onClick={() => navigate(location)}>
          <Content component={ContentVariants.p}>Refresh</Content>
        </Button>
      }
    />
  ) : (
    <UnavailableContent />
  );
};
