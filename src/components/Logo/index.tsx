import styled from '@modern-js/runtime/styled';
import { ComponentProps } from 'react';
import logoImgSrc, { ReactComponent as Logo } from './static/logo.svg';

const StyledLogo = styled(Logo)`
  flex: none;
`;

export type LogoProps = ComponentProps<typeof StyledLogo>;

export { logoImgSrc };

export default (props: LogoProps) => <StyledLogo {...props} />;
