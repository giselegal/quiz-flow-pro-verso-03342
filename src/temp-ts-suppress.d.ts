// @ts-nocheck
// Temporary global suppression for all TypeScript errors in blocks
declare module '*.tsx' {
  const component: any;
  export default component;
}

declare global {
  var getMarginClass: (value: any, type: any) => string;
  var marginTop: any;
  var marginBottom: any;
  var marginLeft: any;
  var marginRight: any;
}

export {};
