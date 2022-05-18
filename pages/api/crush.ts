// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Ajv, { JSONSchemaType } from 'ajv'
import JSONCrush from '../../components/JSONCrush/JSONCrush.js'
// Import build schema
import schema from '../../types/build.schema.json'

export default function crush(req: NextApiRequest, res: NextApiResponse) {
  // If the request is not a POST request, return a 405 error
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({
      message: 'Method Not Allowed',
    })
    return
  }
  // Get JSON data from the request body
  const data = req.body
  const ajv = new Ajv().addSchema(schema, 'build')
  const validate = ajv.compile(schema)
  const valid = validate(data)
  if (!valid) {
    res.status(400).json({
      message: 'Invalid JSON',
      errors: validate.errors,
    })
    console.log(validate.errors)
    return
  }

  // Return the crushed JSON object
  const crushedData = JSONCrush.crush(JSON.stringify(data))
  console.log(crushedData)
  res.status(200).json({ response: crushedData })
}
