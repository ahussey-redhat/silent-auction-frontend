import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Content,
  ContentVariants,
  Gallery,
  Grid,
  GridItem,
  PageSection,
  Skeleton,
} from '@patternfly/react-core';
import sizingStyles from '@patternfly/react-styles/css/utilities/Sizing/sizing';
import { css } from '@patternfly/react-styles';
import displayStyles from '@patternfly/react-styles/css/utilities/Display/display';
import flexStyles from '@patternfly/react-styles/css/utilities/Flex/flex';

export default () => (
  <>
    <PageSection hasBodyWrapper={false}>
      <Content component={ContentVariants.h1}>
        <Content component={ContentVariants.h1}>Auctions</Content>
      </Content>
    </PageSection>
    <PageSection hasBodyWrapper={false} className="auctions-page" isFilled>
      <Gallery
        hasGutter
        minWidths={{
          default: '100%',
          xl: '600px',
        }}
      >
        <Card key="loading" id="auction-card-loading" isClickable={false}>
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
              >
                <Skeleton
                  shape="square"
                  width="30%"
                  screenreaderText="Loading auction image"
                />
              </CardHeader>
            </GridItem>
            <GridItem>
              <CardTitle>
                <Skeleton screenreaderText="Loading auction title" />
              </CardTitle>
              <CardBody>
                <Skeleton screenreaderText="loading description" />
                Starting Bid:{' '}
                <Skeleton screenreaderText="loading starting bid" />
              </CardBody>
            </GridItem>
          </Grid>
        </Card>
      </Gallery>
    </PageSection>
  </>
);
