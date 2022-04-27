import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

export async function getStripeJs() {
  const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

  return stripeJs
}