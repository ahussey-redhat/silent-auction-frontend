import styled from '@modern-js/runtime/styled';
import { ComponentProps } from 'react';
import bannerImgSrc, {
  ReactComponent as BannerImage,
} from './static/banner.svg';

const StyledLogo = styled(BannerImage)`
  flex: none;
`;

export type LogoProps = ComponentProps<typeof StyledLogo>;

export { bannerImgSrc };

export default (props: LogoProps) => <StyledLogo {...props} />;
