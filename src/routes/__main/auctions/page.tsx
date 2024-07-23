import { Trans, msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  EmptyState,
  Gallery,
  PageSection,
  Spinner,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { useAsyncFn, useEffectOnce } from 'react-use';
import { useModel } from '@modern-js/runtime/model';
import './page.css';
import { LocaleLink, PageTitle } from '@/components';
import { Auction } from '@/types';
import authModel from '@/models/auth';

export default () => {
  const { _ } = useLingui();
  const [{ token }, { clearToken, updateToken }] = useModel(authModel);
  const [{ value: auctions, loading: loadingAuctions }, fetchAuctions] =
    useAsyncFn(async () => {
      try {
        await updateToken();
      } catch (error) {
        await clearToken();
        return [];
      }

      const response = await fetch(`${process.env.BACKEND_URL}/auctions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (process.env.NODE_ENV !== 'development' && response.status !== 200) {
        throw response;
      }

      return (await response.json()) as Auction[];
    }, [token, updateToken]);

  useEffectOnce(() => {
    fetchAuctions();
  });

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
      <PageSection className="auctions-page" isFilled>
        {loadingAuctions ? (
          <EmptyState titleText={_(msg`Loading`)} icon={Spinner} />
        ) : (
          <Gallery>
            {auctions?.map(({ id, item_name, description, image_path }) => (
              <Card key={id} id={id.toString()} isCompact>
                <CardHeader>
                  <img src={image_path} />
                </CardHeader>
                <CardTitle>
                  <LocaleLink prefetch="intent" to={`/auctions/${id}`}>
                    {item_name}
                  </LocaleLink>
                </CardTitle>
                <CardBody>{description}</CardBody>
              </Card>
            ))}
          </Gallery>
        )}
      </PageSection>
    </>
  );
};
