import { Trans, msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useLocation, useNavigate } from '@modern-js/runtime/router';
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
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAsyncFn, useEffectOnce, useUpdateEffect } from 'react-use';
import { useModel } from '@modern-js/runtime/model';
import AuctionDataList from './data-list';
import AuctionDetailsPanel from './details-panel';
import AuctionToolbar from './toolbar';
import './page.css';
import { PageTitle } from '@/components';
import { usePathWithParams } from '@/hooks';
import { Auction } from '@/types';
import authModel from '@/models/auth';

export default () => {
  const { _ } = useLingui();
  const [{ token }] = useModel(authModel);
  const location = useLocation();
  const navigate = useNavigate();
  const to = usePathWithParams(location, [
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
  const [{ value: auctions, loading: loadingAuctions }, fetchAuctions] =
    useAsyncFn(async () => {
      const response = await fetch(`${process.env.BACKEND_URL}/auctions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (process.env.NODE_ENV !== 'development' && response.status !== 200) {
        throw response;
      }

      return (await response.json()) as Auction[];
    }, [token]);
  useEffectOnce(() => {
    fetchAuctions();
  });
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
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
                {loadingAuctions ? (
                  <EmptyState titleText={_(msg`Loading`)} icon={Spinner} />
                ) : (
                  <AuctionDataList
                    auctions={auctions ?? []}
                    selectedAuctionId={selectedAuctionId}
                    onSelectAuction={onSelectAuction}
                  />
                )}
              </>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </PageSection>
    </>
  );
};
