import './App.css';
import { Container } from 'react-bootstrap';

import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LoginContext from './loginContext';
import * as API from "./APICalls"

import MyNavbar from './components/Navbar';

import LoginPage from './pages/Login';
import LeaderBoard from './pages/LeaderBoard'
import AllRiddles from './pages/AllRiddles'
import NewRiddlePage from './pages/NewRiddle';
import MyRiddles from './pages/MyRiddles'

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(undefined)
  const [loaded, setLoaded] = useState(false)

  const [score, setScore] = useState("")

  useEffect(() => {
    const asyncJob = async () => {
      setLoaded(false)

      const user = await API.getSession()
      if (user) {
        setUser(user)

        const UserStats = await API.getUserStats(user.username)
        setScore(UserStats.score)
      }

      setLoaded(true)
    }

    asyncJob()
  }, [])

  return (
    <>
      <LoginContext.Provider value={{ user: user, setUser: setUser }}>

        <BrowserRouter>
        <MyNavbar score={score} setScore={setScore} />
          <Container>
          <Routes>
          <Route path="/login" element={<LoginPage score={score} setScore={setScore} setLoaded={setLoaded}/>}/>
          <Route path="/leaderboard" element={<LeaderBoard/>}/>
          <Route path="/" element={<AllRiddles score={score} setScore={setScore} loaded={loaded}/>}/>
          <Route path="/newriddle" element={<NewRiddlePage/>}/>
          <Route path="/myriddles" element={<MyRiddles/>}/>
        </Routes>
        </Container>
        </BrowserRouter>
      </LoginContext.Provider>
    </>
  )


}

export default App;
