window.HMS_Billing = {
  getLatestBooking: (userId) => {
    const bookings = window.HMS.getBookings();
    const userBookings = bookings.filter(b => b.userId === userId && b.status !== 'Checked-out' && b.status !== 'Rejected');
    return userBookings.length ? userBookings[userBookings.length - 1] : null;
  },
  
  generateInvoice: (bookingId) => {
    const bookings = window.HMS.getBookings();
    const booking = bookings.find(b => b.bookingId === bookingId);
    if (!booking) return null;

    const baseCharge = booking.totalBill;
    const taxes = baseCharge * 0.18; // 18% GST (mock)
    const extraChargeDesc = "Room Service";
    const extraCharges = parseInt(localStorage.getItem(`acc_${bookingId}`) || '0');
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
    let current = parseInt(localStorage.getItem(`acc_${bookingId}`) || '0');
    localStorage.setItem(`acc_${bookingId}`, current + parseInt(amount));
  },

  processPayment: (bookingId, amount, mode) => {
    const payments = window.HMS.getPayments();
    const txnId = window.HMS.generateId('TXN');
    payments.push({
      transactionId: txnId,
      bookingId,
      amount,
      mode,
      date: new Date().toISOString()
    });
    window.HMS.setPayments(payments);
    
    // Auto check-out after payment for mock simplicity
    window.HMS_Reservation.updateBookingStatus(bookingId, 'Checked-out');
    
    return txnId;
  }
};
