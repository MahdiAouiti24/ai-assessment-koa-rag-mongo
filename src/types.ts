export type DBQueryCriteria = Record<string, any>;

export interface AskRequestBody {
  query: string;
}

export interface ToolCallResult {
  name: 'retrieveDocumentContext' | 'queryDatabase';
  arguments: any;
  result: any;
}
