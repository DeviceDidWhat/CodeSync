import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser} from '@clerk/clerk-react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from "./pages/HomePage"

import ProblemsPage from './pages/ProblemsPage'
import DashboardPage from './pages/DashboardPage'
import ProblemPage from './pages/ProblemPage'
import { Toaster } from 'react-hot-toast'

function App() {
  const{isSignedIn,isLoaded}=useUser();  

  //In order to get rid of flickering issue
  if(!isLoaded){
    return null;
  }

  return (
    <>
    <Routes>
      <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
      <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
      <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
      <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
    </Routes>

    <Toaster toastOptions={{duration: 3000}}/>
    </>
  );
}

export default App

//tw,daisyui,react-router,react-hot-toast,react-query aka tanstack query,axios done