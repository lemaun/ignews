import { render, screen } from '@testing-library/react'
import { getServers } from 'dns';
import { getSession } from 'next-auth/react';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { createClient } from "../../services/prismic";

jest.mock('../../services/prismic')

jest.mock('next-auth/react')

const post = { 
    slug: 'fake-slug',
    title: 'Fake title 1',
    content: 'Fake content 1',
    updatedAt: '2022-01-01',
  }


describe('Post Page', () => {
  it('render correctly', () => {
    render(<Post post={post} /> )

    expect(screen.getByText("Fake title 1")).toBeInTheDocument()
    expect(screen.getByText("Fake content 1")).toBeInTheDocument()
  })

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = jest.mocked(getSession)

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({params: {slug: 'fake-slug'}} as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        })
      })
    )
  })

  it('loads initial data', async () => {
    const getSessionMocked = jest.mocked(getSession)

    const getPrismicClientMocked = jest.mocked(createClient);

    getPrismicClientMocked.mockReturnValueOnce({
        getByUID: jest.fn().mockResolvedValueOnce({
          data: {
              title: [{type: 'heading', text:'Fake title 1'}],
              content: [{type: 'paragraph', text: 'Fake excerpt 1'}],
          },
          last_publication_date: '2022-01-02',
        })
    } as any);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

    const response = await getServerSideProps({
       params: { slug: 'fake-slug'}
    } as any)


    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: 
              {
                slug: 'fake-slug',
                title: 'Fake title 1',
                content: '<p>Fake excerpt 1</p>',
                updated_at: '01 de janeiro de 2022',
              }
        }
      })
    )

  })

})