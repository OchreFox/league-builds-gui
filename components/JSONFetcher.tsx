export default async function JSONFetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)

  if (!res.ok) {
    let error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    error.message = await res.json()
    throw error
  }
  return res.json()
}
