import {
  BaseTheme,
  Gutter,
  getSafeGutter,
  useTheme,
} from "@bedrock-layout/spacing-constants";
import { forwardRefWithAs } from "@bedrock-layout/type-utils";
import React, { CSSProperties } from "react";

/**
 * The `padding` prop can also take an object to specify which
 * locations will have padding and of which type. You can pass either
 * traditional properties like `top, bottom, right, left`, or logical
 * properties in camelCase such as `blockStart, blockEnd, inlineStart,
 * inlineEnd`. No matter which properties are given, logical properties
 * are used.
 */
export type PaddingObj =
  | { left: Gutter }
  | { right: Gutter }
  | { top: Gutter }
  | { bottom: Gutter }
  | { inlineStart: Gutter }
  | { inlineEnd: Gutter }
  | { blockStart: Gutter }
  | { blockEnd: Gutter };

/**
 * `padding` can take an array that follows the
 * [padding short hand rules](https://developer.mozilla.org/en-US/docs/Web/CSS/padding).
 */
export type PaddingArray =
  | [Gutter]
  | [Gutter, Gutter]
  | [Gutter, Gutter, Gutter]
  | [Gutter, Gutter, Gutter, Gutter];

/**
 * Padding values can either be any valid Gutter value, a positive `number`
 * indicating the number of pixels, or a valid `CSSLength`. If you provided
 * an invalid value (such as a negative number), the padding will be set to `0px`.
 */
export type PaddingTypes = Gutter | PaddingObj | PaddingArray;

function keyToProperty(key: string) {
  type map = { [s: string]: string };
  const modernMap: map = {
    left: `padding-inline-start`,
    right: `padding-inline-end`,
    top: `padding-block-start`,
    bottom: `padding-block-end`,
    inlineStart: `padding-inline-start`,
    inlineEnd: `padding-inline-end`,
    blockStart: `padding-block-start`,
    blockEnd: `padding-block-end`,
  };

  return modernMap[key];
}

const paddingToStyleProps = (
  theme: Readonly<{ space?: BaseTheme }>,
  padding: Readonly<PaddingTypes>,
) => {
  return typeof padding === "object" && !Array.isArray(padding)
    ? Object.entries(padding).reduce(
        (acc, [key, val]) => ({
          ...acc,
          [keyToProperty(key)]: getSafeGutter(theme, val) ?? "0px",
        }),
        {},
      )
    : {
        padding: Array.from(Array.isArray(padding) ? padding : [padding])
          .slice(0, 4)
          .map((pad: Gutter) => getSafeGutter(theme, pad) ?? "0px")
          .join(" "),
      };
};

export interface PadBoxProps {
  padding?: PaddingTypes;
}

/**
 * he `PadBox` component is designed to create consistent padding based on
 * the spacing constants. PadBox takes either a single value, an array of
 * values (like the css shorthand for top / right / bottom / left), or an
 * object of values (specifying each side individually) for fine tuning the
 * padding.
 */
export const PadBox = forwardRefWithAs<"div", PadBoxProps>(function PadBox(
  { as, style, padding, ...props },
  ref,
) {
  const theme = useTheme();
  const safeStyle = style ?? {};

  const Component = as ?? "div";
  const paddingStyles = paddingToStyleProps(theme, padding ?? "size00");

  return (
    <Component
      data-bedrock-padbox
      {...props}
      ref={ref}
      style={{ ...safeStyle, ...paddingStyles } as CSSProperties}
    />
  );
});
