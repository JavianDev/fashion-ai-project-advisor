export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">UtardiAdvisor</h3>
            <p className="text-gray-400">Your Personal AI Fashion Advisor</p>
          </div>
          <div className="flex space-x-6">
            <a href="/privacy-policy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-gray-400 hover:text-white">
              Terms of Service
            </a>
            <a href="/contact" className="text-gray-400 hover:text-white">
              Contact
            </a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2024 UtardiAdvisor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
