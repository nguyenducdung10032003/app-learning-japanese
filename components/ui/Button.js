import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Button({ variant = 'default', size = 'md', children, ...props }) {
  const buttonStyles = [
    styles.base,
    variant === 'default' ? styles.default : styles.ghost,
    size === 'sm' ? styles.sm : styles.md
  ];

  return (
    <TouchableOpacity style={buttonStyles} {...props}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  default: {
    backgroundColor: '#000000',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  md: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});