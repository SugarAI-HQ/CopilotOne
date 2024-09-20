export const Header = () => {
  return (
    <header className="bg-gray-900 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <img
              className="h-10 w-300"
              src="https://docs.sugarai.dev/_astro/logo-transparent.UspD8vKv.png"
              alt="Sugar AI"
            />
            {/* <span className="ml-3 text-xl font-bold text-gray-900">
                Sugar AI
              </span> */}
          </div>
          <nav className="flex space-x-4">
            {/* 
              <a
                href="https://sugarai.dev"
                className="text-gray-100 hover:text-gray-900"
              >
                Home
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                About
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Services
              </a> 
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Contact
              </a>*/}
          </nav>
        </div>
      </div>
    </header>
  );
};
