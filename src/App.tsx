import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Game from "./pages/Game";
// game is a
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  {
    path: "/game/:gameId",
    element: <Game />,
  },
]);

export default function App() {
  return (
    <div className="min-h-screen w-full bg-blue-300 text-black">
      <Toaster
        containerClassName="toaster-wrapper"
        toastOptions={{
          duration: 500,
          style: {
            textAlign: "center",
          },
        }}
      />
      <RouterProvider router={router} />
    </div>
  );
}
