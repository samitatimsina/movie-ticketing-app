import { Routes, Route, useMatch } from "react-router-dom";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Recommended from "./components/shared/Recommended";
import MovieDetails from "./pages/MovieDetails";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import SeatLayout from "./pages/SeatLayout";
import { SeatProvider } from "./context/SeatContext";
import Checkout from "./pages/Checkout";
import SignIn from "./pages/SignIn";
import PaymentTestPage from "./pages/payment/test";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFail from "./pages/payment/PaymentFailure";
import BookingHistory from "./components/profile/BookingHistory";

function App() {

  //hide header/footer on seatlayout page
  const isSeatLayoutPage= useMatch(
    "/movies/:movieId/:movieName/:theater/:theaterId/show/:showId/:seat-layout"
  );

  const isCheckoutPage = useMatch("/shows/:showId/:state/checkout");

  return (
    <>
    <ToastContainer position="top-right"/>
      <div className="flex flex-col min-h-screen">
        {!isSeatLayoutPage && !isCheckoutPage && <Header />}
        <main className="flex-grow">
          <Routes>
            {/*define routes*/}
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id"element={<h1>Pofile Page</h1>} />
            <Route path="/profile/orders" element={<BookingHistory />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:location/:title/:id/ticket" element={<MovieDetails />} /> 
            <Route path="/movie/:id/:title" element={<MovieDetails />} />
            <Route path="/movies/:id" element={<MovieDetails />} />           
            <Route path="/profile" element={<Profile />} />
            <Route path="/movies/:movieId/:location/:theater/:theaterId/:show/:showId/seat-layout" element={<SeatLayout />} />
            <Route path="/seat-layout" element={<SeatLayout />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/payment/test" element={<PaymentTestPage />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/fail" element={<PaymentFail />} />
           </Routes>
        </main>
          {!isSeatLayoutPage && !isCheckoutPage && <Footer />}
      </div>
    </>
  )
}

export default App;
