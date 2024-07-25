import { Helmet } from '@modern-js/runtime/head';
import imageSrc from './favicon.svg';

export default () => (
  <Helmet>
    <link rel="shortcut icon" type="image/x-icon" href={imageSrc} />
  </Helmet>
);
