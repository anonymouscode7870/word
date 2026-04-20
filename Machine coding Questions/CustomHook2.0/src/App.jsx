import { useEffect, useState } from 'react'
import useWindowSize from './Hooks/windowSize'



function App() {
  
  const windowSize = useWindowSize();
  return (
    <>
      <h1>Custom Hook</h1>
          current dimensions: {windowSize.width} x {windowSize.height} 
    </>
  )
}

export default App
