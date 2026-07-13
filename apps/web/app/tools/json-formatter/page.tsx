import React from 'react';
import { JsonFormatterTool } from '@/modules/tools/json-formatter/JsonFormatterTool';

export const metadata = {
  title: 'JSON Formatter Tool',
  description: 'Format, validate, and minify your JSON data easily.',
};

export default function Page() {
  return <JsonFormatterTool />;
}
