export type TErrorSources = {
    path: string | number;
    message: string;
  }[];
  
  export type TGeneticErrorResponse = {
    statusCode: number;
    message: string;
    errorSources: TErrorSources;
  };
  