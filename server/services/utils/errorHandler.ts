export const functionErrorCatcher = <T>(functionToErrorHandle:()=>T,errorMsg?:string):T=>{
    try {
        return functionToErrorHandle();
    } catch (error:any) {
        console.error(errorMsg ?? error);
        return error;
    }
}

export const asyncFunctionErrorCatcher = <T>(
    asyncFunctionToErrorHandle: () => Promise<T>,
    errorMsg?: string
  ): Promise<T> => {
    return asyncFunctionToErrorHandle().catch((error: Error) => {
      throw new Error(errorMsg || error.message);
    });
  };


