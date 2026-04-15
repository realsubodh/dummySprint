window.HMS_Billing = {
  getLatestBooking: (userId) => {
    const bookings = window.HMS.getBookings();
    const userBookings = bookings.filter(b => b.userId === userId && b.status !== 'checked-out' && b.status !== 'rejected');
    return userBookings.length ? userBookings[userBookings.length - 1] : null;
  },
  
  generateInvoice: (bookingId) => {
    const bookings = window.HMS.getBookings();
    const booking = bookings.find(b => b.bookingId === bookingId);
    if (!booking) return null;

    const baseCharge = booking.billAmount;
    const taxes = baseCharge * 0.18; // 18% GST (mock)
    const extraChargeDesc = "Room Service";
    const extraCharges = booking.extraCharges || 0;
    const grandTotal = baseCharge + taxes + extraCharges;

    return {
      bookingId,
      baseCharge,
      taxes,
      extraChargeDesc,
      extraCharges,
      grandTotal
    };
  },

  addExtraCharge: (bookingId, amount) => {
    const bookings = window.HMS.getBookings();
    const b = bookings.find(x => x.bookingId === bookingId);
    if(b) {
      b.extraCharges = (b.extraCharges || 0) + parseInt(amount);
      window.HMS.setBookings(bookings);
    }
  },

  processPayment: (bookingId, amount) => {
    const payments = window.HMS.getPayments();
    const txnId = window.HMS.generateId('TXN');
    const bookings = window.HMS.getBookings();
    const booking = bookings.find(b => b.bookingId === bookingId);
    
    payments.push({
      transactionId: txnId,
      bookingId,
      userId: booking ? booking.userId : 'unknown',
      amount,
      status: 'paid'
    });
    window.HMS.setPayments(payments);
    
    // Auto check-out after payment for mock simplicity
    window.HMS_Reservation.updateBookingStatus(bookingId, 'checked-out');
    
    return txnId;
  }
};
