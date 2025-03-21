import { Trans } from '@lingui/macro';
import {
  useLocation,
  useNavigate,
  useRouteError,
} from '@modern-js/runtime/router';
import { Button } from '@patternfly/react-core';
import ErrorState from '@patternfly/react-component-groups/dist/dynamic/ErrorState';
import UnavailableContent from '@patternfly/react-component-groups/dist/dynamic/UnavailableContent';

export default () => {
  const location = useLocation();
  const navigate = useNavigate();
  const error = useRouteError() as Error | Response;

  return 'message' in error ? (
    <ErrorState
      titleText={error.message}
      bodyText={error.stack}
      customFooter={
        <Button onClick={() => navigate(location)}>
          <Trans>Refresh</Trans>
        </Button>
      }
    />
  ) : (
    <UnavailableContent />
  );
};
