// src/types.ts
export interface PageProps {
  params: {
    id: string;
    [key: string]: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}
