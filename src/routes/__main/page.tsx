import { Button, Flex, FlexItem } from '@patternfly/react-core';
import { Trans } from '@lingui/macro';
import { useNavigate } from '@modern-js/runtime/router';
import { useCallback } from 'react';
import { bannerImgSrc } from '@/components';
import './page.css';

export default () => {
  const navigate = useNavigate();
  const goToAuctions = useCallback(() => navigate('/auctions'), [navigate]);

  return (
    <Flex direction={{ default: 'column' }} rowGap={{ default: 'rowGapXl' }}>
      <Flex alignSelf={{ default: 'alignSelfCenter' }}>
        <FlexItem>
          <img className="banner" src={bannerImgSrc} />
        </FlexItem>
      </Flex>
      <Flex alignSelf={{ default: 'alignSelfCenter' }}>
        <FlexItem>
          <Button onClick={goToAuctions}>
            <Trans>Go to Auctions</Trans>
          </Button>
        </FlexItem>
      </Flex>
    </Flex>
  );
};
