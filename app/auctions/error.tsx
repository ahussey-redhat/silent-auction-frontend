'use client'

import { Button, Content, ContentVariants } from '@patternfly/react-core';
import ErrorState from '@patternfly/react-component-groups/dist/dynamic/ErrorState';
import UnavailableContent from '@patternfly/react-component-groups/dist/dynamic/UnavailableContent';
import { redirect } from 'next/navigation';

export default function  Error({
   error,
   reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return 'message' in error ? (
    <ErrorState
      titleText={error.message}
      bodyText={error.stack}
      customFooter={
        <Button onClick={() => redirect('/auctions')}>
          <Content component={ContentVariants.p}>Refresh</Content>
        </Button>
      }
    />
  ) : (
    <UnavailableContent />
  );
};
