// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import JSONCrush from '../../components/JSONCrush/JSONCrush'

export default function decrush(req: NextApiRequest, res: NextApiResponse) {
  // If the request is not a GET request, return a 405 error
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end('Method Not Allowed')
    return
  }
  // If the url has no query, return a 400 error
  if (!req.query) {
    res.status(400).end('Bad Request')
    return
  }

  const { q: query } = req.query as { q: string }
  const uncrushedData = JSONCrush.uncrush(query)
  res.status(200).json(uncrushedData)
}
