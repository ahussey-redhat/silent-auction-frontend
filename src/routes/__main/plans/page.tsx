import { msg, Trans } from '@lingui/macro';
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
  useMemo,
  useState,
} from 'react';
import { useAsync, useEffectOnce, useUpdateEffect } from 'react-use';
import PlanDataList from './data-list';
import PlanDetailsPanel from './details-panel';
import PlanToolbar from './toolbar';
import { DeferredLoaderData, searchParams } from './page.data';
import './page.css';
import { PageTitle, RequireRole } from '@/components';
import { usePathWithParams } from '@/hooks';
import { Plan } from '@/types';

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
  const to = usePathWithParams(location, [
    'locale',
    'search',
    'type',
    'selectedPlanId',
  ]);
  const toSearchParams = useMemo(
    () => new URLSearchParams(to.search),
    [to.search],
  );
  const selectedPlanId = toSearchParams.get('selectedPlanId') ?? '';
  const data = useLoaderData() as DeferredLoaderData;
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const { value: plans } = useAsync(() => data.plans, [data.plans]);
  const selectedPlan = useMemo(
    () => plans?.find(({ id }) => id === selectedPlanId),
    [plans, selectedPlanId],
  );

  const selectPlan = useCallback(
    (planId: string) => {
      if (planId) {
        toSearchParams.set('selectedPlanId', planId);
      } else if (toSearchParams.has('selectedPlanId')) {
        toSearchParams.delete('selectedPlanId');
      }

      navigate({
        ...to,
        search: toSearchParams.toString(),
      });
    },
    [selectedPlanId, navigate, to, toSearchParams],
  );

  useEffectOnce(() => {
    if (selectedPlan) {
      selectPlan(selectedPlanId);
    } else {
      selectPlan('');
    }
  });

  useUpdateEffect(() => {
    if (selectedPlan) {
      setIsDrawerExpanded(true);
    } else {
      selectPlan('');
      setIsDrawerExpanded(false);
    }
  }, [selectedPlan, setIsDrawerExpanded]);

  const onSelectPlan = useCallback(
    (
      _: ReactMouseEvent<Element, MouseEvent> | KeyboardEvent<Element>,
      planId: string,
    ) => {
      if (planId !== selectedPlanId) {
        selectPlan(planId);
      }
    },
    [selectedPlanId, selectPlan],
  );

  const onCloseDrawer = useCallback(
    (_?: ReactMouseEvent<HTMLDivElement>) => {
      if (selectedPlanId !== '') {
        selectPlan('');
      }
    },
    [selectedPlanId, selectPlan],
  );

  return (
    <RequireRole role="admin">
      <>
        <PageTitle title={_(msg`Plans`)} />
        <PageSection>
          <TextContent>
            <Text component="h1">
              <Trans>Plans</Trans>
            </Text>
          </TextContent>
        </PageSection>
        <Divider component="div" />
        <PageSection className="plans-page">
          <Drawer isExpanded={isDrawerExpanded} isInline>
            <DrawerContent
              panelContent={
                selectedPlan ? (
                  <PlanDetailsPanel
                    plan={selectedPlan}
                    onCloseDrawer={onCloseDrawer}
                  />
                ) : null
              }
            >
              <DrawerContentBody>
                <>
                  <PlanToolbar />
                  <Suspense
                    fallback={
                      <EmptyState titleText={_(msg`Loading`)} icon={Spinner} />
                    }
                  >
                    <Await resolve={data.plans}>
                      {(plans: Plan[]) => (
                        <PlanDataList
                          plans={plans}
                          selectedPlanId={selectedPlanId}
                          onSelectPlan={onSelectPlan}
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
    </RequireRole>
  );
};
