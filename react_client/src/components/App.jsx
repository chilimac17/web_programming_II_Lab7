//import { useState } from 'react'
import './App.css'
import Home from "./Home"
import Albums from "./Albums"
import Artist from "./Artist"
import Listeners from "./Listeners"


function App() {
 // const [books, setBooks] = useState();


  return (
    <div>
      <Home />
      <Albums />
      <Artist />
      <Listeners />
    </div>
  )
}

export default App
