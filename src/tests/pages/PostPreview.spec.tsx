import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { createClient } from "../../services/prismic";
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';


jest.mock('next-auth/react')
jest.mock('next/router')
jest.mock('../../services/prismic')


const post = { 
    slug: 'fake-slug',
    title: 'Fake title 1',
    content: 'Fake content 1',
    updatedAt: '2022-01-01',
  }


describe('Post preview Page', () => {
  it('render correctly', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({data: null, status: "loading"})

    render(<PostPreview post={post} /> )

    expect(screen.getByText("Fake title 1")).toBeInTheDocument()
    expect(screen.getByText("Fake content 1")).toBeInTheDocument()
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument()
  })

  it("redirects user to full post when user is subscribed", async () => {
    const useSessionMocked = jest.mocked(useSession);
    const useRouterMocked = jest.mocked(useRouter);

    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: "fake-active-subscription",
      },
      status: "authenticated",
    } as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<PostPreview post={post} />);

    expect(pushMock).toHaveBeenCalledWith("/posts/fake-slug");
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = jest.mocked(createClient);

    getPrismicClientMocked.mockReturnValueOnce({
        getByUID: jest.fn().mockResolvedValueOnce({
          uid: 'fake-slug',
          data: {
              title: [{type: 'heading', text:'Fake title 1'}],
              content: [{type: 'paragraph', text: 'Fake excerpt 1'}],
          },
          last_publication_date: '2022-01-02',
        })
    } as any);


    const response = await getStaticProps({
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