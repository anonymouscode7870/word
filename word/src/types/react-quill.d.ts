declare module 'react-quill' {
  import * as React from 'react';
  import { ForwardRefExoticComponent, RefAttributes } from 'react';

  interface QuillProps {
    value?: string;
    defaultValue?: string;
    onChange?: (content: string, delta: any, source: string, editor: any) => void;
    theme?: 'snow' | 'bubble' | 'core';
    modules?: any;
    formats?: string[];
    placeholder?: string;
    readOnly?: boolean;
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
    style?: React.CSSProperties;
    className?: string;
  }

  const ReactQuill: ForwardRefExoticComponent<QuillProps & RefAttributes<any>>;
  export default ReactQuill;
}
