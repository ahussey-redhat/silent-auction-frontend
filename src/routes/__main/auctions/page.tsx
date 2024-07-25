import { Trans, msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  EmptyState,
  Gallery,
  Grid,
  GridItem,
  PageSection,
  Spinner,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import displayStyles from '@patternfly/react-styles/css/utilities/Display/display';
import flexStyles from '@patternfly/react-styles/css/utilities/Flex/flex';
import sizingStyles from '@patternfly/react-styles/css/utilities/Sizing/sizing';
import { useEffectOnce } from 'react-use';
import { useModel } from '@modern-js/runtime/model';
import { useNavigate } from '@modern-js/runtime/router';
import { PageTitle } from '@/components';
import auctionModel from '@/models/auction';
import './page.css';

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
        {auctions.length === 0 && loading ? (
          <EmptyState titleText={_(msg`Loading`)} icon={Spinner} />
        ) : (
          <Gallery
            hasGutter
            minWidths={{
              default: '100%',
              xl: '600px',
            }}
          >
            {auctions?.map(({ id, name, description, imageUrl }) => (
              <Card key={id} id={`auction-card-${id}`} isClickable>
                <Grid className={sizingStyles.h_100} md={6}>
                  <GridItem>
                    <CardHeader
                      className={css(
                        'auction-header',
                        displayStyles.displayGrid,
                        flexStyles.alignContentCenter,
                        flexStyles.justifyContentCenter,
                        sizingStyles.h_100,
                      )}
                      selectableActions={{
                        onClickAction: () => navigate(`/auctions/${id}`),
                        selectableActionId: id,
                        selectableActionAriaLabelledby: `auction-card-${id}`,
                        name,
                      }}
                    >
                      <img src={imageUrl.toString()} />
                    </CardHeader>
                  </GridItem>
                  <GridItem>
                    <CardTitle>{name}</CardTitle>
                    <CardBody>{description}</CardBody>
                  </GridItem>
                </Grid>
              </Card>
            ))}
          </Gallery>
        )}
      </PageSection>
    </>
  );
};
