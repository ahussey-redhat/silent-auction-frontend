import styled from '@modern-js/runtime/styled';
import { ComponentProps } from 'react';
import bannerImgSrc, {
  ReactComponent as BannerImage,
} from './static/banner.svg';

const StyledBanner = styled(BannerImage)`
  flex: none;
`;

export type BannerProps = ComponentProps<typeof StyledBanner>;

export { bannerImgSrc };

export default (props: BannerProps) => <StyledBanner {...props} />;
