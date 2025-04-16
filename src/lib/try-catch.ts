import { ZodError } from "zod"

export type AsyncHandlerResult<T> = 
  | { success: true, data: T }
  | { success: false, error: string, log?: any }

export async function tryCatch<T>(
  fn: () => Promise<T>,
  opts?: {
    errMessage?: string,
    logCtx?: string
  }
): Promise<AsyncHandlerResult<T>> {
  const logCtx = opts?.logCtx || "Async Operation"
  const defaultErrorMessage = opts?.errMessage || "An unexpected error occurred"

  try {
    const res = await fn()
    return { success: true, data: res  }
  } catch (err: unknown) {
    let message = opts?.errMessage || defaultErrorMessage
    console.error(`[${logCtx} Error: ${err}]`)

    if (err instanceof ZodError) message = `Data not valid ${err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`
    return {
      success: false,
      error: message,
      log: err
    }
  }
}