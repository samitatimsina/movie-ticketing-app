export const formatReleaseDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.toLocaleString("en-IN", { day: "2-digit" });
  const month = date.toLocaleString("en-IN", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

export const formatedTodayDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const yyyy = today.getFullYear();
  const formattedDate = `${dd}-${mm}-${yyyy}`;
  return formattedDate;
};

export const seatTypePrices = {
  PREMIUM: 510,
  EXECUTIVE: 290,
  NORMAL: 180,
};

export const getSeatType = (seat) => {
  const seatId =
    typeof seat === "string"
      ? seat
      : seat?.seatId || seat?.id || "";

  if (!seatId) return "unknown";

  const row = seatId.charAt(0);

  if (["E"].includes(row)) return "PREMIUM";
  if (["C", "D"].includes(row)) return "EXECUTIVE";
  return "REGULAR";
};

// Utility function to group seats by type for Checkout
export const groupSeatsByType = (seats) => {
  const grouped = {};
  seats.forEach(({ type, number }) => {
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(number);
  });
  return Object.entries(grouped).map(([type, seats]) => ({ type, seats }));
};

export const calculateTotalPrice = (selectedSeats) => {
  const base = selectedSeats.reduce((acc, seat) => {
    const price =
      typeof seat === "string"
        ? 150
        : seat?.price || 150;

    return acc + price;
  }, 0);

  const tax = Math.round(base * 0.13); // 13% tax (Nepal VAT)
  const total = base + tax;

  return { base, tax, total };
};