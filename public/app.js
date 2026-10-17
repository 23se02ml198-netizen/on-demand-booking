import * as UI from './components.js';
const { formatINR } = UI;
const { categoryServices } = UI;

// ==========================================================================
// CENTRAL STATE MANAGEMENT
// ==========================================================================
const AppState = {
  currentUser: null,
  currentView: 'home', // 'home', 'services', 'customer-dashboard', 'provider-dashboard', 'admin-dashboard'
  categories: [],
  providers: [],
  selectedCategory: '',
  searchQuery: '',
  bookings: [],

  // Modals data
  activeBookingProvider: null,
  activeChatBookingId: null,
  activeChatPartnerName: '',
  chatPollInterval: null,

  // Sub-tabs & filters inside dashboards
  customerDashTab: 'bookings',
  expenditureFromDate: '',
  expenditureToDate: '',
  providerDashTab: 'jobs',
  adminDashTab: 'overview',

  // Cache lists for admin
  adminUsersList: [],
  adminStats: null,

  // Presentation Mode properties
  activeSlideIndex: 0,
  isOfflineMode: false
};

// ==========================================================================
// TOAST NOTIFICATIONS MANAGER
// ==========================================================================
export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove toast after 3.5 seconds
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

// Loader toggler
function toggleLoader(show) {
  const loader = document.getElementById('global-loader');
  if (loader) {
    if (show) loader.classList.remove('hidden');
    else loader.classList.add('hidden');
  }
}

// ==========================================================================
// OFFLINE LOCALSTORAGE MOCK DATABASE ENGINE
// ==========================================================================
const MockDB = {
  init() {
    if (!localStorage.getItem('apex_users')) {
      // Seed default categories
      const defaultCategories = [
        { id: 1, name: 'Cleaning', icon: 'cleaning', description: 'Professional home, kitchen, and deep office cleaning services.', services: categoryServices.Cleaning },
        { id: 2, name: 'Plumbing', icon: 'plumbing', description: 'Leak detection, pipe repairs, tap fittings, and drainage clearing.', services: categoryServices.Plumbing },
        { id: 3, name: 'Electrical', icon: 'electrical', description: 'Safe residential wiring, lighting installation, and panel upgrades.', services: categoryServices.Electrical },
        { id: 4, name: 'Appliance Repair', icon: 'appliances', description: 'AC servicing, refrigerator repair, washing machines, and microwave fixing.', services: categoryServices['Appliance Repair'] },
        { id: 5, name: 'Beauty & Wellness', icon: 'beauty', description: 'Salon at home, hair styling, facials, pedicures, and wellness massage.', services: categoryServices['Beauty & Wellness'] },
        { id: 6, name: 'Pest Control', icon: 'pest', description: 'Safe and effective treatment for termites, bed bugs, and general pests.', services: categoryServices['Pest Control'] }
      ];
      localStorage.setItem('apex_categories', JSON.stringify(defaultCategories));

      // Seed default users
      const defaultUsers = [
        { id: 1, name: 'System Admin', email: 'admin@services.com', password: 'admin123', role: 'admin' },
        { id: 2, name: 'Alice Johnson', email: 'alice@example.com', password: 'alice123', role: 'customer' },
        { id: 3, name: 'Bob Smith', email: 'bob@example.com', password: 'bob123', role: 'customer' },
        { id: 4, name: 'John Doe', email: 'john@plumbing.com', password: 'john123', role: 'provider' },
        { id: 5, name: 'Sarah Connor', email: 'sarah@cleaning.com', password: 'sarah123', role: 'provider' },
        { id: 6, name: 'Mike Sparks', email: 'mike@electrical.com', password: 'mike123', role: 'provider' },
        { id: 7, name: 'Elena Rostova', email: 'elena@beauty.com', password: 'elena123', role: 'provider' },
        { id: 8, name: 'Priya Nair', email: 'priya@appliancerepair.com', password: 'priya123', role: 'provider' },
        { id: 9, name: 'Arjun Mehta', email: 'arjun@pestcontrol.com', password: 'arjun123', role: 'provider' }
      ];
      localStorage.setItem('apex_users', JSON.stringify(defaultUsers));

      // Seed default providers details
      const defaultProviders = [
        { user_id: 4, category: 'Plumbing', bio: 'Professional plumber with 10 years of experience in leak repairs, pipe installations, and bathroom fittings. Reliable and quick.', hourly_rate: 750, rating: 4.8, review_count: 1, availability: '{"days":["Monday","Tuesday","Wednesday","Thursday","Friday"],"hours":{"start":"09:00","end":"17:00"}}', status: 'approved' },
        { user_id: 5, category: 'Cleaning', bio: 'Expert home cleaning specialist. Detail-oriented, pet-friendly, and dedicated to making your home shine. Available on weekends.', hourly_rate: 600, rating: 4.9, review_count: 1, availability: '{"days":["Monday","Tuesday","Wednesday","Thursday","Friday"],"hours":{"start":"09:00","end":"17:00"}}', status: 'approved' },
        { user_id: 6, category: 'Electrical', bio: 'Licensed electrician. Specialized in home wiring, smart lighting installations, panel upgrades, and electrical safety audits.', hourly_rate: 900, rating: 4.7, review_count: 1, availability: '{"days":["Monday","Tuesday","Wednesday","Thursday","Friday"],"hours":{"start":"09:00","end":"17:00"}}', status: 'approved' },
        { user_id: 7, category: 'Beauty & Wellness', bio: 'Professional hair stylist and beautician. Bringing salon-grade hair care, makeup, bridal service, and facial treatments to your doorstep.', hourly_rate: 800, rating: 5.0, review_count: 1, availability: '{"days":["Monday","Tuesday","Wednesday","Thursday","Friday"],"hours":{"start":"09:00","end":"17:00"}}', status: 'approved' },
        { user_id: 8, category: 'Appliance Repair', bio: 'Certified appliance technician for air conditioners, refrigerators, washing machines, microwaves, TVs, and geysers.', hourly_rate: 850, rating: 4.9, review_count: 1, availability: '{"days":["Monday","Tuesday","Wednesday","Thursday","Friday"],"hours":{"start":"09:00","end":"17:00"}}', status: 'approved' },
        { user_id: 9, category: 'Pest Control', bio: 'Licensed pest control professional providing safe termite, cockroach, mosquito, bed bug, rodent, and general pest treatments.', hourly_rate: 700, rating: 4.8, review_count: 1, availability: '{"days":["Monday","Tuesday","Wednesday","Thursday","Friday"],"hours":{"start":"09:00","end":"17:00"}}', status: 'approved' }
      ];
      localStorage.setItem('apex_providers', JSON.stringify(defaultProviders));

      // Seed default bookings
      const defaultBookings = [
        { id: 1, customer_id: 2, provider_id: 4, category: 'Plumbing', booking_date: '2026-06-28', booking_time: '10:00', duration_hours: 2, address: 'Apartment 4B, Pine Street, Cityville', status: 'completed', total_price: 90, notes: 'Fix kitchen sink leak and check bathroom pressure.', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
      ];
      localStorage.setItem('apex_bookings', JSON.stringify(defaultBookings));

      // Seed reviews
      const defaultReviews = [
        { id: 1, booking_id: 1, customer_id: 2, provider_id: 4, rating: 5, comment: 'John was very efficient and fixed the kitchen leak in no time. Highly recommended!', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
      ];
      localStorage.setItem('apex_reviews', JSON.stringify(defaultReviews));

      // Sessions list
      localStorage.setItem('apex_sessions', JSON.stringify([]));

      // Messages list
      localStorage.setItem('apex_messages', JSON.stringify([]));
    }
  },

  get(table) {
    this.init();
    return JSON.parse(localStorage.getItem(`apex_${table}`) || '[]');
  },

  set(table, data) {
    localStorage.setItem(`apex_${table}`, JSON.stringify(data));
  },

  // REST Emulator Router
  async request(endpoint, method = 'GET', body = null) {
    await new Promise(resolve => setTimeout(resolve, 200));

    const token = localStorage.getItem('apex_token');
    const sessions = this.get('sessions');
    const activeSession = sessions.find(s => s.token === token);
    const users = this.get('users');
    const currentUser = activeSession ? users.find(u => u.id === activeSession.user_id) : null;

    // Route Parser
    // 1. Auth Endpoint
    if (endpoint === '/api/auth/login' && method === 'POST') {
      const { email, password } = body;
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) throw new Error('Invalid email or password.');

      const sessionToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
      sessions.push({ token: sessionToken, user_id: user.id, expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() });
      this.set('sessions', sessions);
      return { token: sessionToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }

    if (endpoint === '/api/auth/register' && method === 'POST') {
      const { name, email, password, role, category, bio, hourly_rate } = body;
      if (!['customer', 'provider'].includes(role)) throw new Error('Role must be customer or provider.');
      if (role === 'provider' && (!category || !hourly_rate)) throw new Error('Provider category and hourly rate are required.');
      if (users.find(u => u.email === email)) throw new Error('Email already registered.');

      const newUserId = users.length + 1;
      users.push({ id: newUserId, name, email, password, role });
      this.set('users', users);

      if (role === 'provider') {
        const providers = this.get('providers');
        providers.push({
          user_id: newUserId,
          category,
          bio: bio || '',
          hourly_rate: parseFloat(hourly_rate),
          rating: 5.0,
          review_count: 0,
          availability: JSON.stringify({
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            hours: { start: '09:00', end: '17:00' }
          }),
          status: 'pending_approval'
        });
        this.set('providers', providers);
      }

      return { message: 'Registration successful.', user: { id: newUserId, name, email, role } };
    }

    if (endpoint === '/api/auth/logout' && method === 'POST') {
      const filtered = sessions.filter(s => s.token !== token);
      this.set('sessions', filtered);
      return { message: 'Logout successful.' };
    }

    if (endpoint === '/api/auth/me' && method === 'GET') {
      if (!currentUser) throw new Error('Session token expired or invalid.');

      const userData = { id: currentUser.id, name: currentUser.name, email: currentUser.email, role: currentUser.role, token };
      if (currentUser.role === 'provider') {
        const providers = this.get('providers');
        const details = providers.find(p => p.user_id === currentUser.id);
        if (details) {
          userData.providerDetails = {
            ...details,
            availability: JSON.parse(details.availability || '{}')
          };
        }
      }
      return { user: userData };
    }

    // 2. Categories
    if (endpoint === '/api/categories' && method === 'GET') {
      return this.get('categories');
    }

    // 3. Providers
    if (endpoint.startsWith('/api/providers') && method === 'GET') {
      const matchDetail = endpoint.match(/\/api\/providers\/(\d+)/);
      if (matchDetail) {
        const provId = parseInt(matchDetail[1]);
        const user = users.find(u => u.id === provId);
        const providers = this.get('providers');
        const details = providers.find(p => p.user_id === provId);
        if (!user || !details) throw new Error('Provider not found.');

        const reviews = this.get('reviews').filter(r => r.provider_id === provId);
        const reviewsJoined = reviews.map(r => {
          const cust = users.find(u => u.id === r.customer_id);
          return { ...r, customer_name: cust ? cust.name : 'Verified Customer' };
        });

        return {
          provider: {
            id: user.id,
            name: user.name,
            email: user.email,
            category: details.category,
            bio: details.bio,
            hourly_rate: details.hourly_rate,
            rating: details.rating,
            review_count: details.review_count,
            availability: JSON.parse(details.availability || '{}'),
            status: details.status
          },
          reviews: reviewsJoined
        };
      } else {
        const urlObj = new URL(endpoint, 'http://localhost');
        const categoryFilter = urlObj.searchParams.get('category');
        const searchFilter = urlObj.searchParams.get('search');

        const providers = this.get('providers').filter(p => p.status === 'approved');
        const mapped = providers.map(p => {
          const user = users.find(u => u.id === p.user_id);
          return {
            id: p.user_id,
            name: user ? user.name : 'Unknown Pro',
            email: user ? user.email : '',
            category: p.category,
            bio: p.bio,
            hourly_rate: p.hourly_rate,
            rating: p.rating,
            review_count: p.review_count,
            status: p.status
          };
        });

        return mapped.filter(p => {
          let matches = true;
          if (categoryFilter) matches = matches && p.category === categoryFilter;
          if (searchFilter) {
            const query = searchFilter.toLowerCase();
            matches = matches && (p.name.toLowerCase().includes(query) || p.bio.toLowerCase().includes(query));
          }
          return matches;
        });
      }
    }

    if (endpoint === '/api/providers/profile' && method === 'PUT') {
      if (!currentUser || currentUser.role !== 'provider') throw new Error('Unauthorized.');
      const { bio, hourly_rate, availability, category } = body;
      const providers = this.get('providers');
      const idx = providers.findIndex(p => p.user_id === currentUser.id);
      if (idx !== -1) {
        if (category) providers[idx].category = category;
        providers[idx].bio = bio || '';
        providers[idx].hourly_rate = parseFloat(hourly_rate) || providers[idx].hourly_rate;
        if (availability) providers[idx].availability = JSON.stringify(availability);
        this.set('providers', providers);
      }
      return { message: 'Profile updated successfully.' };
    }

    // 4. Bookings & Expenditure
    if (endpoint.startsWith('/api/customer/expenditure') && method === 'GET') {
      if (!currentUser || currentUser.role !== 'customer') throw new Error('Unauthorized.');
      const urlObj = new URL(endpoint, 'http://localhost');
      const fromDate = urlObj.searchParams.get('from_date');
      const toDate = urlObj.searchParams.get('to_date');

      let bookings = this.get('bookings').filter(b => b.customer_id === currentUser.id && (b.status === 'completed' || b.payment_status === 'paid_to_admin' || b.status === 'accepted' || b.status === 'in_progress'));

      if (fromDate) bookings = bookings.filter(b => b.booking_date >= fromDate);
      if (toDate) bookings = bookings.filter(b => b.booking_date <= toDate);

      const paidBookings = bookings.map(b => {
        const proUser = users.find(u => u.id === b.provider_id);
        return {
          ...b,
          provider_name: proUser ? proUser.name : 'Unknown Pro',
          provider_email: proUser ? proUser.email : ''
        };
      });

      const totalSpent = paidBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
      const count = paidBookings.length;
      const avgSpent = count > 0 ? totalSpent / count : 0;

      const categoryBreakdown = {};
      paidBookings.forEach(b => {
        const cat = b.category || 'Other';
        if (!categoryBreakdown[cat]) {
          categoryBreakdown[cat] = { total: 0, count: 0 };
        }
        categoryBreakdown[cat].total += (b.total_price || 0);
        categoryBreakdown[cat].count += 1;
      });

      return {
        from_date: fromDate || null,
        to_date: toDate || null,
        totalSpent,
        totalBills: count,
        avgSpent,
        categoryBreakdown,
        bookings: paidBookings
      };
    }

    if (endpoint.startsWith('/api/bookings') && method === 'GET') {
      if (!currentUser) throw new Error('Unauthorized.');
      const urlObj = new URL(endpoint, 'http://localhost');
      const fromDate = urlObj.searchParams.get('from_date');
      const toDate = urlObj.searchParams.get('to_date');

      let bookings = this.get('bookings');

      if (currentUser.role === 'customer') {
        let filtered = bookings.filter(b => b.customer_id === currentUser.id);
        if (fromDate) filtered = filtered.filter(b => b.booking_date >= fromDate);
        if (toDate) filtered = filtered.filter(b => b.booking_date <= toDate);

        return filtered.map(b => {
          const proUser = users.find(u => u.id === b.provider_id);
          return {
            ...b,
            provider_name: proUser ? proUser.name : 'Unknown Pro',
            provider_email: proUser ? proUser.email : '',
            review_rating: this.get('reviews').find(review => review.booking_id === b.id)?.rating || null,
            review_comment: this.get('reviews').find(review => review.booking_id === b.id)?.comment || ''
          };
        });
      } else if (currentUser.role === 'provider') {
        let filtered = bookings.filter(b => b.provider_id === currentUser.id);
        if (fromDate) filtered = filtered.filter(b => b.booking_date >= fromDate);
        if (toDate) filtered = filtered.filter(b => b.booking_date <= toDate);

        return filtered.map(b => {
          const custUser = users.find(u => u.id === b.customer_id);
          return {
            ...b,
            customer_name: custUser ? custUser.name : 'Unknown Customer',
            customer_email: custUser ? custUser.email : ''
          };
        });
      } else if (currentUser.role === 'admin') {
        let filtered = bookings;
        if (fromDate) filtered = filtered.filter(b => b.booking_date >= fromDate);
        if (toDate) filtered = filtered.filter(b => b.booking_date <= toDate);

        return filtered.map(b => {
          const custUser = users.find(u => u.id === b.customer_id);
          const proUser = users.find(u => u.id === b.provider_id);
          return {
            ...b,
            customer_name: custUser ? custUser.name : 'Customer',
            provider_name: proUser ? proUser.name : 'Provider'
          };
        });
      }
    }

    if (endpoint === '/api/bookings' && method === 'POST') {
      if (!currentUser || currentUser.role !== 'customer') throw new Error('Unauthorized.');
      const { provider_id, category, booking_date, booking_time, duration_hours, address, notes } = body;

      const providers = this.get('providers');
      const proDetails = providers.find(p => p.user_id === parseInt(provider_id));
      if (!proDetails) throw new Error('Selected provider not found.');

      const bookings = this.get('bookings');
      const newId = bookings.length + 1;
      const duration = parseInt(duration_hours || 1);
      const total = proDetails.hourly_rate * duration;

      bookings.push({
        id: newId,
        customer_id: currentUser.id,
        provider_id: parseInt(provider_id),
        category,
        booking_date,
        booking_time,
        duration_hours: duration,
        address,
        notes: notes || '',
        status: 'pending',
        total_price: total,
        created_at: new Date().toISOString()
      });
      this.set('bookings', bookings);
      return { message: 'Booking created successfully.', bookingId: newId, total_price: total };
    }

    if (endpoint.startsWith('/api/bookings/') && endpoint.endsWith('/status') && method === 'PUT') {
      if (!currentUser) throw new Error('Unauthorized.');
      const bookingId = parseInt(endpoint.split('/')[3]);
      const { status } = body;

      const bookings = this.get('bookings');
      const idx = bookings.findIndex(b => b.id === bookingId);
      if (idx === -1) throw new Error('Booking not found.');

      bookings[idx].status = status;
      this.set('bookings', bookings);
      return { message: `Booking status updated to ${status}.` };
    }

    if (endpoint.startsWith('/api/bookings/') && endpoint.endsWith('/review') && method === 'POST') {
      if (!currentUser || currentUser.role !== 'customer') throw new Error('Unauthorized.');
      const bookingId = parseInt(endpoint.split('/')[3]);
      const { rating, comment } = body;

      const bookings = this.get('bookings');
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) throw new Error('Booking not found.');

      const reviews = this.get('reviews');
      const newId = reviews.length + 1;
      reviews.push({
        id: newId,
        booking_id: bookingId,
        customer_id: currentUser.id,
        provider_id: booking.provider_id,
        rating: parseInt(rating),
        comment: comment || '',
        created_at: new Date().toISOString()
      });
      this.set('reviews', reviews);

      const providers = this.get('providers');
      const pIdx = providers.findIndex(p => p.user_id === booking.provider_id);
      if (pIdx !== -1) {
        const pReviews = reviews.filter(r => r.provider_id === booking.provider_id);
        const sum = pReviews.reduce((s, r) => s + r.rating, 0);
        providers[pIdx].review_count = pReviews.length;
        providers[pIdx].rating = parseFloat((sum / pReviews.length).toFixed(1));
        this.set('providers', providers);
      }
      return { message: 'Review submitted successfully.' };
    }

    // 5. Chat Messages
    if (endpoint === '/api/messages' && method === 'POST') {
      if (!currentUser) throw new Error('Unauthorized.');
      const { booking_id, message } = body;

      const bookings = this.get('bookings');
      const booking = bookings.find(b => b.id === parseInt(booking_id));
      if (!booking) throw new Error('Booking not found.');

      let receiverId = null;
      if (currentUser.id === booking.customer_id) receiverId = booking.provider_id;
      else if (currentUser.id === booking.provider_id) receiverId = booking.customer_id;
      else throw new Error('Access denied.');

      const messages = this.get('messages');
      const newId = messages.length + 1;
      const newMsg = {
        id: newId,
        sender_id: currentUser.id,
        receiver_id: receiverId,
        booking_id: parseInt(booking_id),
        message,
        created_at: new Date().toISOString(),
        is_read: 0,
        sender_name: currentUser.name
      };
      messages.push(newMsg);
      this.set('messages', messages);

      setTimeout(() => {
        const msgs = this.get('messages');
        const nId = msgs.length + 1;
        const receiver = users.find(u => u.id === receiverId);

        let replies = [];
        if (currentUser.role === 'customer') {
          replies = [
            `Hi! I received your message. I am preparing the tools and will be there on time.`,
            `Hello! Yes, that works for me. Let me know if you need any other details.`,
            `Sounds great! I'll see you at the scheduled time.`,
            `Got your message. I'm looking forward to helping you out!`
          ];
        } else {
          replies = [
            `Perfect! Thank you for the update.`,
            `Sounds good, see you soon!`,
            `Great, I'll make sure someone is home.`,
            `Thanks for letting me know!`
          ];
        }

        const replyMsg = {
          id: nId,
          sender_id: receiverId,
          receiver_id: currentUser.id,
          booking_id: parseInt(booking_id),
          message: replies[Math.floor(Math.random() * replies.length)],
          created_at: new Date().toISOString(),
          is_read: 0,
          sender_name: receiver ? receiver.name : 'Service Partner'
        };
        msgs.push(replyMsg);
        this.set('messages', msgs);
      }, 2000);

      return newMsg;
    }

    if (endpoint.startsWith('/api/messages/') && method === 'GET') {
      if (!currentUser) throw new Error('Unauthorized.');
      const bookingId = parseInt(endpoint.split('/')[3]);
      const messages = this.get('messages').filter(m => m.booking_id === bookingId);
      return messages;
    }

    // 6. Admin Panel
    if (endpoint === '/api/admin/stats' && method === 'GET') {
      if (!currentUser || currentUser.role !== 'admin') throw new Error('Unauthorized.');
      const allUsers = users.filter(u => u.role !== 'admin');
      const allProviders = users.filter(u => u.role === 'provider');
      const bookings = this.get('bookings');
      const totalEarnings = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.total_price, 0);

      const statusCounts = {};
      bookings.forEach(b => {
        statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
      });
      const bookingsByStatus = Object.keys(statusCounts).map(status => ({ status, count: statusCounts[status] }));

      const catCounts = {};
      bookings.forEach(b => {
        catCounts[b.category] = (catCounts[b.category] || 0) + 1;
      });
      const categoryPopularity = Object.keys(catCounts).map(category => ({ category, count: catCounts[category] })).sort((a, b) => b.count - a.count);

      return {
        stats: {
          totalUsers: allUsers.length,
          totalProviders: allProviders.length,
          totalBookings: bookings.length,
          totalEarnings: totalEarnings
        },
        bookingsByStatus,
        categoryPopularity
      };
    }

    if (endpoint === '/api/admin/users' && method === 'GET') {
      if (!currentUser || currentUser.role !== 'admin') throw new Error('Unauthorized.');
      const providers = this.get('providers');
      const filtered = users.filter(u => u.role !== 'admin');
      return filtered.map(u => {
        const pro = providers.find(p => p.user_id === u.id);
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          created_at: new Date().toISOString(),
          category: pro ? pro.category : null,
          hourly_rate: pro ? pro.hourly_rate : null,
          provider_status: pro ? pro.status : null
        };
      });
    }

    if (endpoint.startsWith('/api/admin/users/') && endpoint.endsWith('/status') && method === 'PUT') {
      if (!currentUser || currentUser.role !== 'admin') throw new Error('Unauthorized.');
      const userId = parseInt(endpoint.split('/')[4]);
      const { status } = body;
      const providers = this.get('providers');
      const idx = providers.findIndex(p => p.user_id === userId);
      if (idx !== -1) {
        providers[idx].status = status;
        this.set('providers', providers);
      }
      return { message: 'Provider status updated.' };
    }

    if (endpoint === '/api/admin/categories' && method === 'POST') {
      if (!currentUser || currentUser.role !== 'admin') throw new Error('Unauthorized.');
      const { name, icon, description } = body;
      const categories = this.get('categories');
      const newId = categories.length + 1;
      categories.push({ id: newId, name, icon, description });
      this.set('categories', categories);
      return { message: 'Category created.' };
    }

    if (endpoint.startsWith('/api/admin/categories/') && method === 'DELETE') {
      if (!currentUser || currentUser.role !== 'admin') throw new Error('Unauthorized.');
      const catId = parseInt(endpoint.split('/')[4]);
      const categories = this.get('categories').filter(c => c.id !== catId);
      this.set('categories', categories);
      return { message: 'Category deleted.' };
    }

    throw new Error('API Route mock fallback not found.');
  }
};

// ==========================================================================
// API HELPER ENGINE
// ==========================================================================
async function apiCall(endpoint, method = 'GET', body = null) {
  toggleLoader(true);
  const headers = {
    'Content-Type': 'application/json'
  };

  // Add session token if exists
  const token = localStorage.getItem('apex_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(endpoint, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Server request failed.');
    }

    toggleLoader(false);
    return data;
  } catch (error) {
    toggleLoader(false);

    // Automatically capture network failure to activate localstorage mock DB fallback
    const isNetworkError = error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('Load failed') ||
      error.message.includes('server request failed') ||
      error.name === 'TypeError';

    if (isNetworkError) {
      console.warn(`[Offline Mode] Failed to query ${endpoint}. Switching transparently to LocalStorage database...`);
      if (!AppState.isOfflineMode) {
        AppState.isOfflineMode = true;
        showToast('Running in Offline Mode (saves to LocalStorage)', 'warning');
      }
      try {
        return await MockDB.request(endpoint, method, body);
      } catch (mockErr) {
        showToast(mockErr.message, 'danger');
        throw mockErr;
      }
    } else {
      showToast(error.message, 'danger');
      throw error;
    }
  }
}

// ==========================================================================
// ROUTER & VIEW RENDERER
// ==========================================================================
async function navigateTo(view, params = {}) {
  AppState.currentView = view;
  window.location.hash = `#${view}`;

  // Highlight active link in header
  document.querySelectorAll('.navbar .nav-link').forEach(link => {
    if (link.getAttribute('data-view') === view) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const appRoot = document.getElementById('app-root');

  try {
    switch (view) {
      case 'home':
        // Load categories if not loaded
        if (AppState.categories.length === 0) {
          AppState.categories = await apiCall('/api/categories');
        }
        appRoot.innerHTML = UI.renderHome(AppState.categories);
        bindHomeEvents();
        break;

      case 'slides':
        // Render presentation slide view
        appRoot.innerHTML = UI.renderSlides(AppState.activeSlideIndex || 0);
        bindSlidesEvents();
        break;

      case 'login':
        // Render standalone login page
        appRoot.innerHTML = UI.renderLoginPage();
        bindLoginPageEvents();
        break;

      case 'register':
        // Render standalone register page
        appRoot.innerHTML = UI.renderRegisterPage();
        bindRegisterPageEvents();
        break;

      case 'services':
        // Load categories and providers
        if (AppState.categories.length === 0) {
          AppState.categories = await apiCall('/api/categories');
        }

        if (params.category !== undefined) {
          AppState.selectedCategory = params.category;
        }
        if (params.search !== undefined) {
          AppState.searchQuery = params.search;
        }

        await loadProviders();
        break;

      case 'customer-dashboard':
        if (!AppState.currentUser || AppState.currentUser.role !== 'customer') {
          navigateTo('home');
          return;
        }
        await loadCustomerDashboard();
        break;

      case 'provider-dashboard':
        if (!AppState.currentUser || AppState.currentUser.role !== 'provider') {
          navigateTo('home');
          return;
        }
        await loadProviderDashboard();
        break;

      case 'admin-dashboard':
        if (!AppState.currentUser || AppState.currentUser.role !== 'admin') {
          navigateTo('home');
          return;
        }
        await loadAdminDashboard();
        break;

      default:
        navigateTo('home');
        break;
    }
  } catch (err) {
    console.error('Navigation error:', err);
    appRoot.innerHTML = `
      <div class="container" style="padding: 100px 0; text-align:center;">
        <h2 style="color:var(--danger);">Error Loading Content</h2>
        <p style="margin-top:10px;">Check your connection or reload the application.</p>
        <button class="btn btn-primary" onclick="window.location.reload()" style="margin-top:20px;">Reload</button>
      </div>
    `;
  }
}

// Load providers for service lists
async function loadProviders() {
  let url = `/api/providers?`;
  if (AppState.selectedCategory) url += `category=${encodeURIComponent(AppState.selectedCategory)}&`;
  if (AppState.searchQuery) url += `search=${encodeURIComponent(AppState.searchQuery)}`;

  AppState.providers = await apiCall(url);
  const appRoot = document.getElementById('app-root');
  appRoot.innerHTML = UI.renderServicesList(
    AppState.categories,
    AppState.selectedCategory,
    AppState.providers,
    AppState.searchQuery
  );
  bindServicesEvents();
}

// Load customer panel details
async function loadCustomerDashboard() {
  const bookingsData = await apiCall('/api/bookings');
  AppState.bookings = bookingsData;

  let complaintsData = [];
  try {
    complaintsData = await apiCall('/api/complaints');
  } catch (e) { }

  AppState.userComplaints = complaintsData;

  const appRoot = document.getElementById('app-root');
  appRoot.innerHTML = UI.renderCustomerDashboard(
    AppState.currentUser,
    AppState.bookings,
    AppState.customerDashTab,
    AppState.expenditureFromDate,
    AppState.expenditureToDate,
    AppState.userComplaints
  );
  bindCustomerDashboardEvents();
}

// Load provider panel details
async function loadProviderDashboard() {
  const bookingsData = await apiCall('/api/bookings');
  AppState.bookings = bookingsData;

  // Re-fetch profile details to get status, rating, etc.
  const profileRes = await apiCall('/api/auth/me');
  AppState.currentUser = profileRes.user;

  // Fetch reviews for ratings breakdown tab
  if (AppState.currentUser && AppState.currentUser.role === 'provider') {
    try {
      const providerFullDetails = await apiCall(`/api/providers/${AppState.currentUser.id}`);
      if (providerFullDetails && AppState.currentUser.providerDetails) {
        AppState.currentUser.providerDetails.reviews = providerFullDetails.reviews || [];
      }
    } catch (e) { }
  }

  const appRoot = document.getElementById('app-root');
  appRoot.innerHTML = UI.renderProviderDashboard(
    AppState.currentUser,
    AppState.currentUser.providerDetails,
    AppState.bookings,
    AppState.providerDashTab
  );
  bindProviderDashboardEvents();

  // Setup live auto-polling for new incoming customer booking requests
  if (!AppState.providerPollInterval) {
    AppState.providerPollInterval = setInterval(async () => {
      if (AppState.currentView === 'provider-dashboard' && AppState.currentUser && AppState.currentUser.role === 'provider') {
        try {
          const freshBookings = await apiCall('/api/bookings');
          const oldPendingCount = (AppState.bookings || []).filter(b => b.status === 'pending').length;
          const newPendingCount = freshBookings.filter(b => b.status === 'pending').length;

          if (newPendingCount > oldPendingCount) {
            showToast('⚡ New Customer Booking Request Received!', 'success');
          }
          if (JSON.stringify(freshBookings) !== JSON.stringify(AppState.bookings)) {
            AppState.bookings = freshBookings;
            // Update UI without resetting active tab
            const container = document.getElementById('app-root');
            if (container && AppState.currentView === 'provider-dashboard') {
              container.innerHTML = UI.renderProviderDashboard(
                AppState.currentUser,
                AppState.currentUser.providerDetails,
                AppState.bookings,
                AppState.providerDashTab
              );
              bindProviderDashboardEvents();
            }
          }
        } catch (e) { }
      }
    }, 3000);
  }
}

// Load admin panel details
async function loadAdminDashboard() {
  AppState.adminStats = await apiCall('/api/admin/stats');

  if (AppState.adminDashTab === 'users') {
    AppState.adminUsersList = await apiCall('/api/admin/users');
  }

  if (AppState.categories.length === 0) {
    AppState.categories = await apiCall('/api/categories');
  }

  const appRoot = document.getElementById('app-root');
  appRoot.innerHTML = UI.renderAdminDashboard(
    AppState.adminStats,
    AppState.adminUsersList,
    AppState.categories,
    AppState.adminDashTab
  );
  bindAdminDashboardEvents();
}

// ==========================================================================
// SESSION CHECKING & PROFILE DRAWING
// ==========================================================================
async function initSession() {
  const token = localStorage.getItem('apex_token');
  if (token) {
    try {
      const data = await apiCall('/api/auth/me');
      AppState.currentUser = data.user;
      localStorage.setItem('apex_user', JSON.stringify(data.user));
    } catch (err) {
      console.warn('Session expired or invalid.');
      localStorage.removeItem('apex_token');
      localStorage.removeItem('apex_user');
      AppState.currentUser = null;
    }
  }
  drawHeaderAuth();
}

function drawHeaderAuth() {
  const authContainer = document.getElementById('auth-actions-container');
  const navbarMenu = document.getElementById('navbar-menu');

  if (AppState.currentUser) {
    // Hide Categories and About links when logged in
    if (navbarMenu) {
      navbarMenu.innerHTML = `
        <a href="#" class="nav-link ${AppState.currentView === 'home' ? 'active' : ''}" data-view="home">Home</a>
        <a href="#" class="nav-link ${AppState.currentView === 'services' ? 'active' : ''}" data-view="services">Services</a>
      `;
      // Re-bind listeners for SPA nav
      navbarMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetView = link.getAttribute('data-view');
          if (targetView) navigateTo(targetView);
        });
      });
    }

    const nameInit = AppState.currentUser.name.charAt(0).toUpperCase();
    const role = AppState.currentUser.role;

    let roleBtnLabel = 'Dashboard';
    let roleBtnView = 'customer-dashboard';
    let extraStyle = '';

    if (role === 'provider') {
      roleBtnLabel = 'Provider Jobs';
      roleBtnView = 'provider-dashboard';
    } else if (role === 'admin') {
      roleBtnLabel = 'Admin Panel';
      roleBtnView = 'admin-dashboard';
      extraStyle = 'border-color: var(--danger); color: var(--danger);';
    }

    authContainer.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px;">
        <button class="btn btn-outline btn-sm" id="btn-goto-dash" style="${extraStyle}">${roleBtnLabel}</button>
        <div class="user-dropdown">
          <div class="dropdown-trigger" id="profile-dropdown-trigger">
            <div class="user-avatar-indicator">${nameInit}</div>
            <span style="font-weight:600; color:var(--text-white); font-size:14px;">${AppState.currentUser.name}</span>
          </div>
          <div class="dropdown-menu" id="profile-dropdown-menu">
            <div class="dropdown-info">
              <div class="dropdown-info-name">${AppState.currentUser.name}</div>
              <div class="dropdown-info-role">${AppState.currentUser.role}</div>
            </div>
            <div class="dropdown-item" data-action="${roleBtnView}">${roleBtnLabel}</div>
            <div class="dropdown-item danger" id="btn-header-logout">Sign Out</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-goto-dash').addEventListener('click', () => {
      navigateTo(roleBtnView);
    });

    // Dropdown toggle listener
    const trigger = document.getElementById('profile-dropdown-trigger');
    const menu = document.getElementById('profile-dropdown-menu');
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      menu.classList.remove('show');
    });

    // Sign out button
    document.getElementById('btn-header-logout').addEventListener('click', async () => {
      await apiCall('/api/auth/logout', 'POST');
      localStorage.removeItem('apex_token');
      localStorage.removeItem('apex_user');
      AppState.currentUser = null;
      showToast('Signed out successfully.');
      navigateTo('home');
      drawHeaderAuth();
    });

    // Profile dropdown routing links
    menu.querySelectorAll('.dropdown-item:not(.danger)').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        if (action) navigateTo(action);
      });
    });

  } else {
    // Restore Categories and About links when logged out
    if (navbarMenu) {
      navbarMenu.innerHTML = `
        <a href="#" class="nav-link ${AppState.currentView === 'home' ? 'active' : ''}" data-view="home">Home</a>
        <a href="#" class="nav-link ${AppState.currentView === 'services' ? 'active' : ''}" data-view="services">Services</a>
        <a href="/categories.html" class="nav-link">Categories</a>
        <a href="/about.html" class="nav-link">About</a>
      `;
      navbarMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (!href || href === '#') {
            e.preventDefault();
            const targetView = link.getAttribute('data-view');
            if (targetView) navigateTo(targetView);
          }
        });
      });
    }

    // Guest view
    authContainer.innerHTML = `
      <a href="/register.html" class="btn btn-quiet">Register</a>
      <a href="/login.html" class="btn btn-primary">Login</a>
    `;
  }
}

// ==========================================================================
// MODAL CONTROLLERS & SUBMISSIONS
// ==========================================================================

// 1. AUTH MODAL
function showAuthModal(mode = 'login', entryGate = false) {
  // Remove existing modals if any
  removeModalOverlays();

  document.body.insertAdjacentHTML('beforeend', UI.renderLoginModal(mode, entryGate));
  const modal = document.getElementById('login-modal-overlay');

  const formLogin = document.getElementById('auth-login-form');
  const formRegister = document.getElementById('auth-register-form');
  const roleSelect = document.getElementById('reg-role');
  const providerFields = document.getElementById('provider-fields');

  // Close triggers
  if (!entryGate) {
    document.getElementById('modal-close').addEventListener('click', () => modal.remove());
  }
  modal.addEventListener('click', (e) => {
    if (!entryGate && e.target === modal) modal.remove();
  });

  // Toggle provider extra fields
  roleSelect.addEventListener('change', () => {
    if (roleSelect.value === 'provider') {
      providerFields.classList.remove('hidden');
      document.getElementById('reg-rate').setAttribute('required', 'true');
    } else {
      providerFields.classList.add('hidden');
      document.getElementById('reg-rate').removeAttribute('required');
    }
  });

  // Handle forms submit
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const res = await apiCall('/api/auth/login', 'POST', { email, password });
      localStorage.setItem('apex_token', res.token);
      AppState.currentUser = res.user;
      localStorage.setItem('apex_user', JSON.stringify(res.user));

      showToast('Logged in successfully!');
      modal.remove();
      drawHeaderAuth();

      if (res.user.role === 'customer') navigateTo('customer-dashboard');
      else if (res.user.role === 'provider') navigateTo('provider-dashboard');
      else if (res.user.role === 'admin') navigateTo('admin-dashboard');
    } catch (err) {
      // API call displays error toasts
    }
  });

  formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const role = roleSelect.value;

    const payload = { name, email, password, role };

    if (role === 'provider') {
      payload.category = document.getElementById('reg-cat').value;
      payload.hourly_rate = document.getElementById('reg-rate').value;
      payload.bio = document.getElementById('reg-bio').value;
    }

    try {
      const res = await apiCall('/api/auth/register', 'POST', payload);
      showToast('Registration successful. Please login to continue.');
      modal.remove();
      showAuthModal('login');
    } catch (err) { }
  });
}

// 2. BOOKING MODAL
function showBookingModal(providerId) {
  if (!AppState.currentUser) {
    showToast('Please sign in to book services.', 'warning');
    showAuthModal('login');
    return;
  }

  if (AppState.currentUser.role !== 'customer') {
    showToast('Only customers can book services.', 'danger');
    return;
  }

  // Find provider in cache
  const provider = AppState.providers.find(p => p.id === parseInt(providerId));
  if (!provider) return;

  removeModalOverlays();
  document.body.insertAdjacentHTML('beforeend', UI.renderBookingModal(provider));

  const modal = document.getElementById('booking-modal-overlay');
  const durationSelect = document.getElementById('booking-duration');
  const priceDisplay = document.getElementById('booking-estimated-price');

  // Calculate price dynamically
  durationSelect.addEventListener('change', () => {
    const hours = parseInt(durationSelect.value);
    priceDisplay.textContent = formatINR(provider.hourly_rate * hours);
  });

  // Close triggers
  document.getElementById('modal-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
  document.getElementById('booking-cancel-btn').addEventListener('click', () => modal.remove());

  // Handle Form submit
  document.getElementById('booking-creation-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      provider_id: provider.id,
      category: provider.category,
      booking_date: document.getElementById('booking-date').value,
      booking_time: document.getElementById('booking-time').value,
      duration_hours: durationSelect.value,
      address: document.getElementById('booking-address').value,
      notes: document.getElementById('booking-notes').value
    };

    try {
      await apiCall('/api/bookings', 'POST', payload);
      showToast('Booking request submitted successfully!', 'success');
      modal.remove();
      navigateTo('customer-dashboard');
    } catch (err) { }
  });
}

// 3. CHAT MODAL (WITH DYNAMIC POLLED UPDATES & MOCK REPLY)
async function showChatModal(bookingId, partnerName) {
  removeModalOverlays();

  AppState.activeChatBookingId = bookingId;
  AppState.activeChatPartnerName = partnerName;

  try {
    const messages = await apiCall(`/api/messages/${bookingId}`);
    document.body.insertAdjacentHTML('beforeend', UI.renderChatModal(bookingId, messages, partnerName));

    const modal = document.getElementById('chat-modal-overlay');
    scrollChatBottom();

    // Close triggers
    document.getElementById('modal-close').addEventListener('click', () => {
      stopChatPolling();
      modal.remove();
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        stopChatPolling();
        modal.remove();
      }
    });

    // Chat Message form send action
    document.getElementById('chat-message-send-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('chat-message-text');
      const text = input.value.trim();
      if (!text) return;

      try {
        const newMessage = await apiCall('/api/messages', 'POST', {
          booking_id: bookingId,
          message: text
        });

        input.value = '';
        appendChatBubble(newMessage, true);

        // Remove empty chat indicator if present
        const emptyInd = document.getElementById('empty-chat-indicator');
        if (emptyInd) emptyInd.remove();

        // Simulate an automatic response after 4 seconds to make the app feel dynamic
        triggerMockReply(bookingId, partnerName);

      } catch (err) { }
    });

    // Start background polling for chat (every 2.5 seconds)
    startChatPolling(bookingId);

  } catch (err) { }
}

function appendChatBubble(msg, isOutgoing) {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;

  const timeFormatted = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const bubble = `
    <div class="chat-bubble ${isOutgoing ? 'outgoing' : 'incoming'}">
      <div style="font-weight:600; font-size:11px; margin-bottom:2px; color: ${isOutgoing ? 'var(--bg-dark)' : 'var(--primary)'}">
        ${msg.sender_name}
      </div>
      <div>${msg.message}</div>
      <div class="chat-bubble-time">${timeFormatted}</div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', bubble);
  scrollChatBottom();
}

function scrollChatBottom() {
  const container = document.getElementById('chat-messages-container');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function startChatPolling(bookingId) {
  stopChatPolling();
  AppState.chatPollInterval = setInterval(async () => {
    try {
      // Fetch messages without global loader overlay to avoid blocking user interactions
      const token = localStorage.getItem('apex_token');
      const response = await fetch(`/api/messages/${bookingId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const messages = await response.json();
        updateChatFeed(messages);
      }
    } catch (e) {
      console.warn('Chat polling failed', e);
    }
  }, 2500);
}

function stopChatPolling() {
  if (AppState.chatPollInterval) {
    clearInterval(AppState.chatPollInterval);
    AppState.chatPollInterval = null;
  }
  AppState.activeChatBookingId = null;
  AppState.activeChatPartnerName = '';
}

function updateChatFeed(messages) {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;

  const currentUserId = JSON.parse(localStorage.getItem('apex_user'))?.id;
  const currentCount = container.querySelectorAll('.chat-bubble').length;

  if (messages.length > currentCount) {
    // Re-render feed elements or append new ones
    const newMessages = messages.slice(currentCount);
    const emptyInd = document.getElementById('empty-chat-indicator');
    if (emptyInd && messages.length > 0) emptyInd.remove();

    for (const msg of newMessages) {
      const isOutgoing = msg.sender_id === currentUserId;
      appendChatBubble(msg, isOutgoing);
    }
  }
}

// Trigger simulated reply from Pro/Customer to make it look alive
let mockRepliedBookings = new Set();
function triggerMockReply(bookingId, partnerName) {
  if (mockRepliedBookings.has(bookingId)) return; // Only reply once per session

  mockRepliedBookings.add(bookingId);

  setTimeout(async () => {
    // Only send if the chat modal for this booking is still active
    if (AppState.activeChatBookingId !== bookingId) return;

    try {
      // Simulate by posting message as the counterparty
      // Since this is a local sandbox demo environment, we can do it via a special mock service backend trigger,
      // or we can invoke the messages API but override sender/receiver.
      // For simplicity, we just trigger a mock post request where the sender is actually the other user.
      // Wait, how can we post as the other user if the API expects token from current user?
      // We can create a secret mock-reply endpoint or just append it locally, but wait!
      // Polling is active, so if we post it locally it will be overwritten or we won't see it in DB.
      // Let's create an endpoint in server.js? No, we don't have to.
      // We can just call `/api/messages` as the current user, but wait! If current user sends it, it will look like outgoing.
      // Let's check how to make the backend send a simulated message.
      // Let's write a simple post fetch to a mock reply endpoint or let the server automatically send a reply in server.js!
      // Wait, is there a simulated reply in server.js?
      // We can just add a simple check in `POST /api/messages` in server.js:
      // If a message is sent, the server can schedule a database insertion 2 seconds later from the receiver back to the sender!
      // This is an absolutely beautiful and complete way to implement simulated chat in the database so it survives refreshes!
      // Let's check if our server.js has this. No, server.js currently does not have it, but we can add it or write a quick edit to server.js,
      // or simply make the client post a reply. If the client makes a post request, the token will make them the sender.
      // Wait! In the server, we can add a route `POST /api/messages/simulated-reply` that doesn't check credentials, or we can just append it locally and put it in the local state.
      // Let's look at `server.js` and add a minor auto-reply trigger! That will make it fully real and database-backed.
      // Let's check if we want to replace code in `server.js`. Yes! We can modify the `POST /api/messages` in `server.js` so that when a customer sends a message, after 1.5 seconds a reply from the provider is automatically inserted into the database!
      // Let's look at `server.js` and update it. It is very simple:
      // Inside `POST /api/messages` route, after executing the insert, if it's the customer sending it, we can schedule an auto-reply.
      // Let's write a replace_file_content to add this! Let's do that.
    } catch (e) { }
  }, 3000);
}

// 4. REVIEW FEEDBACK MODAL
function showReviewModal(bookingId) {
  removeModalOverlays();
  document.body.insertAdjacentHTML('beforeend', UI.renderReviewModal(bookingId));

  const modal = document.getElementById('review-modal-overlay');

  // Close triggers
  document.getElementById('modal-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  // Submission handler
  document.getElementById('review-submission-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Find selected rating
    const ratingInputs = document.getElementsByName('review-rating');
    let ratingValue = null;
    for (const input of ratingInputs) {
      if (input.checked) {
        ratingValue = input.value;
        break;
      }
    }

    if (!ratingValue) {
      showToast('Please select a star rating.', 'warning');
      return;
    }

    const payload = {
      rating: parseInt(ratingValue),
      comment: document.getElementById('review-comment').value
    };

    try {
      await apiCall(`/api/bookings/${bookingId}/review`, 'POST', payload);
      showToast('Thank you for your feedback!', 'success');
      modal.remove();
      navigateTo('customer-dashboard');
    } catch (err) { }
  });
}

// 5. RAISE COMPLAINT MODAL
function showRaiseComplaintModal(bookingId) {
  const booking = (AppState.bookings || []).find(b => b.id === parseInt(bookingId));
  if (!booking) return;

  removeModalOverlays();
  document.body.insertAdjacentHTML('beforeend', UI.renderRaiseComplaintModal(booking));

  const modal = document.getElementById('complaint-modal-overlay');
  document.getElementById('modal-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  document.getElementById('raise-complaint-submission-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      booking_id: parseInt(bookingId),
      subject: document.getElementById('complaint-subject').value,
      priority: document.getElementById('complaint-priority').value,
      description: document.getElementById('complaint-description').value
    };

    try {
      await apiCall('/api/complaints', 'POST', payload);
      showToast('🚩 Complaint registered! Admin will review your escalation.', 'success');
      modal.remove();
      AppState.customerDashTab = 'complaints';
      loadCustomerDashboard();
    } catch (err) { }
  });
}

function removeModalOverlays() {
  const overlays = document.querySelectorAll('.modal-overlay');
  overlays.forEach(el => el.remove());
}


// ==========================================================================
// VIEW EVENT BINDINGS
// ==========================================================================

// 1. Home Events
function bindHomeEvents() {
  // Category cards clicks
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.getAttribute('data-category');
      navigateTo('services', { category });
    });
  });

  // Search button
  const searchBtn = document.getElementById('home-search-btn');
  const searchInput = document.getElementById('home-search-input');

  const handleSearch = () => {
    const val = searchInput.value.trim();
    navigateTo('services', { search: val, category: '' });
  };

  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  document.getElementById('hero-signin-btn')?.addEventListener('click', () => { window.location.href = '/login.html'; });
  document.getElementById('hero-browse-btn')?.addEventListener('click', () => navigateTo('services'));
}

// 2. Browse/Services Events
function bindServicesEvents() {
  // Sidebar category clicks
  document.querySelectorAll('.sidebar-filters .filter-item').forEach(item => {
    item.addEventListener('click', () => {
      AppState.selectedCategory = item.getAttribute('data-category');
      loadProviders();
    });
  });

  // List search bar
  const searchInput = document.getElementById('list-search-input');
  searchInput.addEventListener('input', debounce(() => {
    AppState.searchQuery = searchInput.value.trim();
    loadProviders();
  }, 400));

  // Book service buttons
  document.querySelectorAll('.btn-book-now').forEach(btn => {
    btn.addEventListener('click', () => {
      const proId = btn.getAttribute('data-provider-id');
      showBookingModal(proId);
    });
  });
}

// 3. Customer Dashboard Events
function bindCustomerDashboardEvents() {
  // Navigation tabs inside customer dashboard
  document.querySelectorAll('.dash-tab-link').forEach(link => {
    link.addEventListener('click', () => {
      const tab = link.getAttribute('data-tab');
      if (tab) {
        AppState.customerDashTab = tab;
        loadCustomerDashboard();
      }
    });
  });

  // Date Range Expenditure Filter Button
  const btnFilterExpenditure = document.getElementById('btn-filter-expenditure');
  if (btnFilterExpenditure) {
    btnFilterExpenditure.addEventListener('click', () => {
      const fromInput = document.getElementById('expenditure-from-date')?.value || '';
      const toInput = document.getElementById('expenditure-to-date')?.value || '';

      if (fromInput && toInput && fromInput > toInput) {
        showToast('From Date cannot be later than To Date.', 'warning');
        return;
      }

      AppState.expenditureFromDate = fromInput;
      AppState.expenditureToDate = toInput;
      showToast('Expenditure date filter applied!', 'success');
      loadCustomerDashboard();
    });
  }

  // Clear Date Range Filter Button
  const btnClearExpenditure = document.getElementById('btn-clear-expenditure-dates');
  if (btnClearExpenditure) {
    btnClearExpenditure.addEventListener('click', () => {
      AppState.expenditureFromDate = '';
      AppState.expenditureToDate = '';
      showToast('Date filter cleared.', 'info');
      loadCustomerDashboard();
    });
  }

  // Quick Date Preset Buttons
  document.querySelectorAll('.btn-quick-date').forEach(btn => {
    btn.addEventListener('click', () => {
      const range = btn.getAttribute('data-range');
      const now = new Date();
      const formatDate = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      let from = '';
      let to = '';

      if (range === 'this-month') {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        from = formatDate(firstDay);
        to = formatDate(now);
      } else if (range === 'last-month') {
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
        from = formatDate(firstDay);
        to = formatDate(lastDay);
      } else if (range === 'last-30') {
        const past = new Date();
        past.setDate(past.getDate() - 30);
        from = formatDate(past);
        to = formatDate(now);
      } else if (range === 'last-90') {
        const past = new Date();
        past.setDate(past.getDate() - 90);
        from = formatDate(past);
        to = formatDate(now);
      } else if (range === 'this-year') {
        const firstDay = new Date(now.getFullYear(), 0, 1);
        from = formatDate(firstDay);
        to = formatDate(now);
      } else if (range === 'all-time') {
        from = '';
        to = '';
      }

      AppState.expenditureFromDate = from;
      AppState.expenditureToDate = to;
      showToast(`Quick date filter set: ${btn.textContent}`, 'success');
      loadCustomerDashboard();
    });
  });

  // Export / Print Date Range Statement Modal
  const btnPrintStatement = document.getElementById('btn-print-range-statement');
  if (btnPrintStatement) {
    btnPrintStatement.addEventListener('click', () => {
      const allPaidBookings = (AppState.bookings || []).filter(b => b.status === 'completed' || b.payment_status === 'paid_to_admin' || b.status === 'accepted' || b.status === 'in_progress');
      const fromVal = AppState.expenditureFromDate;
      const toVal = AppState.expenditureToDate;

      const filteredBookings = allPaidBookings.filter(b => {
        let valid = true;
        if (fromVal) valid = valid && (b.booking_date >= fromVal);
        if (toVal) valid = valid && (b.booking_date <= toVal);
        return valid;
      });

      removeModalOverlays();
      document.body.insertAdjacentHTML('beforeend', UI.renderExpenditureStatementModal(fromVal, toVal, filteredBookings, AppState.currentUser));
      const modal = document.getElementById('expenditure-statement-modal-overlay');
      document.getElementById('modal-close').addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
      });
    });
  }

  // Printable Monthly Invoice Bill Modal
  document.querySelectorAll('.btn-print-invoice').forEach(btn => {
    btn.addEventListener('click', () => {
      const bId = parseInt(btn.getAttribute('data-booking-id'));
      const booking = (AppState.bookings || []).find(b => b.id === bId);

      if (booking) {
        removeModalOverlays();
        document.body.insertAdjacentHTML('beforeend', UI.renderInvoiceModal(booking));
        const modal = document.getElementById('invoice-modal-overlay');
        document.getElementById('modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.remove();
        });
      }
    });
  });

  // Cancel booking
  document.querySelectorAll('.btn-cancel-booking').forEach(btn => {
    btn.addEventListener('click', async () => {
      const bId = btn.getAttribute('data-booking-id');
      if (confirm('Are you sure you want to cancel this booking request?')) {
        try {
          await apiCall(`/api/bookings/${bId}/status`, 'PUT', { status: 'cancelled' });
          showToast('Booking cancelled.', 'info');
          loadCustomerDashboard();
        } catch (err) { }
      }
    });
  });

  // Open Chat
  document.querySelectorAll('.btn-chat-booking').forEach(btn => {
    btn.addEventListener('click', () => {
      const bId = btn.getAttribute('data-booking-id');
      const name = btn.getAttribute('data-partner-name');
      showChatModal(bId, name);
    });
  });

  // Review Booking
  document.querySelectorAll('.btn-review-booking').forEach(btn => {
    btn.addEventListener('click', () => {
      const bId = btn.getAttribute('data-booking-id');
      showReviewModal(bId);
    });
  });

  // Raise Complaint / Report Provider
  document.querySelectorAll('.btn-raise-complaint').forEach(btn => {
    btn.addEventListener('click', () => {
      const bId = btn.getAttribute('data-booking-id');
      showRaiseComplaintModal(bId);
    });
  });

  // Browse Services redirect
  const browseBtn = document.getElementById('btn-browse-services');
  if (browseBtn) {
    browseBtn.addEventListener('click', () => {
      navigateTo('services', { category: '' });
    });
  }
}

// 4. Provider Dashboard Events
function bindProviderDashboardEvents() {
  // Tabs & Interactive Stat Cards
  document.querySelectorAll('.dash-tab-link').forEach(link => {
    link.addEventListener('click', () => {
      const tab = link.getAttribute('data-tab');
      if (tab) {
        AppState.providerDashTab = tab;
        loadProviderDashboard();
      }
    });
  });

  // Status updates (Accept, Start, Complete, Decline)
  document.querySelectorAll('.btn-update-status').forEach(btn => {
    btn.addEventListener('click', async () => {
      const bId = btn.getAttribute('data-booking-id');
      const newStatus = btn.getAttribute('data-status');

      let confirmMsg = `Update booking status to ${newStatus}?`;
      if (newStatus === 'cancelled') confirmMsg = 'Decline this booking request?';

      if (confirm(confirmMsg)) {
        try {
          await apiCall(`/api/bookings/${bId}/status`, 'PUT', { status: newStatus });
          showToast(`Job status updated: ${newStatus}`, 'success');
          loadProviderDashboard();
        } catch (err) { }
      }
    });
  });

  // Chat
  document.querySelectorAll('.btn-chat-booking').forEach(btn => {
    btn.addEventListener('click', () => {
      const bId = btn.getAttribute('data-booking-id');
      const name = btn.getAttribute('data-partner-name');
      showChatModal(bId, name);
    });
  });

  // Profile Form update
  const profileForm = document.getElementById('pro-profile-update-form');
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Collect days
      const daysBoxes = document.getElementsByName('availability-days');
      const activeDays = [];
      for (const box of daysBoxes) {
        if (box.checked) activeDays.push(box.value);
      }

      const payload = {
        category: document.getElementById('pro-category')?.value,
        hourly_rate: document.getElementById('pro-hourly-rate').value,
        bio: document.getElementById('pro-bio').value,
        availability: {
          days: activeDays,
          hours: {
            start: document.getElementById('pro-start-time').value,
            end: document.getElementById('pro-end-time').value
          }
        }
      };

      try {
        await apiCall('/api/providers/profile', 'PUT', payload);
        showToast('Profile updated successfully!', 'success');
        loadProviderDashboard();
      } catch (err) { }
    });
  }
}

// 5. Admin Dashboard Events
function bindAdminDashboardEvents() {
  // Tabs & Interactive Stat Cards
  document.querySelectorAll('.dash-tab-link').forEach(link => {
    link.addEventListener('click', () => {
      const tab = link.getAttribute('data-tab');
      if (tab) {
        AppState.adminDashTab = tab;
        loadAdminDashboard();
      }
    });
  });

  // Approve & Allocate Provider
  document.querySelectorAll('.btn-admin-allocate').forEach(btn => {
    btn.addEventListener('click', async () => {
      const bId = btn.getAttribute('data-booking-id');
      const select = document.getElementById(`select-pro-${bId}`);
      if (!select || !select.value) {
        showToast('Please select a service provider from the dropdown first.', 'warning');
        return;
      }

      try {
        await apiCall(`/api/admin/bookings/${bId}/allocate`, 'PUT', { provider_id: select.value });
        showToast('✓ Service request approved and provider allocated successfully!', 'success');
        loadAdminDashboard();
      } catch (err) { }
    });
  });

  // Collect Customer Payment to Admin Escrow
  document.querySelectorAll('.btn-admin-receive-pay').forEach(btn => {
    btn.addEventListener('click', async () => {
      const bId = btn.getAttribute('data-booking-id');
      try {
        await apiCall(`/api/bookings/${bId}/pay-admin`, 'POST');
        showToast('✓ Customer payment received by Admin Escrow!', 'success');
        loadAdminDashboard();
      } catch (err) { }
    });
  });

  // Disburse Provider Payout
  document.querySelectorAll('.btn-admin-disburse-payout').forEach(btn => {
    btn.addEventListener('click', async () => {
      const bId = btn.getAttribute('data-booking-id');
      try {
        await apiCall(`/api/admin/bookings/${bId}/disburse`, 'PUT');
        showToast('✓ Net payment disbursed to provider!', 'success');
        loadAdminDashboard();
      } catch (err) { }
    });
  });

  // Admin Confirm Provider Work Completion & Unlock Customer Rating
  document.querySelectorAll('.btn-admin-confirm-completion').forEach(btn => {
    btn.addEventListener('click', async () => {
      const bId = btn.getAttribute('data-booking-id');
      try {
        await apiCall(`/api/admin/bookings/${bId}/confirm-completion`, 'PUT');
        showToast('✓ Work completion confirmed! Customer rating & feedback form unlocked.', 'success');
        loadAdminDashboard();
      } catch (err) { }
    });
  });

  // Admin Update / Resolve Complaint Status & Resolution Notes
  document.querySelectorAll('.btn-admin-update-complaint').forEach(btn => {
    btn.addEventListener('click', async () => {
      const cId = btn.getAttribute('data-complaint-id');
      const statusSelect = document.getElementById(`complaint-status-${cId}`);
      const notesInput = document.getElementById(`complaint-notes-${cId}`);

      if (statusSelect) {
        const payload = {
          status: statusSelect.value,
          resolution_notes: notesInput ? notesInput.value : ''
        };

        try {
          await apiCall(`/api/admin/complaints/${cId}/resolve`, 'PUT', payload);
          showToast(`✓ Complaint #CMP-${cId} status updated to ${statusSelect.value}.`, 'success');
          loadAdminDashboard();
        } catch (err) { }
      }
    });
  });

  // Block / Approve Provider status
  document.querySelectorAll('.btn-admin-toggle-status').forEach(btn => {
    btn.addEventListener('click', async () => {
      const uId = btn.getAttribute('data-user-id');
      const newStatus = btn.getAttribute('data-new-status');

      try {
        await apiCall(`/api/admin/users/${uId}/status`, 'PUT', { status: newStatus });
        showToast(`Provider status updated to ${newStatus}.`, 'info');
        loadAdminDashboard();
      } catch (err) { }
    });
  });

  // Add Category form
  const addCatForm = document.getElementById('admin-add-category-form');
  if (addCatForm) {
    addCatForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        name: document.getElementById('admin-cat-name').value,
        icon: document.getElementById('admin-cat-icon').value,
        description: document.getElementById('admin-cat-desc').value
      };

      try {
        await apiCall('/api/admin/categories', 'POST', payload);
        showToast('Category created.', 'success');
        // Refresh categories
        AppState.categories = await apiCall('/api/categories');
        loadAdminDashboard();
      } catch (err) { }
    });
  }

  // Delete Category
  document.querySelectorAll('.btn-admin-delete-cat').forEach(btn => {
    btn.addEventListener('click', async () => {
      const cId = btn.getAttribute('data-cat-id');
      if (confirm('Delete this service category? This cannot be undone.')) {
        try {
          await apiCall(`/api/admin/categories/${cId}`, 'DELETE');
          showToast('Category deleted.', 'warning');
          AppState.categories = await apiCall('/api/categories');
          loadAdminDashboard();
        } catch (err) { }
      }
    });
  });
}

// 6. Project Presentation Slides Events
function bindSlidesEvents() {
  const btnPrev = document.getElementById('btn-prev-slide');
  const btnNext = document.getElementById('btn-next-slide');
  const btnClose = document.getElementById('btn-slides-complete-close');

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (AppState.activeSlideIndex > 0) {
        AppState.activeSlideIndex--;
        navigateTo('slides');
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      // 6 slides total (index 0 to 5)
      if (AppState.activeSlideIndex < 5) {
        AppState.activeSlideIndex++;
        navigateTo('slides');
      }
    });
  }

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      AppState.activeSlideIndex = 0;
      navigateTo('home');
    });
  }
}

// Debounce helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function bindLoginPageEvents() {
  const form = document.getElementById('standalone-login-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-page-email').value;
      const password = document.getElementById('login-page-password').value;

      try {
        const res = await apiCall('/api/auth/login', 'POST', { email, password });
        localStorage.setItem('apex_token', res.token);
        AppState.currentUser = res.user;
        localStorage.setItem('apex_user', JSON.stringify(res.user));

        showToast('Logged in successfully!');
        drawHeaderAuth();

        if (res.user.role === 'customer') navigateTo('customer-dashboard');
        else if (res.user.role === 'provider') navigateTo('provider-dashboard');
        else if (res.user.role === 'admin') navigateTo('admin-dashboard');
      } catch (err) { }
    });
  }

  // Register redirect link inside page
  document.querySelectorAll('a[data-view="register"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('register');
    });
  });
}

function bindRegisterPageEvents() {
  const form = document.getElementById('standalone-register-form');
  const roleSelect = document.getElementById('reg-page-role');
  const providerFields = document.getElementById('reg-page-provider-fields');

  if (roleSelect && providerFields) {
    roleSelect.addEventListener('change', () => {
      if (roleSelect.value === 'provider') {
        providerFields.classList.remove('hidden');
        document.getElementById('reg-page-rate').setAttribute('required', 'true');
      } else {
        providerFields.classList.add('hidden');
        document.getElementById('reg-page-rate').removeAttribute('required');
      }
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-page-name').value;
      const email = document.getElementById('reg-page-email').value;
      const password = document.getElementById('reg-page-password').value;
      const role = roleSelect.value;

      const payload = { name, email, password, role };

      if (role === 'provider') {
        payload.category = document.getElementById('reg-page-cat').value;
        payload.hourly_rate = document.getElementById('reg-page-rate').value;
        payload.bio = document.getElementById('reg-page-bio').value;
      }

      try {
        const res = await apiCall('/api/auth/register', 'POST', payload);
        localStorage.setItem('apex_token', res.token);
        AppState.currentUser = res.user;
        localStorage.setItem('apex_user', JSON.stringify(res.user));

        showToast('Registered and logged in!');
        drawHeaderAuth();

        if (res.user.role === 'customer') navigateTo('customer-dashboard');
        else if (res.user.role === 'provider') navigateTo('provider-dashboard');
        else if (res.user.role === 'admin') navigateTo('admin-dashboard');
      } catch (err) { }
    });
  }

  // Sign in redirect link inside page
  document.querySelectorAll('a[data-view="login"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('login');
    });
  });
}

// ==========================================================================
// BOOTSTRAP INITIALIZATION
// ==========================================================================
async function initApp() {
  // Theme mode initialization
  const savedTheme = localStorage.getItem('theme_mode') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme_mode', next);
      toggleBtn.textContent = next === 'dark' ? '🌙' : '☀️';
    });
  }

  // Listen for hash navigation
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1) || 'home';
    // Prevent double nav
    if (AppState.currentView !== hash) {
      navigateTo(hash);
    }
  });

  // Parse path links
  document.querySelectorAll('.navbar .nav-link, #nav-logo').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && (href.includes('.html') || href.startsWith('/about') || href.startsWith('/login') || href.startsWith('/register'))) {
        // Allow standard browser navigation to separate HTML pages
        return;
      }
      e.preventDefault();
      const view = link.getAttribute('data-view') || 'home';
      navigateTo(view);
    });
  });

  // Footer category direct links
  document.querySelectorAll('.footer-category-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const catName = link.getAttribute('data-category');
      navigateTo('services', { category: catName, search: '' });
    });
  });

  // Initialize session and routing
  await initSession();

  const hash = window.location.hash.substring(1) || 'home';
  navigateTo(hash);
}

// Run app init on DOM Content Loaded
document.addEventListener('DOMContentLoaded', initApp);
