import { Fragment, type ReactNode } from 'react';
/** Renders `*emphasis*` markers inside a translated sentence, so translators keep whole sentences. */
export function rich(s: string, wrap: (inner: string, i: number) => ReactNode = (x, i) => <em key={i}>{x}</em>): ReactNode {
  return s.split('*').map((part, i) => (i % 2 ? wrap(part, i) : <Fragment key={i}>{part}</Fragment>));
}
