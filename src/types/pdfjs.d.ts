declare module "pdfjs-dist" {
  export const version: string;
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };

  export interface TextItem {
    str: string;
    dir: string;
    transform: number[];
    width: number;
    height: number;
    fontName: string;
    hasEOL: boolean;
  }

  export interface TextMarkedContent {
    id: string;
    type: string;
    items: TextContentItem[];
  }

  export type TextContentItem = TextItem | TextMarkedContent;

  export function getDocument(params: { data: ArrayBuffer } | string): {
    promise: Promise<{
      numPages: number;
      getPage(pageNumber: number): Promise<{
        getTextContent(): Promise<{
          items: TextContentItem[];
        }>;
      }>;
    }>;
  };
}
