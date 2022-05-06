import * as prismic from '@prismicio/client'
import { enableAutoPreviews } from '@prismicio/next'
import { NextApiRequest, PreviewData } from 'next';

interface PrismicContext {
  req?: NextApiRequest;
  previewData: PreviewData;
}

interface PrismicResolver {
  [key: string]: any;
}

export const endpoint = prismic.getEndpoint(process.env.PRISMIC_REPONAME)
export const repositoryName = prismic.getRepositoryName(endpoint)

export function linkResolver(doc: PrismicResolver) {
  switch (doc.type) {
    case 'post':
      return `/${doc.uid}`
    default:
      return null
  }
}

export function createClient(config: PrismicContext) {
  const client = prismic.createClient(
    endpoint, 
    {
    ...config,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    }
  )

  enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  })

  return client
}

