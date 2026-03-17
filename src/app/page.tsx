export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">
        {process.env.NEXT_PUBLIC_APP_NAME ?? "App"}
      </h1>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Welcome to your app. Start building!
      </p>
    </div>
  );
}
