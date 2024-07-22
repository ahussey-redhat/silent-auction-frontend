import { Trans, msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Await,
  ShouldRevalidateFunction,
  useLoaderData,
  useLocation,
  useNavigate,
} from '@modern-js/runtime/router';
import {
  Divider,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  EmptyState,
  PageSection,
  Spinner,
  Text,
  TextContent,
} from '@patternfly/react-core';
import {
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAsync, useUpdateEffect } from 'react-use';
import AuctionDataList from './data-list';
import AuctionDetailsPanel from './details-panel';
import AuctionToolbar from './toolbar';
import { DeferredLoaderData, searchParams } from './page.data';
import './page.css';
import { PageTitle } from '@/components';
import { usePathWithParams } from '@/hooks';
import { Auction } from '@/types';

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  defaultShouldRevalidate,
  nextUrl,
}) => {
  if (currentUrl.pathname === nextUrl.pathname) {
    const currentParams = new URLSearchParams(
      searchParams.map(param => [
        param,
        currentUrl.searchParams.get(param) ?? '',
      ]),
    ).toString();
    const nextParams = new URLSearchParams(
      searchParams.map(param => [param, nextUrl.searchParams.get(param) ?? '']),
    ).toString();

    return currentParams !== nextParams;
  } else {
    return defaultShouldRevalidate;
  }
};

export default () => {
  const { _ } = useLingui();
  const location = useLocation();
  const navigate = useNavigate();
  const to = usePathWithParams(location.pathname, [
    'locale',
    'search',
    'status',
    'risk',
    'selectedAuctionId',
  ]);
  const toSearchParams = useMemo(
    () => new URLSearchParams(to.search),
    [to.search],
  );
  const selectedAuctionId = toSearchParams.get('selectedAuctionId') ?? '';
  const data = useLoaderData() as DeferredLoaderData;
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const { value: auctions, loading: loadingAuctions } = useAsync(
    () => data.auctions,
    [data.auctions],
  );
  const selectedAuction = useMemo(
    () => auctions?.find(({ id }) => id === selectedAuctionId),
    [auctions, selectedAuctionId],
  );

  const selectAuction = useCallback(
    (auctionId: string) => {
      if (auctionId) {
        toSearchParams.set('selectedAuctionId', auctionId);
      } else if (toSearchParams.has('selectedAuctionId')) {
        toSearchParams.delete('selectedAuctionId');
      }

      navigate({
        ...to,
        search: toSearchParams.toString(),
      });
    },
    [selectedAuctionId, navigate, to, toSearchParams],
  );

  useEffect(() => {
    if (loadingAuctions) {
      return;
    }

    if (selectedAuction) {
      selectAuction(selectedAuctionId);
    } else {
      selectAuction('');
    }
  }, [loadingAuctions]);

  useUpdateEffect(() => {
    if (selectedAuction) {
      setIsDrawerExpanded(true);
    } else {
      selectAuction('');
      setIsDrawerExpanded(false);
    }
  }, [selectedAuction, setIsDrawerExpanded]);

  const onSelectAuction = useCallback(
    (
      _: ReactMouseEvent<Element, MouseEvent> | KeyboardEvent<Element>,
      auctionId: string,
    ) => {
      if (auctionId !== selectedAuctionId) {
        selectAuction(auctionId);
      }
    },
    [selectedAuctionId, selectAuction],
  );

  const onCloseDrawer = useCallback(
    (_?: ReactMouseEvent<HTMLDivElement>) => {
      if (selectedAuctionId !== '') {
        selectAuction('');
      }
    },
    [selectedAuctionId, selectAuction],
  );

  return (
    <>
      <PageTitle title={_(msg`Auctions`)} />
      <PageSection>
        <TextContent>
          <Text component="h1">
            <Trans>Auctions</Trans>
          </Text>
        </TextContent>
      </PageSection>
      <Divider component="div" />
      <PageSection className="auctions-page">
        <Drawer isExpanded={isDrawerExpanded} isInline>
          <DrawerContent
            panelContent={
              selectedAuction ? (
                <AuctionDetailsPanel
                  auction={selectedAuction}
                  onCloseDrawer={onCloseDrawer}
                />
              ) : null
            }
          >
            <DrawerContentBody>
              <>
                <AuctionToolbar />
                <Suspense
                  fallback={
                    <EmptyState titleText={_(msg`Loading`)} icon={Spinner} />
                  }
                >
                  <Await resolve={data.auctions}>
                    {(auctions: Auction[]) => (
                      <AuctionDataList
                        auctions={auctions}
                        selectedAuctionId={selectedAuctionId}
                        onSelectAuction={onSelectAuction}
                      />
                    )}
                  </Await>
                </Suspense>
              </>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </PageSection>
    </>
  );
};
