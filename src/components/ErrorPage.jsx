export default function ErrorPage({ code, message, image }) {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">

      {/* IMAGE */}
      <img 
        src={image} 
        alt="error"
        className="w-72 mb-6"
      />

      {/* ERROR CODE */}
      <h1 className="text-6xl font-bold text-gray-800">
        {code}
      </h1>

      {/* MESSAGE */}
      <p className="text-gray-500 mt-2 mb-6">
        {message}
      </p>

      {/* BUTTON */}
      <button
        onClick={() => window.location.href = "/"}
        className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:opacity-90"
      >
        Back to Dashboard
      </button>

    </div>
  );
}