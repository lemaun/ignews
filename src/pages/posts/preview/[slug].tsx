import { GetStaticProps, NextApiRequest, PreviewData } from "next"
import { getSession, useSession } from "next-auth/react"
import { createClient } from '../../../services/prismic'
import { RichText } from 'prismic-dom';
import styles from '../post.module.scss'
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface PostPreviewProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

interface StaticProps extends GetStaticProps {
  previewData: PreviewData;
  params: {
      slug: string;
  };
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [post.slug, router, session]) 

  
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div 
            className={`${styles.postContent} ${styles.previewContent}`} 
            dangerouslySetInnerHTML={{__html: post.content}} 
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a href="">Subscribe now 🤙</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking"
  }
}

export const getStaticProps = async ({ previewData, params }: StaticProps) => {
   
  const { slug } = params
  const client = createClient({ previewData })

  const response = await client.getByUID('post', slug)

  const post = {
    slug: response.uid,
    title: response.data.title[0].text,
    content: RichText.asHtml(response.data.content.splice(0,3)),
    updated_at: new Date(response.last_publication_date).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    })
  }

  return {
    props: { post },
    redirect: 60 * 30 //30 minutos
  }

}