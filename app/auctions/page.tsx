'use client'

import { useAuctions } from '@app/providers/Auctions';
// import './page.css';

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

import { redirect } from 'next/navigation';

export default function Auctions() {
  const { auctions } = useAuctions();
  return (
    <>

        <PageSection hasBodyWrapper={false}>
            <Content component={ContentVariants.h1}>Auctions</Content>
        </PageSection>
        <PageSection hasBodyWrapper={false} className="auctions-page" isFilled>
          {auctions.length === 0 ? (
            <EmptyState titleText={`No auctions avaiable`} />
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
                    <Grid>
                      <GridItem>
                        <CardHeader
                          selectableActions={{
                            onClickAction: () => redirect(`/auctions/${id}`),
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
