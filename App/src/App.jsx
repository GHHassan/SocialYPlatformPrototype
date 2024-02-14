
import Home from "./components/pages/Home"
import Profile from "./components/pages/Profile"
import HomePages from "./components/Routing";

function App() {

  return (
    <>
      <div className="bg-gray-100 font-sans">
        {/* Header */}
        <header className="bg-white p-4 shadow-md">
          Header
        </header>

        {/* Main Content */}
        <main className="mt-8 lg:mt-8 sm:mx-5 md:mx-5 lg:m-auto max-w-7xl grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-4 rounded-lg shadow-md md:col-start-1 md:col-end-3">
            <HomePages />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md hidden sm:hidden md:block md:col-start-2 lg:col-start-3">
            Chat
          </div>
        </main>

        {/* footer goes here */}
        <footer className="bg-white p-4 mt-8 shadow-md">
          Footer
        </footer>
      </div>
    </>
  )
}

export default App
