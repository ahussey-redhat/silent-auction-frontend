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
import { useEffectOnce } from 'react-use';
import { useModel } from '@modern-js/runtime/model';
import './page.css';
import { useNavigate } from '@modern-js/runtime/router';
import { PageTitle } from '@/components';
import auctionModel from '@/models/auction';

export default () => {
  const { _ } = useLingui();
  const navigate = useNavigate();
  const [
    {
      auctions: { value: auctions, loading },
    },
    { getAuctions },
  ] = useModel(auctionModel);

  useEffectOnce(() => {
    getAuctions();
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
        {loading ? (
          <EmptyState titleText={_(msg`Loading`)} icon={Spinner} />
        ) : (
          <Gallery hasGutter>
            {auctions?.map(({ id, item_name, description, image_path }) => (
              <Card key={id} id={`auction-card-${id}`} isCompact isClickable>
                <CardHeader
                  selectableActions={{
                    onClickAction: () => navigate(`/auctions/${id}`),
                    selectableActionId: id.toString(),
                    selectableActionAriaLabelledby: `auction-card-${id}`,
                    name: item_name,
                  }}
                >
                  <img src={image_path} />
                </CardHeader>
                <CardTitle>{item_name}</CardTitle>
                <CardBody>{description}</CardBody>
              </Card>
            ))}
          </Gallery>
        )}
      </PageSection>
    </>
  );
};
