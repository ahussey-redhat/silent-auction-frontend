'use client'

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Content,
  ContentVariants,
  EmptyState,
  Gallery,
  Grid,
  GridItem,
  PageSection,
  Spinner,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import displayStyles from '@patternfly/react-styles/css/utilities/Display/display';
import flexStyles from '@patternfly/react-styles/css/utilities/Flex/flex';
import sizingStyles from '@patternfly/react-styles/css/utilities/Sizing/sizing';
import { useEffectOnce } from 'react-use';
import auctionModel from '@app/models/auction';
import './page.css';

export default function Auctions() {
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
      <PageSection hasBodyWrapper={false}>
          <Content component={ContentVariants.h1}>Auctions</Content>
      </PageSection>
      <PageSection hasBodyWrapper={false} className="auctions-page" isFilled>
        {auctions.length === 0 && loading ? (
          <EmptyState titleText={`Loading`} icon={Spinner} />
        ) : (
          <Gallery
            hasGutter
            minWidths={{
              default: '100%',
              xl: '600px',
            }}
          >
            {auctions?.map(
              ({
                id,
                name,
                description,
                startingBid,
                start,
                end,
                imageUrl,
              }) => (
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
                        <img src={imageUrl.toString()} alt={description} />
                      </CardHeader>
                    </GridItem>
                    <GridItem>
                      {/* TODO refactor to use ServiceCard component */}
                      <CardTitle>{name}</CardTitle>
                      <CardBody>
                        {description}
                        <br />
                        <br />
                        <strong>Starting Bid:</strong> ${startingBid}
                        <br />
                        <br />
                        <strong>Auction Opens:</strong> {String(start)}
                        <br />
                        <strong>Auction Closes:</strong> {String(end)}
                      </CardBody>
                    </GridItem>
                  </Grid>
                </Card>
              ),
            )}
          </Gallery>
        )}
      </PageSection>
    </>
  );
};
