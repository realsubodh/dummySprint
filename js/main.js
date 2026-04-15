/**
 * HMS Core Utility & App Global Logic
 */
window.HMS = {
  getUsers: () => JSON.parse(localStorage.getItem('users') || '[]'),
  setUsers: (users) => localStorage.setItem('users', JSON.stringify(users)),
  
  getCurrentUser: () => JSON.parse(localStorage.getItem('session')),
  setCurrentUser: (user) => localStorage.setItem('session', JSON.stringify(user)),
  logout: () => {
    localStorage.removeItem('session');
    window.location.href = 'index.html';
  },

  getBookings: () => JSON.parse(localStorage.getItem('bookings') || '[]'),
  setBookings: (bookings) => localStorage.setItem('bookings', JSON.stringify(bookings)),
  
  getPayments: () => JSON.parse(localStorage.getItem('payments') || '[]'),
  setPayments: (payments) => localStorage.setItem('payments', JSON.stringify(payments)),

  migrateStorage: () => {
    if (localStorage.getItem('hms_currentUser')) {
      localStorage.setItem('session', localStorage.getItem('hms_currentUser'));
      localStorage.removeItem('hms_currentUser');
    }
    
    let allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    let usersChanged = false;
    ['userData', 'hms_users'].forEach(k => {
      const d = localStorage.getItem(k);
      if (d) {
        allUsers = allUsers.concat(JSON.parse(d));
        localStorage.removeItem(k);
        usersChanged = true;
      }
    });

    if (usersChanged) {
      const uniqueUsers = [];
      const seen = new Set();
      for (const u of allUsers) {
        if (!seen.has(u.userId)) {
          uniqueUsers.push(u);
          seen.add(u.userId);
        }
      }
      localStorage.setItem('users', JSON.stringify(uniqueUsers));
    }
    
    let allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    let bookingsChanged = false;
    ['customerBookings', 'adminBookings', 'hms_bookings'].forEach(k => {
      const d = localStorage.getItem(k);
      if (d) {
        allBookings = allBookings.concat(JSON.parse(d));
        localStorage.removeItem(k);
        bookingsChanged = true;
      }
    });
    if (bookingsChanged) {
      localStorage.setItem('bookings', JSON.stringify(allBookings));
    }

    if (localStorage.getItem('hms_payments')) {
      const existing = JSON.parse(localStorage.getItem('payments') || '[]');
      const old = JSON.parse(localStorage.getItem('hms_payments'));
      localStorage.setItem('payments', JSON.stringify(existing.concat(old)));
      localStorage.removeItem('hms_payments');
    }
    
    const removeKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('acc_')) {
        removeKeys.push(k);
      }
    }
    removeKeys.forEach(k => localStorage.removeItem(k));
  },

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
    if (!users.find(u => u.role === 'admin')) {
      users.push({
        userId: 'admin',
        name: 'System Admin',
        email: 'admin@hms.local',
        mobile: '1234567890',
        address: 'HQ',
        password: 'Admin@123',
        role: 'admin'
      });
      window.HMS.setUsers(users);
    }
  },

  checkAuth: (rolesAllowed = ['customer', 'admin']) => {
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
    
    if (user.role === 'admin') {
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

// Migrate existing fragmented keys first
window.HMS.migrateStorage();
// Seed admin on load
window.HMS.seedAdmin();
