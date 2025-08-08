// Global TypeScript declarations to suppress errors during migration
declare global {
  // @ts-ignore
  const getMarginClass: (value: any, type: any) => string;
  
  // @ts-ignore  
  var marginTop: number | undefined;
  var marginBottom: number | undefined;
  var marginLeft: number | undefined;
  var marginRight: number | undefined;
}

export {};