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
import MemberDataList from './data-list';
import MemberDetailsPanel from './details-panel';
import MemberToolbar from './toolbar';
import { DeferredLoaderData, searchParams } from './page.data';
import './page.css';
import { PageTitle } from '@/components';
import { usePathWithParams } from '@/hooks';
import { Member } from '@/types';

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
    'selectedMemberId',
  ]);
  const toSearchParams = useMemo(
    () => new URLSearchParams(to.search),
    [to.search],
  );
  const selectedMemberId = toSearchParams.get('selectedMemberId') ?? '';
  const data = useLoaderData() as DeferredLoaderData;
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const { value: members, loading: loadingMembers } = useAsync(
    () => data.members,
    [data.members],
  );
  const selectedMember = useMemo(
    () => members?.find(({ id }) => id === selectedMemberId),
    [members, selectedMemberId],
  );

  const selectMember = useCallback(
    (memberId: string) => {
      if (memberId) {
        toSearchParams.set('selectedMemberId', memberId);
      } else if (toSearchParams.has('selectedMemberId')) {
        toSearchParams.delete('selectedMemberId');
      }

      navigate({
        ...to,
        search: toSearchParams.toString(),
      });
    },
    [selectedMemberId, navigate, to, toSearchParams],
  );

  useEffect(() => {
    if (loadingMembers) {
      return;
    }

    if (selectedMember) {
      selectMember(selectedMemberId);
    } else {
      selectMember('');
    }
  }, [loadingMembers]);

  useUpdateEffect(() => {
    if (selectedMember) {
      setIsDrawerExpanded(true);
    } else {
      selectMember('');
      setIsDrawerExpanded(false);
    }
  }, [selectedMember, setIsDrawerExpanded]);

  const onSelectMember = useCallback(
    (
      _: ReactMouseEvent<Element, MouseEvent> | KeyboardEvent<Element>,
      memberId: string,
    ) => {
      if (memberId !== selectedMemberId) {
        selectMember(memberId);
      }
    },
    [selectedMemberId, selectMember],
  );

  const onCloseDrawer = useCallback(
    (_?: ReactMouseEvent<HTMLDivElement>) => {
      if (selectedMemberId !== '') {
        selectMember('');
      }
    },
    [selectedMemberId, selectMember],
  );

  return (
    <>
      <PageTitle title={_(msg`Members`)} />
      <PageSection>
        <TextContent>
          <Text component="h1">
            <Trans>Members</Trans>
          </Text>
        </TextContent>
      </PageSection>
      <Divider component="div" />
      <PageSection className="members-page">
        <Drawer isExpanded={isDrawerExpanded} isInline>
          <DrawerContent
            panelContent={
              selectedMember ? (
                <MemberDetailsPanel
                  member={selectedMember}
                  onCloseDrawer={onCloseDrawer}
                />
              ) : null
            }
          >
            <DrawerContentBody>
              <>
                <MemberToolbar />
                <Suspense
                  fallback={
                    <EmptyState titleText={_(msg`Loading`)} icon={Spinner} />
                  }
                >
                  <Await resolve={data.members}>
                    {(members: Member[]) => (
                      <MemberDataList
                        members={members}
                        selectedMemberId={selectedMemberId}
                        onSelectMember={onSelectMember}
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
