import { TouchableOpacity } from 'react-native';
import styled, { css } from 'styled-components/native';

export type ButtonTypeStyleProps = 'PRIMARY' | 'SECONDARY';

type Props = {
        type: ButtonTypeStyleProps;
}

export const Container = styled(TouchableOpacity) <Props>`
        flex: 1;
        min-height: 56px;
        max-height: 56px;
        background-color: ${({ theme, type }) => type === 'PRIMARY' ? theme.COLORS.GREEN_700 : theme.COLORS.RED_DARK};
        border-radius: 6px;
        justify-content: center;
        align-items: center;
`

export const Title = styled.Text`
        ${({ theme }) => css`
                text-align: center;
                font-size: ${theme.FONT_SIZE.MD}px;
                font-family: ${theme.FONT_FAMILY.BOLD};
                color: ${theme.COLORS.WHITE};
        `};
        
`