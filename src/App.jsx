import AppRouter from "./Router/AppRouter";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
function App() {
  return  (
    <BrowserRouter>
    <div>
      <Toaster position="top-center" reverseOrder={false}/>
      <AppRouter />
    </div>
    </BrowserRouter>
  )
}

export default App;
