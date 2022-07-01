import { render, screen } from '@testing-library/react'
import Posts, { getServerSideProps, Post } from '../../pages/posts';
import { createClient } from "../../services/prismic";

jest.mock('../../services/stripe')

jest.mock('../../services/prismic')


const posts = [
  { 
    slug: 'fake-slug',
    title: 'Fake title 1',
    excerpt: 'Fake excerpt 1',
    updated_at: '2022-01-01',
  }
]

describe('Posts Page', () => {
  it('render correctly', () => {
    render(<Posts posts={posts} /> )

    expect(screen.getByText("Fake title 1")).toBeInTheDocument()
  })


  it('loads initial data', async () => {
    const getPrismicClientMocked = jest.mocked(createClient);

    getPrismicClientMocked.mockReturnValueOnce({
        getAllByType: jest.fn().mockResolvedValueOnce(
            [
                {
                    uid: 'fake-slug',
                    data: {
                        title: [{text:'Fake title 1'}],
                        content: [
                            {
                                type: 'paragraph',
                                text: 'Fake excerpt 1',
                            },
                        ],
                    },
                    last_publication_date: '2022-01-02',
                },
            ],
        ),
    } as any);

    const response = await getServerSideProps({
        previewData: undefined,
    });
    console.log(response.props.posts)
    expect(response).toEqual(
        expect.objectContaining({
            props: {
                posts: [
                    {
                        slug: 'fake-slug',
                        title: 'Fake title 1',
                        excerpt: 'Fake excerpt 1',
                        updated_at: '01 de janeiro de 2022',
                    }
                ]
            }
        })
    )
  });


  // it('loads initial data', async () => {
  //   const retrieveStripePricesMocked = jest.mocked(stripe.prices.retrieve)
  //   retrieveStripePricesMocked.mockResolvedValueOnce({
  //     id: 'fake-price-id',
  //     unit_amount: 1000,
  //   } as any)

  //   const response = await getStaticProps({})

  //   expect(response).toEqual(
  //     expect.objectContaining({
  //       props: {
  //         product: {
  //           priceId: 'fake-price-id',
  //           amount: '$10.00'
  //         }
  //       }
  //     })
  //   )
  // })
})