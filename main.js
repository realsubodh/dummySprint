/**
 * HMS Core Utility & App Global Logic
 */
window.HMS = {
  getUsers: () => JSON.parse(localStorage.getItem('hms_users') || '[]'),
  setUsers: (users) => localStorage.setItem('hms_users', JSON.stringify(users)),
  
  getCurrentUser: () => JSON.parse(localStorage.getItem('hms_currentUser')),
  setCurrentUser: (user) => localStorage.setItem('hms_currentUser', JSON.stringify(user)),
  logout: () => {
    localStorage.removeItem('hms_currentUser');
    window.location.href = 'index.html';
  },

  getBookings: () => JSON.parse(localStorage.getItem('hms_bookings') || '[]'),
  setBookings: (bookings) => localStorage.setItem('hms_bookings', JSON.stringify(bookings)),
  
  getPayments: () => JSON.parse(localStorage.getItem('hms_payments') || '[]'),
  setPayments: (payments) => localStorage.setItem('hms_payments', JSON.stringify(payments)),

  generateId: (prefix = 'ID') => `${prefix}${Math.floor(Math.random() * 1000000)}`,

  showAlert: (msg, type='success', elementId='alertBox') => {
    const box = document.getElementById(elementId);
    if(box) {
      box.textContent = msg;
      box.className = `alert ${type}`;
      box.style.display = 'block';
      setTimeout(() => { box.style.display = 'none'; }, 5000);
    } else {
      alert(msg);
    }
  },

  showModal: (modalId) => {
    const modal = document.getElementById(modalId);
    if(modal) modal.classList.add('active');
  },

  hideModal: (modalId) => {
    const modal = document.getElementById(modalId);
    if(modal) modal.classList.remove('active');
  },

  seedAdmin: () => {
    const users = window.HMS.getUsers();
    if (!users.find(u => u.role === 'Admin')) {
      users.push({
        userId: 'admin123',
        name: 'System Admin',
        email: 'admin@hms.local',
        mobile: '1234567890',
        address: 'HQ',
        password: 'Admin@123',
        role: 'Admin'
      });
      window.HMS.setUsers(users);
    }
  },

  checkAuth: (rolesAllowed = ['Customer', 'Admin']) => {
    const user = window.HMS.getCurrentUser();
    if (!user) {
      window.location.href = 'index.html';
      return null;
    }
    if (!rolesAllowed.includes(user.role)) {
      window.location.href = 'dashboard.html';
      return null;
    }
    return user;
  },

  renderNavbar: () => {
    const user = window.HMS.getCurrentUser();
    if (!user) return;
    
    let navLinks = '';
    
    if (user.role === 'Admin') {
      navLinks = `
        <a href="dashboard.html">Home</a>
        <a href="reservation.html">Reservation</a>
        <a href="billing.html">Billing</a>
        <a href="history.html">History</a>
        <a href="room-status.html">Room Status</a>
        <a href="bookings.html">Bookings</a>
        <a href="support.html">Support</a>
      `;
    } else {
      // Customer
      navLinks = `
        <a href="dashboard.html">Home</a>
        <a href="reservation.html">Reservation</a>
        <a href="billing.html">Billing</a>
        <a href="history.html">History</a>
        <a href="bookings.html">Bookings</a>
        <a href="support.html">Support</a>
      `;
    }

    const navbarContainer = document.getElementById('navbar-links');
    if (navbarContainer) {
      navbarContainer.innerHTML = navLinks;
      // Higlight active link
      const links = navbarContainer.getElementsByTagName('a');
      for (let link of links) {
        if(link.href === window.location.href || (window.location.href.endsWith('/') && link.href.endsWith('dashboard.html'))) {
          link.classList.add('active');
        }
      }
    }
    
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
      userDisplay.textContent = `Welcome, ${user.name}`;
    }
  }
};

// Seed admin on load
window.HMS.seedAdmin();
