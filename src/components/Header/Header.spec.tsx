import { render, screen } from '@testing-library/react'
import { Header } from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

jest.mock('next-auth/react', () => {
  return {
    useSession() {
      return [null, false]
    }
  }
}) 

describe('Header component', () => {  

  it('renders correctly', () => {
    render(
      <Header />       
    )
    //te sugere como fazer o teste.
      screen.logTestingPlaygroundURL()

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Posts')).toBeInTheDocument()
  })  
})