import 'styled-components/native';
import theme from '../theme'

declare module 'style-components/native' {
    type ThemeType = typeof theme;
    export interface DefaultTheme extends ThemeType { }
}