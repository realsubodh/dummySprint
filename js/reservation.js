window.HMS_Reservation = {
  roomPrices: {
    'Single': 100,
    'Double': 150,
    'Suite': 300,
    'Deluxe': 500
  },

  calculateDays: (checkIn, checkOut) => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  },

  createBooking: (userId, checkIn, checkOut, roomType, name, contact) => {
    const bookings = window.HMS.getBookings();
    const days = window.HMS_Reservation.calculateDays(checkIn, checkOut);
    const billAmount = days * window.HMS_Reservation.roomPrices[roomType];
    
    const newBooking = {
      bookingId: window.HMS.generateId('BKG'),
      userId,
      name,
      contact,
      checkIn,
      checkOut,
      roomType,
      roomNumber: null, // Assigned on approval
      billAmount,
      status: 'pending',
      bookingDate: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    window.HMS.setBookings(bookings);
    return newBooking;
  },

  updateBookingStatus: (bookingId, status, roomNumber = null) => {
    const bookings = window.HMS.getBookings();
    const bIdx = bookings.findIndex(b => b.bookingId === bookingId);
    if (bIdx > -1) {
      bookings[bIdx].status = status;
      if (roomNumber) bookings[bIdx].roomNumber = roomNumber;
      window.HMS.setBookings(bookings);
      return true;
    }
    return false;
  },
  
  getPendingBookings: () => {
    return window.HMS.getBookings().filter(b => b.status === 'pending');
  },

  getUserBookings: (userId) => {
    return window.HMS.getBookings().filter(b => b.userId === userId);
  }
};
