export interface FileInfo {
   filename: string;
   input: string;
   output: string;
   isFormatted: boolean;
}

export interface CodeQualityReport {
  type: 'issue',
  // eslint-disable-next-line camelcase
  check_name:string;
      description: string;
      severity: string,
      fingerprint: string;
      location: {
        path: string,
        lines: {
          begin: number,
          end:number,
        },
      },
}
