import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'

import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss'

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {
  posts : Post[]
}


export default function Posts({ posts }: PostsProps ) {
  return(
    <>
      <Head>
        <title>Posts | ignews </title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts} >
        {posts.map(post => (
          // eslint-disable-next-line react/jsx-key
          <Link  key={post.slug}  href={`/posts/${post.slug}`} >
          <a>
            <time>{post.updatedAt}</time>
            <strong>{post.title}</strong>
            <p>{post.excerpt}</p>
          </a>
          </Link>
        )) }
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query<any>([
    Prismic.predicates.at('document.type', 'publication')
  ], {
    fetch: ['publication.title', 'publication.content'],
    pageSize: 100,
  })

  /**Sempre que for dar um log em um objeto ou array que tenha um conteu interno(cascata) JSON.Stringify passo o objeto  null como segundo parametro e 2(indica qual vai sera indentação) */
  // console.log(JSON.stringify(response, null, 2))
  

  const posts = response.results.map(post => {
    return{
        slug: post.uid,
        title: RichText.asText(post.data.title),
        excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
        updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR',{
            day:'2-digit',
            month:'long',
            year:'numeric'
        })
    }
})

  return {
    props: {posts}
  }
}


