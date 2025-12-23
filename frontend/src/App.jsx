import { useUser } from '@clerk/clerk-react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from "./pages/HomePage"

import ProblemsPage from './pages/ProblemsPage'
import DashboardPage from './pages/DashboardPage'
import ProblemPage from './pages/ProblemPage'
import SessionPage from './pages/SessionPage'
import CreateProblem from "./pages/CreateProblem";
import AdminRoute from "./components/AdminRoute";
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
      <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
      <Route path="/create-problem" element={<CreateProblem />} />
      {/*ADMIN ONLY */}
      {/* <Route
        path="/create-problem"
        element={
          <AdminRoute>
            <CreateProblem />
          </AdminRoute>
        }
      /> */}
    </Routes>

    <Toaster toastOptions={{duration: 3000}}/>
    </>
  );
}

export default App

//tw,daisyui,react-router,react-hot-toast,react-query aka tanstack query,axios done