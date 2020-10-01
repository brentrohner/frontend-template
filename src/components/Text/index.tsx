import React, { CSSProperties } from 'react';
import classNames from 'classnames';
import styles from './Text.module.scss';
import { Values } from 'src/utils/types';

export const textTypes = Object.freeze({
  t3Dark: ['t3', 'dark'],
});

export type TextType = Values<typeof textTypes>;

export const textTypeToClass = (textType: TextType): string =>
  textType.map((n: string) => styles[n]).join(' ');

export type TextProps = {
  className?: string;
  href?: string;
  maxLength?: number;
  style?: CSSProperties;
  text: string;
  textType: TextType;
};

export default function Text({
  text,
  textType,
  href,
  className,
  maxLength,
  style,
}: TextProps): JSX.Element {
  const classNameList = textTypeToClass(textType);
  const Raw = (): JSX.Element => (
    <span
      className={classNames(styles.Text, classNameList, className)}
      style={style}
    >
      {maxLength !== undefined && text && text.length > maxLength
        ? `${text.slice(0, maxLength)}...`
        : text}
    </span>
  );
  return href ? (
    <a href={href} className={className}>
      <Raw />
    </a>
  ) : (
    <Raw />
  );
}
