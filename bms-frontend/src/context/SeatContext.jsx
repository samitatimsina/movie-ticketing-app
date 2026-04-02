import { createContext, useContext, useState } from "react";

const SeatContext = createContext();

export const SeatProvider = ({ children }) => {
  // Store seats as { id, row, number, type, price }
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentShow, setCurrentShow] = useState(null);

  return (
    <SeatContext.Provider
      value={{ selectedSeats, setSelectedSeats, currentShow, setCurrentShow }}
    >
      {children}
    </SeatContext.Provider>
  );
};

export const useSeatContext = () => {
  const context = useContext(SeatContext);
  if (!context) {
    throw new Error("useSeatContext must be used within a SeatProvider");
  }
  return context;
};