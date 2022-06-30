import { render, screen } from '@testing-library/react'
import { stripe } from '../../services/stripe'
import Home, { getStaticProps } from '../../pages'

jest.mock('next/router')
jest.mock('next-auth/react', () => {
  return {
    useSession: () => [null,false]
  }
})
jest.mock('../../services/stripe')

describe('Home Page', () => {
  it('render correctly', () => {
    render(<Home product={{priceId: 'fake-price-id', amount: 'R$10,00'}} /> )

    expect(screen.getByText(/10,00/i)).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const retrieveStripePricesMocked = jest.mocked(stripe.prices.retrieve)
    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
})