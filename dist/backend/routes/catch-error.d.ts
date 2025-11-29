export = catchError;
declare function catchError(
  handler: any,
): (req: any, res: any, next: any) => void;
