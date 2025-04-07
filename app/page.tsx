'use client'

import { Button, Content, ContentVariants, Flex, FlexItem } from '@patternfly/react-core';
import Link from 'next/link';
import Image from 'next/image';

export default function Home(){
  return (
    <Flex direction={{ default: 'column' }} rowGap={{ default: 'rowGapXl' }}>
      <Flex alignSelf={{ default: 'alignSelfCenter' }}>
        <FlexItem>
          <Image className="banner" src="/banner.svg" alt="banner" width={1000} height={200} />
        </FlexItem>
      </Flex>
      <Flex alignSelf={{ default: 'alignSelfCenter' }}>
        <FlexItem>
          <Button variant="primary" ouiaId="GoToAuctions">
            <Link href="/auctions">
              <Content component={ContentVariants.p}>Go to Auctions</Content>
            </Link>
          </Button>
        </FlexItem>
      </Flex>
    </Flex>
  );
};
