import { useEffect, useState } from "react"

export function Async() {
  const [isButtonInvisible, setIsButtonInvisible] = useState(false)

  //imitando o funcionamento de algo que pode acontecer de forma assincrona 
  useEffect(() => {
    setTimeout(() => {
      setIsButtonInvisible(true)
    }, 1000)
  }, [])

  return (
    <>
      <div>Hello World</div>
      { !isButtonInvisible && <button>Button</button>}
    </>
  )
}