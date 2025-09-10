export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-gray-800">
        Dashboard
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* User Card */}
        <a
          href="/user"
          className="flex flex-col items-center p-6 bg-white shadow-lg rounded-xl transform hover:scale-105 transition duration-300 w-48"
        >
          <img
            src="/images/user.png" // put a user icon in public/user.png
            alt="User"
            className="w-20 h-20 mb-4"
          />
          <span className="text-lg font-semibold text-gray-700">User</span>
        </a>

        {/* Admin Card */}
        <a
          href="/admin"
          className="flex flex-col items-center p-6 bg-white shadow-lg rounded-xl transform hover:scale-105 transition duration-300 w-48"
        >
          <img
            src="/images/admin.jpg" // put an admin icon in public/admin.png
            alt="Admin"
            className="w-20 h-20 mb-4"
          />
          <span className="text-lg font-semibold text-gray-700">Admin</span>
        </a>
      </div>
    </div>
  );
}
