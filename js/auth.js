window.HMS_Auth = {
  validatePassword: (pwd) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    return re.test(pwd);
  },

  validateEmail: (email) => {
    // Requires @ and a domain part like .com
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  register: (data) => {
    if (!window.HMS_Auth.validateEmail(data.email)) {
      return { success: false, msg: "Please enter a valid email address (e.g., user@example.com)." };
    }
    if (data.password !== data.confirmPassword) {
      return { success: false, msg: "Passwords do not match." };
    }
    if (!window.HMS_Auth.validatePassword(data.password)) {
      return { success: false, msg: "Password must have 1 uppercase, 1 lowercase, 1 special char, and be min 8 chars long." };
    }
    
    const users = window.HMS.getUsers();
    if (users.find(u => u.userId === data.userId)) {
      return { success: false, msg: "UserID already exists. Choose another." };
    }

    const newUser = {
      userId: data.userId || window.HMS.generateId('CUST'),
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      address: data.address,
      password: data.password,
      role: data.role || 'customer'
    };

    users.push(newUser);
    window.HMS.setUsers(users);
    return { success: true, user: newUser, msg: "Consumer Registration Successful" };
  },

  login: (userId, password, role) => {
    const users = window.HMS.getUsers();
    const user = users.find(u => u.userId === userId && u.password === password && u.role === role);
    if (user) {
      window.HMS.setCurrentUser({
        userId: user.userId,
        name: user.name,
        role: user.role
      });
      return { success: true };
    }
    return { success: false, msg: "Invalid Credentials or Role Selection" };
  }
};
