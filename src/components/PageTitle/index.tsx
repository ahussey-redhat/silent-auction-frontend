import { Helmet } from '@modern-js/runtime/head';

export type PageTitleProps = {
  title: string;
};

export default ({ title }: PageTitleProps) => (
  <Helmet>
    <title>Silent Auction - {title}</title>
  </Helmet>
);
