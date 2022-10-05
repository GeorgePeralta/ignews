import { screen, render } from '@testing-library/react'
// import { useSession } from 'next-auth/react';
import Home from '../../pages'

jest.mock('next-auth/react', () => {
  return {
  useSession: () => [null, false]
  }
});

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}))

describe('Home page', () => {
  it('renders correctly', ()=> {
    // const useSessionMocked = jest.mocked(useSession)
    // useSessionMocked.mockReturnValueOnce([null, false] as any)
    render (
      <Home product={{ priceId: 'fake-price-id', amount: 'R$10,00'}} />)

      expect(screen.getByText('for R$10,00 month')).toBeInTheDocument()
    
  })
})