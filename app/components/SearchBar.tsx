import * as React from 'react';
import { StyleSheet, TextInput, I18nManager, GestureResponderEvent } from 'react-native';
import color from 'color';
import { Surface, IconButton, withTheme, TextInputProps, IconSource, Theme, } from 'react-native-paper';

interface Props extends TextInputProps {
    onIconPress?: (event: GestureResponderEvent) => void
    placeholderTextColor: string
    icon: IconSource
    rightIcon: IconSource
    inputStyle?: any
    textColor: string
    theme: Theme
}

class Searchbar extends React.Component<Props> {
    _handleClearPress = () => {
        this.clear();
        this.props.onChangeText && this.props.onChangeText('');
    };

    _root: TextInput | null = null;



    /**
     * Returns `true` if the input is currently focused, `false` otherwise.
     */
    isFocused() {
        return this._root && this._root.isFocused();
    }

    /**
     * Removes all text from the TextInput.
     */
    clear() {
        return this._root && this._root.clear();
    }

    /**
     * Focuses the input.
     */
    focus() {
        return this._root && this._root.focus();
    }

    /**
     * Removes focus from the input.
     */
    blur() {
        return this._root && this._root.blur();
    }

    render() {
        const {
            placeholder,
            onIconPress,
            icon,
            value,
            theme,
            style,
            rightIcon,
            ...rest
        } = this.props;
        const { colors, roundness, dark, fonts } = theme;
        const textColor = this.props.textColor || colors.text;
        const fontFamily = fonts.regular;
        const iconColor = dark
            ? textColor
            : color(textColor)
                .alpha(0.54)
                .rgb()
                .string();
        const rippleColor = color(textColor)
            .alpha(0.32)
            .rgb()
            .string();

        return (
            <Surface
                style={[
                    { borderRadius: roundness, elevation: 4 },
                    styles.container,
                    style,
                ]}
            >
                <IconButton
                    borderless
                    rippleColor={rippleColor}
                    onPress={onIconPress}
                    color={iconColor}
                    icon={icon || 'search'}
                />
                <TextInput
                    style={[{ color: textColor, fontFamily }, styles.input]}
                    placeholder={placeholder || ''}
                    placeholderTextColor={colors.placeholder}
                    selectionColor={colors.primary}
                    underlineColorAndroid="transparent"
                    returnKeyType="search"
                    keyboardAppearance={dark ? 'dark' : 'light'}
                    accessibilityTraits="search"
                    accessibilityRole="search"
                    ref={c => {
                        this._root = c;
                        c && c.focus(); //add autoFocus
                    }}
                    value={value}
                    {...rest}
                />
                {value ? (
                    <IconButton
                        borderless
                        color={iconColor}
                        rippleColor={rippleColor}
                        onPress={this._handleClearPress}
                        icon={rightIcon || "close"}
                        accessibilityTraits="button"
                        accessibilityComponentType="button"
                        accessibilityRole="button"
                    />
                ) : null}
            </Surface>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 18,
        paddingLeft: 8,
        alignSelf: 'stretch',
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
});

export default withTheme(Searchbar);
