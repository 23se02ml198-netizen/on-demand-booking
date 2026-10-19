// SVG Icons Map
export const Icons = {
  search: `<svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  star: `<svg class="star-icon" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  calendar: `<svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  clock: `<svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  mapPin: `<svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  chat: `<svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  cleaning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="category-icon" style="width:32px;height:32px;"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  plumbing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="category-icon" style="width:32px;height:32px;"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
  electrical: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="category-icon" style="width:32px;height:32px;"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>`,
  appliances: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="category-icon" style="width:32px;height:32px;"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="4" y1="10" x2="20" y2="10"></line><circle cx="12" cy="6" r="1"></circle><circle cx="12" cy="16" r="2"></circle></svg>`,
  beauty: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="category-icon" style="width:32px;height:32px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  pest: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="category-icon" style="width:32px;height:32px;"><path d="M18 6L6 18M6 6l12 12"></path><circle cx="12" cy="12" r="9"></circle></svg>`,
  users: `<svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  briefcase: `<svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
  dollarSign: `<svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12M6 8h12M6 13h5a4 4 0 0 0 4-4V8M6 13l9 9"></path></svg>`,
  checkCircle: `<svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
};

const getCategoryIcon = (iconName) => {
  return Icons[iconName] || Icons.cleaning;
};

export const formatINR = (amount) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(Number(amount) || 0);

export const categoryServices = {
  Cleaning: ['Home cleaning', 'Deep cleaning', 'Kitchen cleaning', 'Bathroom cleaning', 'Water tank cleaning', 'Sofa and carpet cleaning'],
  Plumbing: ['Tap and faucet repair', 'Pipe leakage repair', 'Drain cleaning', 'Bathroom fitting', 'Water heater repair', 'Tank and pump service'],
  Electrical: ['Switch and socket repair', 'Fan installation', 'Light installation', 'Wiring repair', 'Inverter service', 'CCTV installation'],
  'Appliance Repair': ['AC service', 'Refrigerator repair', 'Washing machine repair', 'Microwave repair', 'TV repair', 'Geyser service'],
  'Beauty & Wellness': ['Haircut at home', 'Bridal makeup', 'Facial and cleanup', 'Manicure and pedicure', 'Massage therapy', 'Mehendi service'],
  'Pest Control': ['Termite control', 'Cockroach control', 'Mosquito treatment', 'Bed bug treatment', 'Rodent control', 'General pest inspection']
};

// ==========================================================================
// HOME VIEW COMPONENT
// ==========================================================================
export function renderHome(categories) {
  const categoryCards = categories.map(cat => `
    <div class="glass-card category-card" data-category="${cat.name}">
      <div class="category-icon-wrapper">
        ${getCategoryIcon(cat.icon)}
      </div>
      <h3>${cat.name}</h3>
      <p>${cat.description}</p>
      <div class="category-services">${(cat.services || categoryServices[cat.name] || []).slice(0, 4).map(service => `<span>${service}</span>`).join('')}</div>
    </div>
  `).join('');

  return `
    <section class="hero-section">
      <div class="container animate-up">
        <p class="hero-kicker" style="display: inline-block; padding: 6px 18px; background: rgba(56, 189, 248, 0.14); color: var(--primary); border-radius: 30px; font-weight: 600; font-size: 13px; margin-bottom: 16px; border: 1px solid rgba(56, 189, 248, 0.28);">Trusted help, right at your doorstep</p>
        <p class="hero-subtitle" style="max-width: 650px; margin: 0 auto 32px auto; font-size: 17px; color: var(--text-muted);">Book verified local professionals for cleaning, repairs, beauty, and everyday home services across your neighbourhood.</p>
        
        <div class="search-container" style="max-width: 680px; margin: 0 auto 32px auto;">
          <div class="search-bar" style="background: var(--bg-card-glass); border: 1px solid var(--border-glass); backdrop-filter: blur(18px); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);">
            <div class="search-input-wrapper">
              ${Icons.search}
              <input type="text" id="home-search-input" placeholder="Search service (e.g. Plumber, AC Repair)..." style="color: var(--text-white); background: transparent;">
            </div>
            <button class="btn btn-primary" id="home-search-btn" style="border-radius: 50px; padding: 12px 28px;">Find Pro</button>
          </div>
        </div>
        <div class="hero-actions" style="display: flex; justify-content: center; gap: 14px;">
          <button class="btn btn-primary btn-large" id="hero-signin-btn" style="padding: 12px 28px; border-radius: 12px;">Sign in to book</button>
          <button class="btn btn-outline btn-large" id="hero-browse-btn" style="padding: 12px 28px; border-radius: 12px;">Explore services &rarr;</button>
        </div>
      </div>
    </section>
  `;
}

// ==========================================================================
// SERVICES & PROVIDERS LIST VIEW
// ==========================================================================
export function renderServicesList(categories, selectedCategory, providers, searchVal = '') {
  const sidebarFilters = categories.map(cat => `
    <div class="filter-item ${selectedCategory === cat.name ? 'active' : ''}" data-category="${cat.name}">
      <span class="filter-bullet"></span>
      <span>${cat.name}<small>${(cat.services || categoryServices[cat.name] || []).slice(0, 3).join(' · ')}</small></span>
    </div>
  `).join('');

  const providerCards = providers.length > 0 ? providers.map(p => `
    <div class="glass-card provider-row-card">
      <div class="provider-avatar-lg">
        ${p.name.charAt(0)}
      </div>
      <div class="provider-info-body">
        <span class="provider-badge">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="provider-rating-row">
          ${Icons.star}
          <strong>${p.rating || '5.0'}</strong>
          <span style="color: var(--text-muted)">(${p.review_count || 0} reviews)</span>
        </div>
        <p style="font-size: 14px; margin-top: 8px; max-width: 600px;">${p.bio || 'No biography details provided.'}</p>
      </div>
      <div class="provider-actions-col">
        <div class="provider-rate-text">
          ${formatINR(p.hourly_rate)}<span>/hr</span>
        </div>
        <button class="btn btn-primary btn-book-now" data-provider-id="${p.id}">Book Service</button>
      </div>
    </div>
  `).join('') : `
    <div class="glass-card" style="text-align: center; padding: 48px;">
      <h3 style="margin-bottom: 12px;">No Service Providers Found</h3>
      <p style="color: var(--text-muted)">Try adjusting your search criteria or category filters.</p>
    </div>
  `;

  return `
    <div class="container">
      <div class="services-layout">
        
        <!-- Sidebar Filter Col -->
        <aside class="sidebar-filters glass-card">
          <div class="filter-group">
            <h4>Categories</h4>
            <div class="filter-list">
              <div class="filter-item ${!selectedCategory ? 'active' : ''}" data-category="">
                <span class="filter-bullet"></span>
                <span>All Categories</span>
              </div>
              ${sidebarFilters}
            </div>
          </div>
        </aside>

        <!-- Right Side Providers List Col -->
        <section class="providers-section">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px;">
            <h2>
              ${selectedCategory ? selectedCategory : 'All Services'}
              <span style="font-size: 14px; font-weight: normal; color: var(--text-muted); margin-left: 8px;">
                (${providers.length} provider${providers.length !== 1 ? 's' : ''} available)
              </span>
            </h2>
            <div class="search-bar" style="max-width: 320px; width: 100%;">
              <div class="search-input-wrapper" style="padding: 0 12px;">
                ${Icons.search}
                <input type="text" id="list-search-input" value="${searchVal}" placeholder="Filter by name/bio..." style="font-size: 14px;">
              </div>
            </div>
          </div>

          <div class="providers-grid">
            ${providerCards}
          </div>
        </section>

      </div>
    </div>
  `;
}

// ==========================================================================
// CUSTOMER DASHBOARD
// ==========================================================================
export function renderCustomerDashboard(user, bookings, activeTab = 'bookings', filterFromDate = '', filterToDate = '', userComplaintsList = []) {
  let contentHtml = '';

  if (activeTab === 'bookings') {
    contentHtml = bookings.length > 0 ? bookings.map(b => {
      const isUnlockedByAdmin = b.admin_completion_confirmed === 1 || (b.status === 'completed' && b.admin_approved === 1);
      const isProviderDone = b.provider_completed === 1;
      const isApproved = b.admin_approved === 1;

      return `
        <div class="glass-card booking-card">
          <div class="booking-category-icon">
            ${getCategoryIcon((b.category || 'cleaning').toLowerCase().split(' ')[0])}
          </div>
          <div class="booking-details-col">
            ${b.status === 'cancelled' ? `
              <span class="status-badge status-cancelled">Cancelled</span>
            ` : isUnlockedByAdmin ? `
              <span class="status-badge status-completed">✓ Work Verified by Admin &ndash; Completed</span>
            ` : isProviderDone ? `
              <span class="status-badge status-in_progress" style="background:rgba(234,179,8,0.15); color:#facc15; border-color:rgba(234,179,8,0.3);">⌛ Work Done &ndash; Awaiting Admin Confirmation</span>
            ` : (isApproved || b.status === 'accepted') ? `
              <span class="status-badge status-accepted" style="background:rgba(56,189,248,0.15); color:#38bdf8; border-color:rgba(56,189,248,0.3);">✓ Admin Approved &amp; Pro Assigned (${b.provider_name || 'Assigned'})</span>
            ` : b.status === 'in_progress' ? `
              <span class="status-badge status-in_progress">▶ Service In Progress</span>
            ` : `
              <span class="status-badge status-pending" style="background:rgba(251,191,36,0.15); color:#fbbf24; border-color:rgba(251,191,36,0.3);">⌛ Request Sent to Admin &ndash; Pending Pro Assignment</span>
            `}

            <h3 style="margin-top: 6px;">${b.category} with ${b.provider_name || 'Assigned Professional'}</h3>
            <div class="booking-schedule-row">
              <span style="display:flex; align-items:center; gap: 4px;">
                ${Icons.calendar} ${b.booking_date}
              </span>
              <span style="display:flex; align-items:center; gap: 4px;">
                ${Icons.clock} ${b.booking_time} (${b.duration_hours} hr${b.duration_hours !== 1 ? 's' : ''})
              </span>
              <span style="display:flex; align-items:center; gap: 4px;">
                ${Icons.mapPin} ${b.address}
              </span>
            </div>
            ${b.notes ? `<p style="font-size:13px; color: var(--text-muted); margin-top: 8px;"><strong>Note:</strong> ${b.notes}</p>` : ''}
          </div>
          <div class="booking-actions-col">
            <div style="font-weight: 700; font-size: 18px; color: var(--text-white);">${formatINR(b.total_price)}</div>
            
            <div style="display: flex; gap: 8px; margin-top: 10px; align-items:center; flex-wrap:wrap;">
              <button class="btn btn-secondary btn-sm btn-chat-booking" data-booking-id="${b.id}" data-partner-name="${b.provider_name || 'Service Partner'}">
                ${Icons.chat} Chat
              </button>
              
              ${!isProviderDone && !isUnlockedByAdmin && (b.status === 'pending' || b.status === 'accepted') ? `
                <button class="btn btn-danger btn-sm btn-cancel-booking" data-booking-id="${b.id}">Cancel</button>
              ` : ''}

              ${isUnlockedByAdmin && !b.review_rating ? `
                <button class="btn btn-primary btn-sm btn-review-booking" data-booking-id="${b.id}" style="background:linear-gradient(135deg, var(--primary) 0%, #0284c7 100%); color:#fff; font-weight:700; border:none; padding:8px 16px; border-radius:8px; box-shadow:0 4px 12px rgba(56,189,248,0.3);">
                  ⭐ Rate & Feedback
                </button>
              ` : ''}

              ${!isUnlockedByAdmin && isProviderDone ? `
                <span class="status-badge status-in_progress" style="font-size:12px; padding:6px 12px; background:rgba(234,179,8,0.1); color:#facc15;">
                  🔒 Rating Locked (Admin Verifying Work)
                </span>
              ` : ''}

              ${b.review_rating ? `
                <span class="status-badge status-completed" style="font-size:12px; padding:6px 12px;">
                  ✓ Rated ${b.review_rating}.0 ★
                </span>
              ` : ''}

              <button class="btn btn-outline btn-sm btn-raise-complaint" data-booking-id="${b.id}" style="border-color:rgba(239,68,68,0.4); color:#f87171;" title="Report provider issue to Admin">
                🚩 Report / Complaint
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('') : `
      <div class="glass-card" style="text-align: center; padding: 48px;">
        <h3>No bookings yet</h3>
        <p style="color: var(--text-muted); margin-bottom: 20px;">Hire your first service provider today!</p>
        <button class="btn btn-primary" id="btn-browse-services">Browse Services</button>
      </div>
    `;
  } else if (activeTab === 'history') {
    const history = bookings.filter(b => ['completed', 'cancelled'].includes(b.status) || b.admin_completion_confirmed === 1 || b.provider_completed === 1);
    contentHtml = history.length > 0 ? history.map(b => {
      const isCompletedOrConfirmed = b.status === 'completed' || b.admin_completion_confirmed === 1 || b.provider_completed === 1;

      return `
        <div class="glass-card history-card">
          <div class="booking-category-icon">${getCategoryIcon(b.category.toLowerCase().split(' ')[0])}</div>
          <div class="booking-details-col">
            <span class="status-badge status-${b.status}">${b.status.replace('_', ' ')}</span>
            <h3>${b.category} with ${b.provider_name}</h3>
            <div class="booking-schedule-row">${Icons.calendar} ${b.booking_date} <span>${Icons.clock} ${b.booking_time}</span></div>
            ${b.review_rating ? `<div class="feedback-stars" style="color:#ffd700; font-size:14px; margin-top:6px;">${'★'.repeat(b.review_rating)}${'☆'.repeat(5 - b.review_rating)} <span style="color:var(--text-white); margin-left:6px;">"${b.review_comment || 'Service completed'}"</span></div>` : '<p class="history-muted" style="font-size:12px; color:var(--text-muted); margin-top:6px;">No feedback added yet.</p>'}
          </div>
          <div class="booking-actions-col">
            <strong class="history-price">${formatINR(b.total_price)}</strong>
            ${isCompletedOrConfirmed && !b.review_rating ? `
              <button class="btn btn-primary btn-sm btn-review-booking" data-booking-id="${b.id}" style="margin-top:8px; background:linear-gradient(135deg, var(--primary) 0%, #0284c7 100%); color:#fff; font-weight:700;">
                ⭐ Rate & Feedback
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('') : `<div class="glass-card empty-state"><h3>No service history yet</h3><p>Completed services and your feedback will appear here.</p></div>`;
  } else if (activeTab === 'feedback') {
    const feedback = bookings.filter(b => b.review_rating);

    const count5 = feedback.filter(b => b.review_rating === 5).length;
    const count4 = feedback.filter(b => b.review_rating === 4).length;
    const count3 = feedback.filter(b => b.review_rating === 3).length;
    const count2 = feedback.filter(b => b.review_rating === 2).length;
    const count1 = feedback.filter(b => b.review_rating === 1).length;
    const total = feedback.length || 1;

    const p5 = Math.round((count5 / total) * 100);
    const p4 = Math.round((count4 / total) * 100);
    const p3 = Math.round((count3 / total) * 100);
    const p2 = Math.round((count2 / total) * 100);
    const p1 = Math.round((count1 / total) * 100);

    const avgRating = feedback.length > 0 
      ? (feedback.reduce((sum, item) => sum + item.review_rating, 0) / feedback.length).toFixed(1)
      : '5.0';

    contentHtml = `
      <div class="glass-card" style="margin-bottom:24px; padding:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
          <div style="display:flex; align-items:center; gap:20px; flex-wrap:wrap; width:100%;">
            <div style="text-align:center; background:rgba(255,215,0,0.1); border:1px solid rgba(255,215,0,0.3); padding:16px 24px; border-radius:16px; min-width:140px;">
              <div style="font-size:36px; font-weight:800; color:var(--text-white);">${avgRating}</div>
              <div style="color:#ffd700; font-size:18px; margin:4px 0;">★★★★★</div>
              <div style="font-size:12px; color:var(--text-muted);">${feedback.length} Total Reviews</div>
            </div>
            
            <!-- Star Tiers Breakdown Bar Chart -->
            <div style="flex:1; min-width:260px; display:flex; flex-direction:column; gap:8px;">
              <div style="display:flex; align-items:center; gap:10px; font-size:13px;">
                <span style="width:55px; font-weight:700; color:#ffd700;">5 Stars</span>
                <div style="flex:1; background:rgba(255,255,255,0.08); height:10px; border-radius:6px; overflow:hidden;">
                  <div style="width:${p5}%; background:#ffd700; height:100%; border-radius:6px;"></div>
                </div>
                <span style="width:65px; text-align:right; font-weight:600; color:var(--text-white);">${count5} (${p5}%)</span>
              </div>
              <div style="display:flex; align-items:center; gap:10px; font-size:13px;">
                <span style="width:55px; font-weight:700; color:#ffd700;">4 Stars</span>
                <div style="flex:1; background:rgba(255,255,255,0.08); height:10px; border-radius:6px; overflow:hidden;">
                  <div style="width:${p4}%; background:#38bdf8; height:100%; border-radius:6px;"></div>
                </div>
                <span style="width:65px; text-align:right; font-weight:600; color:var(--text-white);">${count4} (${p4}%)</span>
              </div>
              <div style="display:flex; align-items:center; gap:10px; font-size:13px;">
                <span style="width:55px; font-weight:700; color:#ffd700;">3 Stars</span>
                <div style="flex:1; background:rgba(255,255,255,0.08); height:10px; border-radius:6px; overflow:hidden;">
                  <div style="width:${p3}%; background:#fbbc05; height:100%; border-radius:6px;"></div>
                </div>
                <span style="width:65px; text-align:right; font-weight:600; color:var(--text-white);">${count3} (${p3}%)</span>
              </div>
              <div style="display:flex; align-items:center; gap:10px; font-size:13px;">
                <span style="width:55px; font-weight:700; color:#ffd700;">2 Stars</span>
                <div style="flex:1; background:rgba(255,255,255,0.08); height:10px; border-radius:6px; overflow:hidden;">
                  <div style="width:${p2}%; background:#ff9800; height:100%; border-radius:6px;"></div>
                </div>
                <span style="width:65px; text-align:right; font-weight:600; color:var(--text-white);">${count2} (${p2}%)</span>
              </div>
              <div style="display:flex; align-items:center; gap:10px; font-size:13px;">
                <span style="width:55px; font-weight:700; color:#ffd700;">1 Star</span>
                <div style="flex:1; background:rgba(255,255,255,0.08); height:10px; border-radius:6px; overflow:hidden;">
                  <div style="width:${p1}%; background:#ea4335; height:100%; border-radius:6px;"></div>
                </div>
                <span style="width:65px; text-align:right; font-weight:600; color:var(--text-white);">${count1} (${p1}%)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Rating Filter Badges -->
        <div style="display:flex; gap:8px; margin-top:20px; flex-wrap:wrap;">
          <button class="btn btn-sm btn-outline filter-star-btn active" data-stars="all">All Ratings (${feedback.length})</button>
          <button class="btn btn-sm btn-outline filter-star-btn" data-stars="5">5★ Only (${count5})</button>
          <button class="btn btn-sm btn-outline filter-star-btn" data-stars="4">4★ Only (${count4})</button>
          <button class="btn btn-sm btn-outline filter-star-btn" data-stars="3">3★ Only (${count3})</button>
          <button class="btn btn-sm btn-outline filter-star-btn" data-stars="2">2★ Only (${count2})</button>
          <button class="btn btn-sm btn-outline filter-star-btn" data-stars="1">1★ Only (${count1})</button>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px;" id="feedback-list-container">
        ${feedback.length > 0 ? feedback.map(b => `
          <article class="glass-card feedback-card feedback-item-star" data-rating="${b.review_rating}">
            <div class="feedback-card-top">
              <strong style="color:var(--primary); font-size:16px;">${b.category} with ${b.provider_name}</strong>
              <span style="font-size:12px; color:var(--text-muted);">${b.booking_date}</span>
            </div>
            <div class="feedback-stars" style="color:#ffd700; font-size:16px; margin:8px 0;">
              ${'★'.repeat(b.review_rating)}${'☆'.repeat(5 - b.review_rating)}
              <span style="color:var(--text-white); font-weight:700; font-size:14px; margin-left:6px;">(${b.review_rating}.0 Star Rating)</span>
            </div>
            <p style="font-size:14px; color:var(--text-white); line-height:1.5;">"${b.review_comment || 'Service completed successfully.'}"</p>
          </article>
        `).join('') : `
          <div class="glass-card empty-state">
            <h3>Your feedback matters</h3>
            <p>After a service is completed, rate your provider and leave a comment here.</p>
          </div>
        `}
      </div>
    `;
  } else if (activeTab === 'expenditure') {
    const allPaidBookings = bookings.filter(b => b.status === 'completed' || b.payment_status === 'paid_to_admin' || b.status === 'accepted' || b.status === 'in_progress');

    // Filter by selected date range if present
    const fromVal = filterFromDate || '';
    const toVal = filterToDate || '';

    const paidBookings = allPaidBookings.filter(b => {
      let valid = true;
      if (fromVal) valid = valid && (b.booking_date >= fromVal);
      if (toVal) valid = valid && (b.booking_date <= toVal);
      return valid;
    });

    // Calculate total spent in range
    const totalSpent = paidBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
    const totalAllTimeSpent = allPaidBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
    const avgSpent = paidBookings.length > 0 ? (totalSpent / paidBookings.length) : 0;

    // Group spending by category in range
    const categorySpending = {
      'Plumbing': { icon: '🔧', total: 0, count: 0 },
      'Cleaning': { icon: '🧹', total: 0, count: 0 },
      'Electrical': { icon: '⚡', total: 0, count: 0 },
      'Appliance Repair': { icon: '❄️', total: 0, count: 0 },
      'Beauty & Wellness': { icon: '💄', total: 0, count: 0 },
      'Pest Control': { icon: '🐜', total: 0, count: 0 }
    };

    paidBookings.forEach(b => {
      const cat = b.category || 'Other';
      if (!categorySpending[cat]) {
        categorySpending[cat] = { icon: '🛠️', total: 0, count: 0 };
      }
      categorySpending[cat].total += (b.total_price || 0);
      categorySpending[cat].count += 1;
    });

    // Find top category
    let topCatName = 'None';
    let topCatAmt = 0;
    Object.keys(categorySpending).forEach(cat => {
      if (categorySpending[cat].total > topCatAmt) {
        topCatAmt = categorySpending[cat].total;
        topCatName = cat;
      }
    });

    // Group bookings by Month Year
    const monthlyMap = {};
    paidBookings.forEach(b => {
      let mKey = 'Statement Period';
      if (b.booking_date) {
        const d = new Date(b.booking_date);
        if (!isNaN(d.getTime())) {
          mKey = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        }
      }
      if (!monthlyMap[mKey]) monthlyMap[mKey] = [];
      monthlyMap[mKey].push(b);
    });

    const monthsKeys = Object.keys(monthlyMap);

    contentHtml = `
      <!-- Date Range Expenditure Filter Header Card -->
      <div class="glass-card" style="padding: 24px; margin-bottom: 24px; border: 1px solid var(--border-glass-hover); background: rgba(11, 12, 16, 0.65);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom: 18px;">
          <div>
            <h3 style="font-size:20px; color:var(--text-white); margin-bottom:4px; display:flex; align-items:center; gap:8px;">
              <span>📅</span> Customer Bill Expenditure Filter
            </h3>
            <p style="font-size:13px; color:var(--text-muted);">Select custom <strong>From Date</strong> and <strong>To Date</strong> to inspect your billing expenditure within any timeframe.</p>
          </div>
          <button class="btn btn-outline btn-sm" id="btn-print-range-statement" style="background:rgba(56, 189, 248, 0.1); border-color:var(--primary); color:var(--primary); font-weight:600; padding:8px 16px;">
            🖨️ Export / Print Date Range Statement
          </button>
        </div>

        <!-- Date Inputs Row -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:14px; align-items:end; margin-bottom: 16px;">
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:12px; font-weight:700; color:var(--text-light); text-transform:uppercase; letter-spacing:0.5px;">From Date</label>
            <input type="date" id="expenditure-from-date" value="${fromVal}" class="form-control" style="background:rgba(255,255,255,0.05); color:var(--text-white); border:1px solid var(--border-glass); border-radius:10px; padding:10px 14px; width:100%;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:12px; font-weight:700; color:var(--text-light); text-transform:uppercase; letter-spacing:0.5px;">To Date</label>
            <input type="date" id="expenditure-to-date" value="${toVal}" class="form-control" style="background:rgba(255,255,255,0.05); color:var(--text-white); border:1px solid var(--border-glass); border-radius:10px; padding:10px 14px; width:100%;">
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-primary" id="btn-filter-expenditure" style="flex:1; padding:10px 16px; border-radius:10px; font-weight:600;">
              Apply Date Filter
            </button>
            <button class="btn btn-secondary" id="btn-clear-expenditure-dates" style="padding:10px 14px; border-radius:10px; font-size:13px;" title="Reset Date Filter">
              Reset
            </button>
          </div>
        </div>

        <!-- Quick Selection Presets -->
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; pt:12px; border-top:1px solid var(--border-glass); padding-top:14px;">
          <span style="font-size:12px; color:var(--text-muted); font-weight:600; margin-right:4px;">Quick Presets:</span>
          <button class="btn btn-sm btn-outline btn-quick-date" data-range="this-month">This Month</button>
          <button class="btn btn-sm btn-outline btn-quick-date" data-range="last-month">Last Month</button>
          <button class="btn btn-sm btn-outline btn-quick-date" data-range="last-30">Last 30 Days</button>
          <button class="btn btn-sm btn-outline btn-quick-date" data-range="last-90">Last 90 Days</button>
          <button class="btn btn-sm btn-outline btn-quick-date" data-range="this-year">This Year</button>
          <button class="btn btn-sm btn-outline btn-quick-date" data-range="all-time">All Time</button>
        </div>

        <!-- Selected Filter Status Badge -->
        ${(fromVal || toVal) ? `
          <div style="margin-top:14px; background:rgba(56, 189, 248, 0.12); border:1px solid rgba(56, 189, 248, 0.3); padding:8px 14px; border-radius:8px; font-size:13px; color:var(--primary); display:flex; justify-content:space-between; align-items:center;">
            <span>🔍 Active Date Range: <strong>${fromVal || 'Beginning'}</strong> &rarr; <strong>${toVal || 'Today'}</strong> (${paidBookings.length} bill${paidBookings.length !== 1 ? 's' : ''} matched)</span>
            <span style="font-weight:700;">Filtered Spent: ${formatINR(totalSpent)}</span>
          </div>
        ` : ''}
      </div>

      <!-- Expenditure Summary Stat Cards for Date Range -->
      <div class="dashboard-grid" style="margin-bottom:24px;">
        <div class="glass-card dashboard-stat-card" style="border:1px solid rgba(46,196,182,0.3); background:rgba(46,196,182,0.06);">
          <div class="stat-card-details">
            <h3 style="color:var(--success); font-size:24px;">${formatINR(totalSpent)}</h3>
            <p style="font-weight:600; color:var(--text-white);">${(fromVal || toVal) ? 'Filtered Spent in Date Range' : 'Total Filtered Expenditure'}</p>
          </div>
          <div class="stat-card-icon">${Icons.dollarSign}</div>
        </div>
        <div class="glass-card dashboard-stat-card" style="border:1px solid var(--primary-glow); background:rgba(56,189,248,0.08);">
          <div class="stat-card-details">
            <h3 style="color:var(--primary); font-size:24px;">${paidBookings.length}</h3>
            <p style="font-weight:600; color:var(--text-white);">Invoiced Service Bills</p>
          </div>
          <div class="stat-card-icon">${Icons.checkCircle}</div>
        </div>
        <div class="glass-card dashboard-stat-card">
          <div class="stat-card-details">
            <h3 style="color:var(--text-white); font-size:24px;">${formatINR(avgSpent)}</h3>
            <p style="color:var(--text-muted);">Avg. Spent per Bill</p>
          </div>
          <div class="stat-card-icon">${Icons.briefcase}</div>
        </div>
        <div class="glass-card dashboard-stat-card">
          <div class="stat-card-details">
            <h3 style="color:#ffd700; font-size:20px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${topCatName}</h3>
            <p style="color:var(--text-muted);">Top Category Spent</p>
          </div>
          <div class="stat-card-icon">🏆</div>
        </div>
      </div>

      <!-- Service Category Expenditure Breakdown Grid for Date Range -->
      <div class="glass-card" style="padding:24px; margin-bottom:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:18px;">
          <div>
            <h3 style="font-size:18px; color:var(--text-white); margin-bottom:4px;">📊 Category Spending Breakdown for Selected Range</h3>
            <p style="font-size:13px; color:var(--text-muted);">Expenditure distributed across categories within the selected date window</p>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:14px;">
          ${Object.keys(categorySpending).map(catKey => {
            const item = categorySpending[catKey];
            const pct = totalSpent > 0 ? Math.round((item.total / totalSpent) * 100) : 0;

            return `
              <div class="glass-card filter-cat-card" data-category="${catKey}" style="cursor:pointer; padding:16px; border:1px solid var(--border-glass); background:rgba(255,255,255,0.02); border-radius:14px; transition:all 0.2s ease;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <span style="font-size:24px;">${item.icon}</span>
                  <span class="status-badge status-completed" style="font-size:11px; padding:2px 8px;">${item.count} Billed</span>
                </div>
                <strong style="font-size:15px; color:var(--text-white); display:block;">${catKey}</strong>
                <div style="font-size:18px; font-weight:800; color:var(--primary); margin:4px 0;">${formatINR(item.total)}</div>
                <div style="background:rgba(255,255,255,0.08); height:6px; border-radius:4px; overflow:hidden; margin-top:8px;">
                  <div style="width:${pct}%; background:var(--primary); height:100%;"></div>
                </div>
                <div style="font-size:11px; color:var(--text-muted); margin-top:4px; text-align:right;">${pct}% of Period Total</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Filter Category Buttons -->
        <div style="display:flex; gap:8px; margin-top:20px; flex-wrap:wrap;">
          <button class="btn btn-sm btn-outline filter-cat-btn active" data-cat="all">All Category Bills (${paidBookings.length})</button>
          ${Object.keys(categorySpending).map(catKey => `
            <button class="btn btn-sm btn-outline filter-cat-btn" data-cat="${catKey}">${categorySpending[catKey].icon} ${catKey} (${categorySpending[catKey].count})</button>
          `).join('')}
        </div>
      </div>

      <!-- Itemized Date Range Expenditure Table -->
      <div style="display:flex; flex-direction:column; gap:24px;">
        ${monthsKeys.length > 0 ? monthsKeys.map(mKey => {
          const mList = monthlyMap[mKey];
          const mTotal = mList.reduce((sum, b) => sum + (b.total_price || 0), 0);

          return `
            <div class="glass-card" style="padding:24px;">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:18px; border-bottom:1px solid var(--border-glass); padding-bottom:14px;">
                <div>
                  <h3 style="font-size:18px; color:var(--text-white); margin-bottom:2px;">🗓️ Bill Statement &ndash; ${mKey}</h3>
                  <p style="font-size:12px; color:var(--text-muted);">${mList.length} service item${mList.length !== 1 ? 's' : ''} billed in this cycle</p>
                </div>
                <div style="text-align:right;">
                  <span style="font-size:12px; color:var(--text-muted); display:block;">Total Cycle Spent</span>
                  <strong style="font-size:20px; color:var(--success);">${formatINR(mTotal)}</strong>
                </div>
              </div>

              <div class="admin-data-table-wrapper">
                <table class="admin-data-table">
                  <thead>
                    <tr>
                      <th>Invoice Ref</th>
                      <th>Service Category</th>
                      <th>Assigned Professional</th>
                      <th>Date & Time</th>
                      <th>Amount Spent</th>
                      <th>Bill Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${mList.map(b => `
                      <tr class="expenditure-row-item" data-category="${b.category}">
                        <td><strong>#INV-BK${b.id}</strong></td>
                        <td><span style="font-weight:600; color:var(--primary);">${b.category}</span></td>
                        <td><strong>${b.provider_name || 'Service Pro'}</strong></td>
                        <td>${b.booking_date} @ ${b.booking_time}</td>
                        <td><strong style="color:var(--text-white); font-size:15px;">${formatINR(b.total_price)}</strong></td>
                        <td><span class="status-badge status-completed">✓ Paid / Billed</span></td>
                        <td>
                          <button class="btn btn-outline btn-sm btn-print-invoice" data-booking-id="${b.id}">
                            📄 View / Print Invoice Bill
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }).join('') : `
          <div class="glass-card empty-state" style="text-align:center; padding:48px;">
            <h3>No expenditure records found in selected date range</h3>
            <p style="color:var(--text-muted);">Try adjusting your From Date and To Date filters or click "All Time" preset.</p>
          </div>
        `}
      </div>
    `;
  } else if (activeTab === 'complaints') {
    const complaints = userComplaintsList || [];
    contentHtml = `
      <div class="glass-card" style="padding:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom: 20px;">
          <div>
            <h3 style="margin-bottom:4px; color:var(--text-white);">🚩 My Complaints & Escalations</h3>
            <p style="font-size:13px; color:var(--text-muted);">Track official complaints submitted against service providers and view Admin resolution notes</p>
          </div>
          <span class="status-badge status-completed" style="font-size:12px; padding:6px 14px;">${complaints.length} Total Complaints</span>
        </div>

        <div class="admin-data-table-wrapper">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Ref ID</th>
                <th>Provider Name</th>
                <th>Category</th>
                <th>Reason / Subject & Details</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Admin Resolution Notes</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${complaints.length > 0 ? complaints.map(c => `
                <tr>
                  <td><strong>#CMP-${c.id}</strong></td>
                  <td><strong style="color:var(--primary);">${c.provider_name || 'Provider'}</strong></td>
                  <td>${c.category}</td>
                  <td><strong>${c.subject}</strong><br><span style="font-size:12px; color:var(--text-muted);">${c.description}</span></td>
                  <td><span class="status-badge status-${c.priority === 'High' ? 'cancelled' : 'accepted'}" style="font-size:11px;">${c.priority}</span></td>
                  <td><span class="status-badge status-${c.status === 'Resolved' ? 'completed' : (c.status === 'Investigating' ? 'in_progress' : 'pending')}" style="font-size:12px;">${c.status}</span></td>
                  <td style="max-width:240px; font-size:13px; color:var(--text-white);">${c.resolution_notes ? `"${c.resolution_notes}"` : '<span style="color:var(--text-muted);">Under Admin Review</span>'}</td>
                  <td><span style="font-size:12px; color:var(--text-muted);">${c.created_at}</span></td>
                </tr>
              `).join('') : `
                <tr><td colspan="8" style="text-align:center; padding:28px; color:var(--text-muted);">No complaints filed yet. If a provider behaves unprofessionally, click "Report / Complaint" on your booking card to alert Admin.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  return `
    <div class="container animate-up" style="margin-top: 40px;">
      <div class="dashboard-heading"><div><p class="hero-kicker">Customer space</p><h2>Welcome back, ${user.name}</h2><p style="color: var(--text-muted)">Track services, revisit your history, and share honest feedback.</p></div><div class="dashboard-heading-mark">★</div></div>

      <!-- Explore Categories Ribbon -->
      <div class="glass-card" style="padding: 24px; margin-top: 24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
          <div>
            <h3 style="font-size:18px; margin-bottom:4px; color:var(--text-white);">Explore & Book Categories</h3>
            <p style="font-size:13px; color:var(--text-muted);">Select a category to quickly browse and book top-rated professionals</p>
          </div>
          <a href="#services" class="btn btn-outline btn-sm">View All Services &rarr;</a>
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
          <a href="#services" data-category="Plumbing" class="category-quick-btn nav-link" style="display:flex; align-items:center; gap:10px; padding:12px 14px; border-radius:12px; background:rgba(255,255,255,0.06); border:1px solid var(--border-glass); text-decoration:none; color:var(--text-white); font-weight:600; font-size:13px;">
            <span>🔧</span> Plumbing
          </a>
          <a href="#services" data-category="Cleaning" class="category-quick-btn nav-link" style="display:flex; align-items:center; gap:10px; padding:12px 14px; border-radius:12px; background:rgba(255,255,255,0.06); border:1px solid var(--border-glass); text-decoration:none; color:var(--text-white); font-weight:600; font-size:13px;">
            <span>🧹</span> Cleaning
          </a>
          <a href="#services" data-category="Electrical" class="category-quick-btn nav-link" style="display:flex; align-items:center; gap:10px; padding:12px 14px; border-radius:12px; background:rgba(255,255,255,0.06); border:1px solid var(--border-glass); text-decoration:none; color:var(--text-white); font-weight:600; font-size:13px;">
            <span>⚡</span> Electrical
          </a>
          <a href="#services" data-category="Appliance Repair" class="category-quick-btn nav-link" style="display:flex; align-items:center; gap:10px; padding:12px 14px; border-radius:12px; background:rgba(255,255,255,0.06); border:1px solid var(--border-glass); text-decoration:none; color:var(--text-white); font-weight:600; font-size:13px;">
            <span>❄️</span> Appliances
          </a>
          <a href="#services" data-category="Beauty & Wellness" class="category-quick-btn nav-link" style="display:flex; align-items:center; gap:10px; padding:12px 14px; border-radius:12px; background:rgba(255,255,255,0.06); border:1px solid var(--border-glass); text-decoration:none; color:var(--text-white); font-weight:600; font-size:13px;">
            <span>💄</span> Beauty
          </a>
          <a href="#services" data-category="Pest Control" class="category-quick-btn nav-link" style="display:flex; align-items:center; gap:10px; padding:12px 14px; border-radius:12px; background:rgba(255,255,255,0.06); border:1px solid var(--border-glass); text-decoration:none; color:var(--text-white); font-weight:600; font-size:13px;">
            <span>🐜</span> Pest Control
          </a>
        </div>
      </div>

      <div class="dashboard-tabs" style="margin-top: 32px;">
        <span class="dash-tab-link ${activeTab === 'bookings' ? 'active' : ''}" data-tab="bookings">My Bookings</span>
        <span class="dash-tab-link ${activeTab === 'history' ? 'active' : ''}" data-tab="history">History</span>
        <span class="dash-tab-link ${activeTab === 'feedback' ? 'active' : ''}" data-tab="feedback">⭐ Ratings & Feedback Breakdown</span>
        <span class="dash-tab-link ${activeTab === 'expenditure' ? 'active' : ''}" data-tab="expenditure">💳 Monthly Expenditure & Bills</span>
        <span class="dash-tab-link ${activeTab === 'complaints' ? 'active' : ''}" data-tab="complaints">🚩 My Complaints & Escalations (${(userComplaintsList || []).length})</span>
      </div>

      <div class="bookings-section">
        ${contentHtml}
      </div>
    </div>
  `;
}

// ==========================================================================
// PROVIDER DASHBOARD
// ==========================================================================
export function renderProviderDashboard(user, providerInfo, bookings, activeTab = 'jobs') {
  // Safe fallback so provider dashboard NEVER crashes even if providerInfo is missing
  providerInfo = providerInfo || {
    category: 'Plumbing',
    bio: 'Verified Service Professional',
    hourly_rate: 750,
    rating: 5.0,
    review_count: 1,
    status: 'approved',
    availability: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], hours: { start: '09:00', end: '17:00' } }
  };
  bookings = Array.isArray(bookings) ? bookings : [];

  // Aggregate stats
  const pendingJobs = bookings.filter(b => b.status === 'pending').length;
  const activeJobs = bookings.filter(b => b.status === 'accepted' || b.status === 'in_progress').length;
  const completedJobsCount = bookings.filter(b => b.status === 'completed').length;
  const totalEarnings = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.total_price || 0), 0);

  let tabContentHtml = '';

  if (activeTab === 'jobs') {
    const jobs = bookings.filter(b => ['pending', 'accepted', 'in_progress', 'completed'].includes(b.status));

    tabContentHtml = jobs.length > 0 ? jobs.map(b => `
      <div class="glass-card booking-card">
        <div class="booking-category-icon">
          ${getCategoryIcon(b.category.toLowerCase().split(' ')[0])}
        </div>
        <div class="booking-details-col">
          <span class="status-badge status-${b.status}">${b.status.replace('_', ' ')}</span>
          <h3 style="margin-top: 6px;">Service: ${b.category} for ${b.customer_name}</h3>
          <div class="booking-schedule-row">
            <span style="display:flex; align-items:center; gap: 4px;">
              ${Icons.calendar} ${b.booking_date}
            </span>
            <span style="display:flex; align-items:center; gap: 4px;">
              ${Icons.clock} ${b.booking_time} (${b.duration_hours} hr${b.duration_hours !== 1 ? 's' : ''})
            </span>
            <span style="display:flex; align-items:center; gap: 4px;">
              ${Icons.mapPin} ${b.address}
            </span>
          </div>
          ${b.notes ? `<p style="font-size:13px; color: var(--text-muted); margin-top: 8px;"><strong>Note:</strong> ${b.notes}</p>` : ''}
        </div>
        <div class="booking-actions-col">
          <div style="font-weight: 700; font-size: 18px; color: var(--text-white);">${formatINR(b.total_price)}</div>
          
          <div style="display: flex; gap: 8px; margin-top: 10px;">
            <button class="btn btn-secondary btn-sm btn-chat-booking" data-booking-id="${b.id}" data-partner-name="${b.customer_name}">
              ${Icons.chat} Chat
            </button>

            ${b.status === 'pending' ? `
              <button class="btn btn-primary btn-sm btn-update-status" data-booking-id="${b.id}" data-status="accepted">Accept Job</button>
              <button class="btn btn-danger btn-sm btn-update-status" data-booking-id="${b.id}" data-status="cancelled">Decline</button>
            ` : ''}

            ${b.status === 'accepted' ? `
              <button class="btn btn-primary btn-sm btn-update-status" data-booking-id="${b.id}" data-status="in_progress" style="background:var(--primary); border:none; font-weight:700; padding:8px 14px;">
                ▶ Start Service
              </button>
            ` : ''}

            ${b.status === 'in_progress' ? `
              <button class="btn btn-primary btn-sm btn-update-status" data-booking-id="${b.id}" data-status="completed" style="background:var(--success); border:none; font-weight:700; padding:8px 14px; box-shadow:0 4px 12px rgba(46,196,182,0.3);">
                ✔️ Mark Work Completed & Notify Admin
              </button>
            ` : ''}

            ${b.status === 'completed' || b.provider_completed === 1 ? `
              <span class="status-badge status-completed" style="padding:6px 12px; font-size:12px;">
                ✓ Work Completed & Sent to Admin
              </span>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('') : `
      <div class="glass-card" style="text-align: center; padding: 48px;">
        <h3>No active jobs</h3>
        <p style="color: var(--text-muted)">New customer requests will appear here once booked.</p>
      </div>
    `;
  } else if (activeTab === 'history') {
    const history = bookings.filter(b => ['completed', 'cancelled'].includes(b.status));

    tabContentHtml = history.length > 0 ? history.map(b => `
      <div class="glass-card booking-card">
        <div class="booking-category-icon">
          ${getCategoryIcon(b.category.toLowerCase().split(' ')[0])}
        </div>
        <div class="booking-details-col">
          <span class="status-badge status-${b.status}">${b.status}</span>
          <h3 style="margin-top: 6px;">${b.category} for ${b.customer_name}</h3>
          <div class="booking-schedule-row">
            <span>${Icons.calendar} ${b.booking_date}</span>
            <span>${Icons.clock} ${b.booking_time}</span>
          </div>
        </div>
        <div class="booking-actions-col">
          <div style="font-weight: 700; font-size: 18px; color: var(--text-white);">${formatINR(b.total_price)}</div>
        </div>
      </div>
    `).join('') : `
      <div class="glass-card" style="text-align: center; padding: 48px;">
        <h3>No job history</h3>
        <p style="color: var(--text-muted)">Completed jobs will be archived here.</p>
      </div>
    `;
  } else if (activeTab === 'profile') {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const activeDays = providerInfo.availability?.days || [];

    const daysCheckboxes = days.map(d => `
      <label style="display:flex; align-items:center; gap: 8px; cursor:pointer; font-size:14px;">
        <input type="checkbox" name="availability-days" value="${d}" ${activeDays.includes(d) ? 'checked' : ''} style="width:auto;">
        ${d}
      </label>
    `).join('');

    tabContentHtml = `
      <div class="glass-card" style="max-width: 600px; margin: 0 auto;">
        <h3 style="margin-bottom: 24px;">Manage Service Profile</h3>
        <form id="pro-profile-update-form">
          <div class="form-group">
            <label style="color: #ffffff;">Service Category</label>
            <select id="pro-category" required style="width:100%; padding:12px 16px; border-radius:8px; border:1px solid #ffffff; background:#ffffff; color:#111827; font-weight:600; font-size:14px; outline:none; cursor:pointer;">
              <option value="Cleaning" ${providerInfo.category === 'Cleaning' ? 'selected' : ''} style="background:#ffffff; color:#111827;">Cleaning</option>
              <option value="Plumbing" ${providerInfo.category === 'Plumbing' ? 'selected' : ''} style="background:#ffffff; color:#111827;">Plumbing</option>
              <option value="Electrical" ${providerInfo.category === 'Electrical' ? 'selected' : ''} style="background:#ffffff; color:#111827;">Electrical</option>
              <option value="Appliance Repair" ${providerInfo.category === 'Appliance Repair' ? 'selected' : ''} style="background:#ffffff; color:#111827;">Appliance Repair</option>
              <option value="Beauty & Wellness" ${providerInfo.category === 'Beauty & Wellness' ? 'selected' : ''} style="background:#ffffff; color:#111827;">Beauty & Wellness</option>
              <option value="Pest Control" ${providerInfo.category === 'Pest Control' ? 'selected' : ''} style="background:#ffffff; color:#111827;">Pest Control</option>
              ${!['Cleaning','Plumbing','Electrical','Appliance Repair','Beauty & Wellness','Pest Control'].includes(providerInfo.category) && providerInfo.category ? `<option value="${providerInfo.category}" selected style="background:#ffffff; color:#111827;">${providerInfo.category}</option>` : ''}
            </select>
            <span style="font-size:11px; color:var(--text-muted)">Select your primary service category offering.</span>
          </div>
          <div class="form-group">
            <label>Hourly Rate (INR)</label>
            <input type="number" id="pro-hourly-rate" value="${providerInfo.hourly_rate}" required min="100" step="50">
          </div>
          <div class="form-group">
            <label>Bio / Description</label>
            <textarea id="pro-bio" rows="4" required>${providerInfo.bio || ''}</textarea>
          </div>
          <div class="form-group">
            <label style="margin-bottom: 12px;">Weekly Availability</label>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
              ${daysCheckboxes}
            </div>
            <div class="form-row">
              <div>
                <label style="font-size:12px;">Start Time</label>
                <input type="time" id="pro-start-time" value="${providerInfo.availability?.hours?.start || '09:00'}">
              </div>
              <div>
                <label style="font-size:12px;">End Time</label>
                <input type="time" id="pro-end-time" value="${providerInfo.availability?.hours?.end || '17:00'}">
              </div>
            </div>
          </div>
          <button class="btn btn-primary" type="submit" style="width:100%;">Save Changes</button>
        </form>
      </div>
    `;
  } else if (activeTab === 'reviews') {
    const reviews = providerInfo.reviews || [];
    tabContentHtml = `
      <div class="glass-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom: 24px;">
          <div>
            <h3 style="margin-bottom:4px; color:var(--text-white);">Customer Ratings & Performance Reviews</h3>
            <p style="font-size:13px; color:var(--text-muted);">Verified feedback and rating scores submitted by customers upon service completion</p>
          </div>
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,215,0,0.1); border:1px solid rgba(255,215,0,0.3); padding:10px 18px; border-radius:12px;">
            <span style="font-size:24px;">⭐</span>
            <div>
              <div style="font-size:20px; font-weight:700; color:var(--text-white);">${providerInfo.rating || '5.0'} / 5.0</div>
              <div style="font-size:12px; color:var(--text-muted);">${providerInfo.review_count || 0} Total Verified Reviews</div>
            </div>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:16px;">
          ${reviews.length > 0 ? reviews.map(r => `
            <div style="padding:16px; border-radius:12px; background:rgba(255,255,255,0.03); border:1px solid var(--border-glass);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <div class="user-avatar-indicator" style="width:34px; height:34px; font-size:14px;">${(r.customer_name || 'Customer').charAt(0).toUpperCase()}</div>
                  <div>
                    <strong style="color:var(--text-white); font-size:15px;">${r.customer_name || 'Customer'}</strong>
                    <div style="font-size:12px; color:var(--text-muted);">${r.created_at || 'Recently'}</div>
                  </div>
                </div>
                <div style="color:#ffd700; font-size:16px; font-weight:700;">
                  ${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))} <span style="color:var(--text-white); font-size:14px; margin-left:4px;">(${r.rating || 5}.0)</span>
                </div>
              </div>
              <p style="font-size:14px; color:var(--text-white); margin-top:8px; line-height:1.5;">"${r.comment || 'Great service provider! Very professional and completed the work on time.'}"</p>
            </div>
          `).join('') : `
            <div style="text-align:center; padding:40px; color:var(--text-muted);">
              <h3>No reviews submitted yet</h3>
              <p style="margin-top:6px;">As you complete jobs, satisfied customers will leave ratings and reviews here.</p>
            </div>
          `}
        </div>
      </div>
    `;
  }

  return `
    <div class="container animate-up" style="margin-top: 40px;">
      <h2>Pro Command Panel</h2>
      <p style="color: var(--text-muted)">Track your incoming jobs, update schedules, and review your total earnings</p>

      <!-- Stats Grid -->
      <div class="dashboard-grid">
        <div class="glass-card dashboard-stat-card dash-tab-link" data-tab="history" style="cursor:pointer;" title="Click to view earnings history">
          <div class="stat-card-details">
            <h3 style="color:var(--text-white);">${formatINR(totalEarnings)}</h3>
            <p style="color:var(--text-muted);">Earnings &rarr;</p>
          </div>
          <div class="stat-card-icon">${Icons.dollarSign}</div>
        </div>
        <div class="glass-card dashboard-stat-card dash-tab-link" data-tab="reviews" style="cursor:pointer; border:1px solid rgba(255,215,0,0.3); background:rgba(255,215,0,0.05);" title="Click to open Rating & Reviews">
          <div class="stat-card-details">
            <h3 style="color:#ffd700;">${providerInfo.rating || '5.0'} ★</h3>
            <p style="font-weight:600; color:var(--text-white);">Rating (${providerInfo.review_count || 0} reviews) &rarr;</p>
          </div>
          <div class="stat-card-icon">${Icons.star}</div>
        </div>
        <div class="glass-card dashboard-stat-card dash-tab-link" data-tab="jobs" style="cursor:pointer;" title="Click to view new requests">
          <div class="stat-card-details">
            <h3 style="color:var(--primary);">${pendingJobs}</h3>
            <p style="font-weight:600; color:var(--text-white);">New Requests &rarr;</p>
          </div>
          <div class="stat-card-icon">${Icons.briefcase}</div>
        </div>
        <div class="glass-card dashboard-stat-card dash-tab-link" data-tab="jobs" style="cursor:pointer;" title="Click to view active work">
          <div class="stat-card-details">
            <h3 style="color:var(--success);">${activeJobs}</h3>
            <p style="font-weight:600; color:var(--text-white);">Active Work &rarr;</p>
          </div>
          <div class="stat-card-icon">${Icons.checkCircle}</div>
        </div>
      </div>

      <!-- Tab Selection -->
      <div class="dashboard-tabs">
        <span class="dash-tab-link ${activeTab === 'jobs' ? 'active' : ''}" data-tab="jobs">Active Jobs (${activeJobs + pendingJobs})</span>
        <span class="dash-tab-link ${activeTab === 'history' ? 'active' : ''}" data-tab="history">Job History (${completedJobsCount})</span>
        <span class="dash-tab-link ${activeTab === 'reviews' ? 'active' : ''}" data-tab="reviews">⭐ Ratings & Reviews (${providerInfo.review_count || 0})</span>
        <span class="dash-tab-link ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile">Service Profile</span>
      </div>

      <!-- Tab Body -->
      <div class="bookings-section">
        ${tabContentHtml}
      </div>
    </div>
  `;
}

// ==========================================================================
// ADMIN DASHBOARD
// ==========================================================================
export function renderAdminDashboard(statsData, usersList, categoriesList, activeTab = 'overview') {
  let tabContentHtml = '';

  if (activeTab === 'overview') {
    tabContentHtml = `
      <div class="dashboard-grid">
        <div class="glass-card dashboard-stat-card">
          <div class="stat-card-details">
            <h3>${statsData.stats.totalUsers}</h3>
            <p>Registered Users</p>
          </div>
          <div class="stat-card-icon">${Icons.users}</div>
        </div>
        <div class="glass-card dashboard-stat-card">
          <div class="stat-card-details">
            <h3>${statsData.stats.totalProviders}</h3>
            <p>Service Providers</p>
          </div>
          <div class="stat-card-icon">${Icons.briefcase}</div>
        </div>
        <div class="glass-card dashboard-stat-card dash-tab-link" data-tab="requests" style="cursor:pointer; border:1px solid var(--primary-glow); background:rgba(56,189,248,0.08);" title="Click to view Customer Service Requests">
          <div class="stat-card-details">
            <h3 style="color:var(--primary);">${(statsData.allBookings || []).filter(b => b.status === 'pending' || b.admin_approved === 0).length}</h3>
            <p style="font-weight:600; color:var(--text-white);">Pending Allocations &rarr;</p>
          </div>
          <div class="stat-card-icon">${Icons.checkCircle}</div>
        </div>
        <div class="glass-card dashboard-stat-card dash-tab-link" data-tab="finance" style="cursor:pointer; border:1px solid rgba(46,196,182,0.3); background:rgba(46,196,182,0.06);" title="Click to open Admin Financial Ledger">
          <div class="stat-card-details">
            <h3 style="color:var(--success);">${formatINR(statsData.stats.totalEarnings)}</h3>
            <p style="font-weight:600; color:var(--text-white);">Gross Customer Payments &rarr;</p>
          </div>
          <div class="stat-card-icon">${Icons.dollarSign}</div>
        </div>
      </div>

      <div class="form-row" style="margin-top:20px;">
        <div class="glass-card" style="flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 style="font-size:16px;">Net Admin Platform Profit (20% Retained)</h3>
            <strong style="font-size:22px; color:var(--primary);">${formatINR(statsData.stats.totalAdminProfit || (statsData.stats.totalEarnings * 0.20))}</strong>
          </div>
          <p style="font-size:13px; color:var(--text-muted);">High margin platform revenue retained directly by Admin from customer service bookings.</p>
        </div>
        <div class="glass-card" style="flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 style="font-size:16px;">Provider Payouts Disbursed (80%)</h3>
            <strong style="font-size:22px; color:var(--text-white);">${formatINR(statsData.stats.totalDisbursedToProviders || 0)}</strong>
          </div>
          <p style="font-size:13px; color:var(--text-muted);">Net earnings disbursed from Admin Escrow to Service Providers upon job approval.</p>
        </div>
      </div>

      <div class="form-row">
        <!-- Bookings Status count -->
        <div class="glass-card">
          <h3 style="margin-bottom:16px;">Bookings by Status</h3>
          <table class="admin-data-table" style="font-size: 14px;">
            <thead>
              <tr><th>Status</th><th>Count</th></tr>
            </thead>
            <tbody>
              ${statsData.bookingsByStatus.map(b => `
                <tr>
                  <td><span class="status-badge status-${b.status}">${b.status}</span></td>
                  <td><strong>${b.count}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <!-- Category popularity -->
        <div class="glass-card">
          <h3 style="margin-bottom:16px;">Most Popular Services</h3>
          <table class="admin-data-table" style="font-size: 14px;">
            <thead>
              <tr><th>Category</th><th>Bookings Count</th></tr>
            </thead>
            <tbody>
              ${statsData.categoryPopularity.map(c => `
                <tr>
                  <td>${c.category}</td>
                  <td><strong>${c.count}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (activeTab === 'requests') {
    const bookings = statsData.allBookings || [];
    const approvedPros = statsData.approvedProviders || [];

    tabContentHtml = `
      <div class="glass-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom: 24px;">
          <div>
            <h3 style="margin-bottom:4px; color:var(--text-white);">Customer Service Requests & Provider Dispatch Console</h3>
            <p style="font-size:13px; color:var(--text-muted);">Review customer service needs, approve requests, and allocate the best available service provider</p>
          </div>
          <span class="status-badge status-in_progress" style="font-size:13px; padding:6px 14px;">
            ${bookings.filter(b => b.admin_approved === 0 || b.status === 'pending').length} Pending Dispatch
          </span>
        </div>

        <div class="admin-data-table-wrapper">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Request Ref</th>
                <th>Customer Name</th>
                <th>Service Required</th>
                <th>Delivery Address</th>
                <th>Schedule & Hours</th>
                <th>Current Status</th>
                <th>Allocate Provider & Approve</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.length > 0 ? bookings.map(b => {
                const matchingPros = approvedPros.filter(p => p.category === b.category);
                const isApproved = b.admin_approved === 1 && b.status !== 'pending';

                return `
                  <tr>
                    <td><strong>#REQ-${b.id}</strong></td>
                    <td><strong>${b.customer_name || 'Customer'}</strong></td>
                    <td><span style="font-weight:600; color:var(--primary);">${b.category}</span></td>
                    <td style="font-size:13px; max-width:200px;">${b.address}</td>
                    <td>${b.booking_date} @ ${b.booking_time} (${b.duration_hours}h)</td>
                    <td>
                      <span class="status-badge status-${b.status}">${b.status.replace('_', ' ')}</span>
                      ${b.admin_approved ? '<div style="font-size:11px; color:var(--success); margin-top:2px;">✓ Admin Approved</div>' : '<div style="font-size:11px; color:var(--warning); margin-top:2px;">⌛ Needs Approval</div>'}
                    </td>
                    <td>
                      ${isApproved ? `
                        <div style="font-size:13px; margin-bottom:4px;">
                          <strong style="color:var(--text-white);">${b.provider_name || 'Assigned Pro'}</strong>
                          <span style="font-size:11px; color:var(--text-muted); display:block;">Allocated (${formatINR(b.total_price)})</span>
                        </div>
                        ${b.status === 'completed' || b.provider_completed || b.status === 'in_progress' ? `
                          ${b.admin_completion_confirmed ? `
                            <span class="status-badge status-completed" style="font-size:11px;">✓ Work Confirmed & Rating Unlocked</span>
                          ` : `
                            <button class="btn btn-primary btn-sm btn-admin-confirm-completion" data-booking-id="${b.id}" style="font-size:11px; font-weight:700; background:var(--success); border:none; padding:4px 8px;">
                              ✓ Confirm Work & Unlock Customer Rating
                            </button>
                          `}
                        ` : ''}
                      ` : `
                        <div style="display:flex; gap:6px; align-items:center;">
                          <select class="admin-provider-select" id="select-pro-${b.id}" style="padding:6px 8px; font-size:12px; border-radius:6px; background:rgba(255,255,255,0.06); color:var(--text-white); border:1px solid var(--border-glass);">
                            <option value="">Select Pro (${matchingPros.length} avail)</option>
                            ${approvedPros.map(p => `
                              <option value="${p.id}" ${p.id === b.provider_id ? 'selected' : ''}>
                                ${p.name} (${p.category} - ${formatINR(p.hourly_rate)}/hr)
                              </option>
                            `).join('')}
                          </select>
                          <button class="btn btn-primary btn-sm btn-admin-allocate" data-booking-id="${b.id}">Approve & Assign</button>
                        </div>
                      `}
                    </td>
                  </tr>
                `;
              }).join('') : `
                <tr><td colspan="7" style="text-align:center; padding:28px; color:var(--text-muted);">No service requests currently in system.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (activeTab === 'finance') {
    const bookings = statsData.allBookings || [];

    tabContentHtml = `
      <div class="glass-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom: 24px;">
          <div>
            <h3 style="margin-bottom:4px; color:var(--text-white);">Admin Financial Ledger & Provider Disbursement Console</h3>
            <p style="font-size:13px; color:var(--text-muted);">Track customer payments received by Admin Escrow, calculate Admin 20% platform profit margin, and disburse provider payouts</p>
          </div>
          <span class="status-badge status-completed" style="font-size:13px; padding:6px 14px;">
            High Customer Payments: ${formatINR(statsData.stats.totalEarnings)}
          </span>
        </div>

        <div class="admin-data-table-wrapper">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Customer</th>
                <th>Provider</th>
                <th>Gross Payment Received</th>
                <th>Admin Margin (20%)</th>
                <th>Net Provider Payout (80%)</th>
                <th>Payment Escrow Status</th>
                <th>Disburse Payout</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.length > 0 ? bookings.map(b => {
                const grossPrice = b.total_price || 100;
                const adminProfit = b.admin_margin || (grossPrice * 0.20);
                const providerNet = b.provider_payout || (grossPrice * 0.80);
                const isPaidToAdmin = b.payment_status === 'paid_to_admin' || b.status === 'completed' || b.status === 'in_progress';
                const isDisbursed = b.payout_status === 'disbursed';

                return `
                  <tr>
                    <td><strong>#BK-${b.id}</strong></td>
                    <td><strong>${b.customer_name || 'Customer'}</strong></td>
                    <td>${b.provider_name || 'Provider'}</td>
                    <td><strong style="color:var(--success); font-size:15px;">${formatINR(grossPrice)}</strong></td>
                    <td><strong style="color:var(--primary); font-size:14px;">${formatINR(adminProfit)}</strong></td>
                    <td><strong style="color:var(--text-white); font-size:14px;">${formatINR(providerNet)}</strong></td>
                    <td>
                      ${isPaidToAdmin ? `
                        <span class="status-badge status-completed">Paid to Admin</span>
                      ` : `
                        <button class="btn btn-outline btn-sm btn-admin-receive-pay" data-booking-id="${b.id}">Collect Payment</button>
                      `}
                    </td>
                    <td>
                      ${isDisbursed ? `
                        <span class="status-badge status-completed">✓ Disbursed</span>
                      ` : `
                        <button class="btn btn-primary btn-sm btn-admin-disburse-payout" data-booking-id="${b.id}">Release Payout</button>
                      `}
                    </td>
                  </tr>
                `;
              }).join('') : `
                <tr><td colspan="8" style="text-align:center; padding:28px; color:var(--text-muted);">No transaction records in financial ledger.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (activeTab === 'users') {
    tabContentHtml = `
      <div class="glass-card">
        <h3 style="margin-bottom: 20px;">Customer & Provider Administration</h3>
        <div class="admin-data-table-wrapper">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Details (Rate/Cat)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${usersList.map(u => `
                <tr>
                  <td>${u.id}</td>
                  <td><strong>${u.name}</strong></td>
                  <td>${u.email}</td>
                  <td><span style="font-size:12px; font-weight:600; text-transform:uppercase;">${u.role}</span></td>
                  <td>${u.role === 'provider' ? `${u.category} (${formatINR(u.hourly_rate)}/hr)` : '-'}</td>
                  <td>
                    ${u.role === 'provider' ? `
                      <span class="status-badge ${u.provider_status === 'approved' ? 'status-completed' : 'status-cancelled'}">
                        ${u.provider_status || 'approved'}
                      </span>
                    ` : '<span class="status-badge status-completed">Active</span>'}
                  </td>
                  <td>
                    ${u.role === 'provider' ? `
                      ${u.provider_status === 'approved' ? `
                        <button class="btn btn-danger btn-sm btn-admin-toggle-status" data-user-id="${u.id}" data-new-status="suspended">Suspend</button>
                      ` : `
                        <button class="btn btn-primary btn-sm btn-admin-toggle-status" data-user-id="${u.id}" data-new-status="approved">Approve</button>
                      `}
                    ` : '-'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (activeTab === 'categories') {
    tabContentHtml = `
      <div class="services-layout" style="margin-top:0;">
        <div class="glass-card">
          <h3 style="margin-bottom: 16px;">Add New Category</h3>
          <form id="admin-add-category-form">
            <div class="form-group">
              <label>Category Name</label>
              <input type="text" id="admin-cat-name" required placeholder="e.g. Gardening">
            </div>
            <div class="form-group">
              <label>Icon Key</label>
              <select id="admin-cat-icon">
                <option value="cleaning">Cleaning</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="appliances">Appliances</option>
                <option value="beauty">Beauty & Salon</option>
                <option value="pest">Pest Control</option>
              </select>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea id="admin-cat-desc" rows="3" required placeholder="Describe what tasks this category handles..."></textarea>
            </div>
            <button class="btn btn-primary" type="submit" style="width:100%;">Create Category</button>
          </form>
        </div>

        <div class="glass-card">
          <h3 style="margin-bottom: 20px;">System Categories</h3>
          <table class="admin-data-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Description</th><th>Action</th></tr>
            </thead>
            <tbody>
              ${categoriesList.map(c => `
                <tr>
                  <td>${c.id}</td>
                  <td><strong>${c.name}</strong></td>
                  <td style="font-size:13px; color:var(--text-muted)">${c.description}</td>
                  <td>
                    <button class="btn btn-danger btn-sm btn-admin-delete-cat" data-cat-id="${c.id}">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (activeTab === 'bookings') {
    const allBookings = statsData.allBookings || [];
    tabContentHtml = `
      <div class="glass-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom: 20px;">
          <div>
            <h3 style="margin-bottom:4px; color:var(--text-white);">Total System Booking History</h3>
            <p style="font-size:13px; color:var(--text-muted);">Complete record of all customer booking requests and appointments across all services</p>
          </div>
          <div style="display:flex; gap:8px;">
            <span class="status-badge status-completed" style="font-size:13px; padding:6px 14px;">${allBookings.filter(b => b.status === 'completed').length} Completed</span>
            <span class="status-badge status-in_progress" style="font-size:13px; padding:6px 14px;">${allBookings.filter(b => b.status === 'in_progress' || b.status === 'accepted').length} Active</span>
          </div>
        </div>
        <div class="admin-data-table-wrapper">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Customer</th>
                <th>Provider</th>
                <th>Service Category</th>
                <th>Date & Time</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${allBookings.length > 0 ? allBookings.map(b => `
                <tr>
                  <td><strong>#BK-${b.id}</strong></td>
                  <td><strong>${b.customer_name || 'Customer'}</strong></td>
                  <td>${b.provider_name || 'Provider'}</td>
                  <td><span style="font-weight:600; color:var(--primary);">${b.category}</span></td>
                  <td>${b.booking_date} @ ${b.booking_time} (${b.duration_hours}h)</td>
                  <td><strong style="color:var(--text-white);">${formatINR(b.total_price)}</strong></td>
                  <td><span class="status-badge status-${b.status}">${b.status.replace('_', ' ')}</span></td>
                </tr>
              `).join('') : `
                <tr><td colspan="7" style="text-align:center; padding:28px; color:var(--text-muted);">No booking history records found in system.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (activeTab === 'logins') {
    const logins = statsData.loginHistory || [];
    tabContentHtml = `
      <div class="glass-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom: 20px;">
          <div>
            <h3 style="margin-bottom:4px; color:var(--text-white);">Real-Time Admin & User Login Audit History</h3>
            <p style="font-size:13px; color:var(--text-muted);">Real-time live audit log of all administrator, customer, and provider authentication events</p>
          </div>
          <span class="status-badge status-completed" style="font-size:13px; padding:6px 14px;">⚡ Real-Time Active Audit Log</span>
        </div>
        <div class="admin-data-table-wrapper">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>User Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>IP Address</th>
                <th>Login Timestamp</th>
              </tr>
            </thead>
            <tbody>
              ${logins.length > 0 ? logins.map(l => `
                <tr>
                  <td><strong>#LOG-${l.id}</strong></td>
                  <td><strong>${l.user_name}</strong></td>
                  <td>${l.email}</td>
                  <td>
                    <span class="status-badge ${l.role === 'admin' ? 'status-cancelled' : (l.role === 'provider' ? 'status-in_progress' : 'status-completed')}">
                      ${l.role.toUpperCase()}
                    </span>
                  </td>
                  <td><code style="background:rgba(255,255,255,0.06); padding:2px 8px; border-radius:4px; font-size:12px;">${l.ip_address || '127.0.0.1'}</code></td>
                  <td><span style="color:var(--primary); font-weight:600;">${l.login_time}</span></td>
                </tr>
              `).join('') : `
                <tr><td colspan="6" style="text-align:center; padding:28px; color:var(--text-muted);">No login events recorded yet. Log in as Customer, Provider, or Admin to generate real-time audit logs.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (activeTab === 'reviews') {
    const reviews = statsData.allReviews || [];
    tabContentHtml = `
      <div class="glass-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom: 20px;">
          <div>
            <h3 style="margin-bottom:4px; color:var(--text-white);">⭐ Customer Ratings & Feedback Audit Console</h3>
            <p style="font-size:13px; color:var(--text-muted);">Real-time database audit of all verified customer ratings, star scores, and written service feedback</p>
          </div>
          <span class="status-badge status-completed" style="font-size:13px; padding:6px 14px;">${reviews.length} Verified Customer Reviews</span>
        </div>
        <div class="admin-data-table-wrapper">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Review Ref</th>
                <th>Customer Name</th>
                <th>Service Provider</th>
                <th>Category</th>
                <th>Star Rating</th>
                <th>Written Customer Feedback</th>
                <th>Submitted Timestamp</th>
              </tr>
            </thead>
            <tbody>
              ${reviews.length > 0 ? reviews.map(r => `
                <tr>
                  <td><strong>#REV-${r.id}</strong></td>
                  <td><strong>${r.customer_name || 'Customer'}</strong></td>
                  <td><strong style="color:var(--primary);">${r.provider_name || 'Provider'}</strong></td>
                  <td><span class="status-badge status-completed" style="font-size:12px;">${r.category}</span></td>
                  <td>
                    <div style="color:#ffd700; font-weight:700; font-size:15px;">
                      ${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}
                      <span style="color:var(--text-white); font-size:13px; margin-left:4px;">(${r.rating}.0)</span>
                    </div>
                  </td>
                  <td style="max-width:280px; font-size:13px; color:var(--text-white); line-height:1.4;">
                    "${r.comment || 'Great service provider! Very polite and completed the work efficiently.'}"
                  </td>
                  <td><span style="font-size:12px; color:var(--text-muted);">${r.created_at || 'Recently'}</span></td>
                </tr>
              `).join('') : `
                <tr><td colspan="7" style="text-align:center; padding:28px; color:var(--text-muted);">No customer reviews submitted yet. When customers rate completed services, feedback will appear here in real time.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (activeTab === 'complaints') {
    const complaints = statsData.allComplaints || [];
    tabContentHtml = `
      <div class="glass-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom: 20px;">
          <div>
            <h3 style="margin-bottom:4px; color:var(--text-white);">🚩 Customer Complaints & Provider Disputes Audit Console</h3>
            <p style="font-size:13px; color:var(--text-muted);">Investigate customer escalations against service providers, update status, and issue resolution notes</p>
          </div>
          <span class="status-badge status-cancelled" style="font-size:13px; padding:6px 14px;">${complaints.filter(c => c.status === 'Pending').length} Pending Action</span>
        </div>
        <div class="admin-data-table-wrapper">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Complaint Ref</th>
                <th>Customer Name</th>
                <th>Service Provider</th>
                <th>Category</th>
                <th>Reason / Subject & Details</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Take Admin Action & Resolution Notes</th>
              </tr>
            </thead>
            <tbody>
              ${complaints.length > 0 ? complaints.map(c => `
                <tr>
                  <td><strong>#CMP-${c.id}</strong></td>
                  <td><strong>${c.customer_name || 'Customer'}</strong></td>
                  <td><strong style="color:var(--primary);">${c.provider_name || 'Provider'}</strong></td>
                  <td>${c.category}</td>
                  <td style="max-width:240px;">
                    <strong style="color:var(--text-white); display:block;">${c.subject}</strong>
                    <span style="font-size:12px; color:var(--text-muted); line-height:1.3;">"${c.description}"</span>
                  </td>
                  <td><span class="status-badge status-${c.priority === 'High' ? 'cancelled' : 'accepted'}" style="font-size:11px;">${c.priority}</span></td>
                  <td><span class="status-badge status-${c.status === 'Resolved' ? 'completed' : (c.status === 'Investigating' ? 'in_progress' : 'pending')}" style="font-size:12px;">${c.status}</span></td>
                  <td>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                      <select class="admin-complaint-status" id="complaint-status-${c.id}" style="padding:4px 8px; font-size:12px; border-radius:6px; background:rgba(255,255,255,0.06); color:var(--text-white); border:1px solid var(--border-glass);">
                        <option value="Pending" ${c.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Investigating" ${c.status === 'Investigating' ? 'selected' : ''}>Investigating</option>
                        <option value="Resolved" ${c.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                        <option value="Dismissed" ${c.status === 'Dismissed' ? 'selected' : ''}>Dismissed</option>
                      </select>
                      <input type="text" id="complaint-notes-${c.id}" value="${c.resolution_notes || ''}" placeholder="Resolution notes..." style="padding:4px 8px; font-size:12px; border-radius:6px; background:rgba(255,255,255,0.06); color:var(--text-white); border:1px solid var(--border-glass);">
                      <button class="btn btn-primary btn-sm btn-admin-update-complaint" data-complaint-id="${c.id}">Save Resolution</button>
                    </div>
                  </td>
                </tr>
              `).join('') : `
                <tr><td colspan="8" style="text-align:center; padding:28px; color:var(--text-muted);">No customer complaints filed in the system.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  return `
    <div class="container animate-up" style="margin-top: 40px;">
      <h2>Administrator Dashboard</h2>
      <p style="color: var(--text-muted)">Monitor site statistics, authorize providers, and regulate categories.</p>

      <div class="dashboard-tabs" style="margin-top: 24px;">
        <span class="dash-tab-link ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">Overview</span>
        <span class="dash-tab-link ${activeTab === 'requests' ? 'active' : ''}" data-tab="requests">📥 Customer Requests & Dispatch</span>
        <span class="dash-tab-link ${activeTab === 'finance' ? 'active' : ''}" data-tab="finance">💳 Financial Ledger & Payouts</span>
        <span class="dash-tab-link ${activeTab === 'reviews' ? 'active' : ''}" data-tab="reviews">⭐ Customer Ratings & Feedback (${(statsData.allReviews || []).length})</span>
        <span class="dash-tab-link ${activeTab === 'complaints' ? 'active' : ''}" data-tab="complaints">🚩 Complaints & Disputes (${(statsData.allComplaints || []).length})</span>
        <span class="dash-tab-link ${activeTab === 'bookings' ? 'active' : ''}" data-tab="bookings">Total Booking History (${statsData.stats.totalBookings})</span>
        <span class="dash-tab-link ${activeTab === 'users' ? 'active' : ''}" data-tab="users">Users & Pros (${statsData.stats.totalUsers})</span>
        <span class="dash-tab-link ${activeTab === 'categories' ? 'active' : ''}" data-tab="categories">Service Categories (${categoriesList.length})</span>
        <span class="dash-tab-link ${activeTab === 'logins' ? 'active' : ''}" data-tab="logins">⚡ Real-Time Login Audit</span>
      </div>

      <div style="margin-top: 24px;">
        ${tabContentHtml}
      </div>
    </div>
  `;
}

// ==========================================================================
// MODALS GENERATOR FUNCTIONS
// ==========================================================================

export function renderLoginModal(mode = 'login', entryGate = false) {
  const isRegister = mode === 'register';
  return `
    <div class="modal-overlay ${entryGate ? 'auth-entry-gate' : ''}" id="login-modal-overlay">
      <div class="modal-content-wrapper">
        <div class="modal-header">
          <div>
            <h3>${isRegister ? 'Create your account' : entryGate ? 'Welcome to ApexServices' : 'Welcome back'}</h3>
            <p class="auth-entry-subtitle">${isRegister ? 'Register first, then use your email and password to sign in.' : 'Sign in with the email and password you registered with.'}</p>
          </div>
          ${entryGate ? '' : '<button class="modal-close-btn" id="modal-close">&times;</button>'}
        </div>
        
        <div class="modal-body">
          
          <!-- Login Form -->
          <form id="auth-login-form" class="${isRegister ? 'hidden' : ''}">
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" id="login-email" required placeholder="you@example.com">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" id="login-password" required placeholder="••••••••">
            </div>
            <button class="btn btn-primary" type="submit" style="width: 100%; margin-top: 10px;">Sign In</button>
          </form>

          <!-- Register Form (Initially Hidden) -->
          <form id="auth-register-form" class="${isRegister ? '' : 'hidden'}">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="reg-name" required placeholder="John Doe">
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" id="reg-email" required placeholder="you@example.com">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" id="reg-password" required placeholder="At least 6 characters">
            </div>
            
            <div class="form-group">
              <label>I want to sign up as a:</label>
              <select id="reg-role" required>
                <option value="customer">Customer (Looking for services)</option>
                <option value="provider">Service Provider (Offering services)</option>
                <option value="admin">Administrator (Manage Platform)</option>
              </select>
            </div>

            <!-- Service Provider Extra Fields -->
            <div id="provider-fields" class="hidden">
              <div class="form-group">
                <label>Select Category</label>
                <select id="reg-cat">
                  <option value="Cleaning">Cleaning</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Appliance Repair">Appliance Repair</option>
                  <option value="Beauty & Wellness">Beauty & Wellness</option>
                  <option value="Pest Control">Pest Control</option>
                </select>
              </div>
              <div class="form-group">
                <label>Hourly Rate (INR)</label>
                <input type="number" id="reg-rate" placeholder="e.g. 750" min="100">
              </div>
              <div class="form-group">
                <label>Bio / Experience</label>
                <textarea id="reg-bio" rows="2" placeholder="Briefly describe your skill and work history..."></textarea>
              </div>
            </div>

            <button class="btn btn-primary" type="submit" style="width: 100%; margin-top: 10px;">Create Account</button>
          </form>

        </div>
      </div>
    </div>
  `;
}

export function renderBookingModal(provider) {
  // Get tomorrow's date for default date selector minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return `
    <div class="modal-overlay" id="booking-modal-overlay">
      <div class="modal-content-wrapper">
        <div class="modal-header">
          <h3>Book Appointment</h3>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div style="display:flex; align-items:center; gap: 12px; margin-bottom: 20px; background:rgba(255,255,255,0.02); padding: 12px; border-radius: 8px;">
            <div class="provider-avatar-lg" style="width:40px; height:40px; font-size:16px; border-radius:8px;">${provider.name.charAt(0)}</div>
            <div>
              <strong style="color:var(--text-white)">${provider.name}</strong>
              <div style="font-size: 12px; color: var(--primary)">${provider.category} &bull; ${formatINR(provider.hourly_rate)}/hr</div>
            </div>
          </div>

          <form id="booking-creation-form">
            <input type="hidden" id="booking-provider-id" value="${provider.id}">
            <input type="hidden" id="booking-category" value="${provider.category}">
            
            <div class="form-row">
              <div class="form-group">
                <label>Preferred Date</label>
                <input type="date" id="booking-date" min="${minDate}" required>
              </div>
              <div class="form-group">
                <label>Preferred Time</label>
                <input type="time" id="booking-time" required>
              </div>
            </div>

            <div class="form-group">
              <label>Estimated Hours Required</label>
              <select id="booking-duration">
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
                <option value="4">4 hours</option>
                <option value="5">5 hours or more</option>
              </select>
            </div>

            <div class="form-group">
              <label>Service Delivery Address</label>
              <input type="text" id="booking-address" required placeholder="Street address, Apartment #, City">
            </div>

            <div class="form-group">
              <label>Additional Notes / Instructions</label>
              <textarea id="booking-notes" rows="2" placeholder="Tell the provider about special tasks or tools needed..."></textarea>
            </div>

            <div style="margin-top:20px; padding:16px; background:rgba(102,252,241,0.05); border: 1px dashed var(--primary); border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
              <div>Estimated Total:</div>
              <div style="font-size:24px; font-weight:700; color:var(--primary);" id="booking-estimated-price">${formatINR(provider.hourly_rate)}</div>
            </div>

            <div class="booking-modal-actions">
              <button class="btn btn-quiet" type="button" id="booking-cancel-btn">Cancel</button>
              <button class="btn btn-primary" type="submit">Confirm booking</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

export function renderReviewModal(bookingId) {
  return `
    <div class="modal-overlay" id="review-modal-overlay">
      <div class="modal-content-wrapper">
        <div class="modal-header">
          <h3>Leave Feedback</h3>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <form id="review-submission-form">
            <input type="hidden" id="review-booking-id" value="${bookingId}">
            
            <label style="display:block; text-align:center; font-weight:500; font-size:14px;">How was your service experience?</label>
            
            <!-- Star Rating Input Group -->
            <div class="star-rating-selector">
              <input type="radio" id="star5" name="review-rating" value="5" required><label for="star5" title="5 stars">&#9733;</label>
              <input type="radio" id="star4" name="review-rating" value="4"><label for="star4" title="4 stars">&#9733;</label>
              <input type="radio" id="star3" name="review-rating" value="3"><label for="star3" title="3 stars">&#9733;</label>
              <input type="radio" id="star2" name="review-rating" value="2"><label for="star2" title="2 stars">&#9733;</label>
              <input type="radio" id="star1" name="review-rating" value="1"><label for="star1" title="1 star">&#9733;</label>
            </div>

            <div class="form-group" style="margin-top:16px;">
              <label>Written Review</label>
              <textarea id="review-comment" rows="4" required placeholder="Detail your service quality, punctuality, and responsiveness..."></textarea>
            </div>

            <button class="btn btn-primary" type="submit" style="width: 100%; margin-top: 10px;">Submit Review</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

export function renderRaiseComplaintModal(booking) {
  return `
    <div class="modal-overlay" id="complaint-modal-overlay">
      <div class="modal-content-wrapper" style="max-width:520px;">
        <div class="modal-header">
          <div>
            <h3 style="color:#f87171; font-size:18px;">🚩 Raise Provider Escalation / Complaint</h3>
            <p style="font-size:12px; color:var(--text-muted);">Booking #${booking.id} &bull; ${booking.category} with ${booking.provider_name}</p>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <div class="modal-body" style="padding:20px;">
          <form id="raise-complaint-submission-form">
            <input type="hidden" id="complaint-booking-id" value="${booking.id}">

            <div class="form-group">
              <label>Complaint Reason / Subject</label>
              <select id="complaint-subject" required>
                <option value="">Select Reason...</option>
                <option value="Unprofessional or Rude Behavior">Unprofessional or Rude Behavior</option>
                <option value="Overcharging / Demanding Extra Cash">Overcharging / Demanding Extra Cash</option>
                <option value="Delayed Arrival / No Show">Delayed Arrival / No Show</option>
                <option value="Incomplete or Poor Quality Work">Incomplete or Poor Quality Work</option>
                <option value="Property Damage / Safety Concern">Property Damage / Safety Concern</option>
                <option value="Other Issue">Other Issue</option>
              </select>
            </div>

            <div class="form-group">
              <label>Urgency Priority</label>
              <select id="complaint-priority">
                <option value="Medium">Medium Priority</option>
                <option value="High">High Urgency</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div class="form-group">
              <label>Detailed Description of Incident</label>
              <textarea id="complaint-description" rows="4" required placeholder="Explain what happened during the service appointment..."></textarea>
            </div>

            <button class="btn btn-danger" type="submit" style="width: 100%; margin-top: 12px; font-weight:700;">Submit Escalation to Admin</button>
          </form>
        </div>
      </div>
    </div>
  `;
}
export function renderInvoiceModal(booking) {
  const subtotal = booking.total_price || 100;
  const gstTax = subtotal * 0.18;
  const platformFee = 25;
  const grandTotal = subtotal + gstTax + platformFee;

  return `
    <div class="modal-overlay" id="invoice-modal-overlay">
      <div class="modal-content-wrapper modal-lg" style="max-width:650px;">
        <div class="modal-header" style="border-bottom:1px solid var(--border-glass);">
          <div>
            <h3 style="color:var(--text-white); font-size:20px;">📄 Official Monthly Expenditure Invoice</h3>
            <p style="font-size:12px; color:var(--text-muted);">Invoice Ref: #INV-BK${booking.id} &bull; Date: ${booking.booking_date}</p>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>

        <div class="modal-body" style="padding:24px; font-size:14px;" id="printable-invoice-content">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:16px;">
            <div>
              <div style="font-size:22px; font-weight:800; color:var(--primary); letter-spacing:1px;">ApexServices Inc.</div>
              <div style="font-size:12px; color:var(--text-muted);">On-Demand Service Booking Platform</div>
              <div style="font-size:12px; color:var(--text-muted);">Tax Registration: GSTIN36AAACA0000A1Z5</div>
            </div>
            <div style="text-align:right;">
              <span class="status-badge status-completed" style="font-size:13px; padding:6px 14px;">✓ OFFICIAL PAID INVOICE</span>
              <div style="font-size:12px; color:var(--text-muted); margin-top:6px;">Billing Date: ${booking.booking_date}</div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px; background:rgba(255,255,255,0.02); padding:16px; border-radius:12px;">
            <div>
              <span style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); display:block; margin-bottom:4px;">Billed To (Customer):</span>
              <strong style="color:var(--text-white); font-size:15px;">${booking.customer_name || 'Customer'}</strong>
              <div style="font-size:13px; color:var(--text-muted); margin-top:4px;">${booking.address}</div>
            </div>
            <div>
              <span style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); display:block; margin-bottom:4px;">Assigned Service Partner:</span>
              <strong style="color:var(--primary); font-size:15px;">${booking.provider_name || 'Service Partner'}</strong>
              <div style="font-size:13px; color:var(--text-muted); margin-top:4px;">Category: ${booking.category}</div>
            </div>
          </div>

          <table class="admin-data-table" style="margin-bottom:24px;">
            <thead>
              <tr>
                <th>Service Description</th>
                <th>Hours</th>
                <th>Rate</th>
                <th style="text-align:right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${booking.category} Service Appointment</strong></td>
                <td>${booking.duration_hours || 1} hrs</td>
                <td>${formatINR(subtotal / (booking.duration_hours || 1))}/hr</td>
                <td style="text-align:right;"><strong>${formatINR(subtotal)}</strong></td>
              </tr>
              <tr>
                <td colspan="3" style="text-align:right; color:var(--text-muted);">GST Tax (18%):</td>
                <td style="text-align:right; color:var(--text-muted);">${formatINR(gstTax)}</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align:right; color:var(--text-muted);">Platform Convenience Fee:</td>
                <td style="text-align:right; color:var(--text-muted);">${formatINR(platformFee)}</td>
              </tr>
              <tr style="font-size:16px; background:rgba(56,189,248,0.06);">
                <td colspan="3" style="text-align:right; font-weight:700; color:var(--text-white);">Grand Total Paid:</td>
                <td style="text-align:right;"><strong style="color:var(--success); font-size:18px;">${formatINR(grandTotal)}</strong></td>
              </tr>
            </tbody>
          </table>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; color:var(--text-muted);">Thank you for choosing ApexServices!</span>
            <button class="btn btn-primary" onclick="window.print()">🖨️ Print / Save GST Invoice PDF</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderExpenditureStatementModal(fromDate, toDate, bookings, user) {
  const totalSpent = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
  const avgSpent = bookings.length > 0 ? totalSpent / bookings.length : 0;
  const fromText = fromDate || 'Beginning of Account';
  const toText = toDate || 'Present Date';

  return `
    <div class="modal-overlay" id="expenditure-statement-modal-overlay">
      <div class="modal-content-wrapper modal-lg" style="max-width:750px;">
        <div class="modal-header" style="border-bottom:1px solid var(--border-glass);">
          <div>
            <h3>Financial Expenditure Statement</h3>
            <p style="font-size:12px; color:var(--text-muted);">Customer Bill Audit Report &bull; ${fromText} to ${toText}</p>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>

        <div class="modal-body" style="padding:24px; font-size:14px;" id="printable-statement-content">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:16px;">
            <div>
              <div style="font-size:22px; font-weight:800; color:var(--primary);">ApexServices Expenditure Ledger</div>
              <div style="font-size:12px; color:var(--text-muted);">Official Customer Billing & Expenditure Summary</div>
            </div>
            <div style="text-align:right;">
              <span class="status-badge status-completed" style="font-size:12px; padding:4px 12px;">OFFICIAL STATEMENT</span>
              <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Generated: ${new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px; background:rgba(255,255,255,0.02); padding:16px; border-radius:12px;">
            <div>
              <span style="font-size:11px; text-transform:uppercase; color:var(--text-muted); display:block;">Account Holder:</span>
              <strong style="color:var(--text-white); font-size:15px;">${user ? user.name : 'Valued Customer'}</strong>
              <div style="font-size:12px; color:var(--text-muted);">${user ? user.email : ''}</div>
            </div>
            <div>
              <span style="font-size:11px; text-transform:uppercase; color:var(--text-muted); display:block;">Statement Date Window:</span>
              <strong style="color:var(--primary); font-size:14px;">${fromText} &rarr; ${toText}</strong>
              <div style="font-size:12px; color:var(--text-muted);">${bookings.length} Invoiced Bills Matched</div>
            </div>
          </div>

          <!-- Summary Financial Totals -->
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-bottom:20px;">
            <div style="background:rgba(46,196,182,0.08); border:1px solid rgba(46,196,182,0.3); padding:12px; border-radius:10px; text-align:center;">
              <span style="font-size:11px; color:var(--text-muted); display:block;">Total Expenditure</span>
              <strong style="font-size:18px; color:var(--success);">${formatINR(totalSpent)}</strong>
            </div>
            <div style="background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.3); padding:12px; border-radius:10px; text-align:center;">
              <span style="font-size:11px; color:var(--text-muted); display:block;">Invoiced Bills Count</span>
              <strong style="font-size:18px; color:var(--primary);">${bookings.length} Bills</strong>
            </div>
            <div style="background:rgba(255,255,255,0.04); border:1px solid var(--border-glass); padding:12px; border-radius:10px; text-align:center;">
              <span style="font-size:11px; color:var(--text-muted); display:block;">Average Spent / Bill</span>
              <strong style="font-size:18px; color:var(--text-white);">${formatINR(avgSpent)}</strong>
            </div>
          </div>

          <h4 style="font-size:14px; margin-bottom:10px; color:var(--text-white);">Itemized Bills in Selected Period:</h4>
          <table class="admin-data-table" style="margin-bottom:20px; font-size:13px;">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Category</th>
                <th>Provider</th>
                <th>Booking Date</th>
                <th style="text-align:right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.length > 0 ? bookings.map(b => `
                <tr>
                  <td><strong>#INV-BK${b.id}</strong></td>
                  <td>${b.category}</td>
                  <td>${b.provider_name || 'Service Partner'}</td>
                  <td>${b.booking_date}</td>
                  <td style="text-align:right;"><strong style="color:var(--text-white);">${formatINR(b.total_price)}</strong></td>
                </tr>
              `).join('') : `
                <tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No bill records in date range.</td></tr>
              `}
              <tr style="font-size:15px; background:rgba(56,189,248,0.06);">
                <td colspan="4" style="text-align:right; font-weight:700;">Grand Total Period Expenditure:</td>
                <td style="text-align:right;"><strong style="color:var(--success); font-size:16px;">${formatINR(totalSpent)}</strong></td>
              </tr>
            </tbody>
          </table>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; color:var(--text-muted);">ApexServices Customer Financial Statement</span>
            <button class="btn btn-primary" onclick="window.print()">🖨️ Print / Download Statement PDF</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderChatModal(bookingId, messages, partnerName) {
  const currentUserId = JSON.parse(localStorage.getItem('apex_user'))?.id;

  const chatBubbles = messages.map(msg => {
    const isOutgoing = msg.sender_id === currentUserId;
    const timeFormatted = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <div class="chat-bubble ${isOutgoing ? 'outgoing' : 'incoming'}">
        <div style="font-weight:600; font-size:11px; margin-bottom:2px; color: ${isOutgoing ? 'var(--bg-dark)' : 'var(--primary)'}">
          ${msg.sender_name}
        </div>
        <div>${msg.message}</div>
        <div class="chat-bubble-time">${timeFormatted}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="modal-overlay" id="chat-modal-overlay">
      <div class="modal-content-wrapper modal-lg">
        <div class="modal-header">
          <h3>Chat with ${partnerName} <span style="font-size:12px; color:var(--text-muted)">(Booking #${bookingId})</span></h3>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <div class="modal-body" style="padding:0;">
          <div class="chat-widget-wrapper">
            <div class="chat-body-feed" id="chat-messages-container">
              ${chatBubbles.length > 0 ? chatBubbles : `
                <div style="text-align:center; color:var(--text-muted); margin:auto 0;" id="empty-chat-indicator">
                  <p>No messages yet. Send a note to start the conversation!</p>
                </div>
              `}
            </div>
            <form id="chat-message-send-form">
              <input type="hidden" id="chat-booking-id" value="${bookingId}">
              <div class="chat-input-row">
                <input type="text" id="chat-message-text" placeholder="Type your message here..." required autocomplete="off">
                <button class="btn btn-primary" type="submit">Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderSlides(activeSlideIndex = 0) {
  const slidesContent = [
    // Slide 1: Project Overview
    `
      <div class="slide-card animate-up" style="display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; height:450px;">
        <span class="provider-badge" style="margin-bottom: 20px; font-size:14px; padding: 6px 16px;">ApexServices</span>
        <h1 style="font-size:42px; margin-bottom:12px; background: linear-gradient(135deg, var(--text-white) 30%, var(--primary) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">On-Demand Service Booking</h1>
        <h2 style="font-size:24px; color: var(--primary); margin-bottom:24px; font-weight:400;">&amp; Management System</h2>
        <p style="color:var(--text-muted); max-width:600px; font-size:15px; line-height:1.8;">
          A premium full-stack platform built for hiring, tracking, and managing verified local professionals for home services, repairs, and beauty appointments.
        </p>
        <div style="margin-top:40px; font-size:14px; border-top:1px solid var(--border-glass); padding-top:20px; width:80%; display:flex; justify-content:space-around; color:var(--text-light)">
          <div><strong>Developer:</strong> Venky</div>
          <div><strong>Mentor Presentation</strong></div>
          <div><strong>Tech:</strong> Node.js, Express, SQLite, SPA</div>
        </div>
      </div>
    `,
    // Slide 2: Problem & Solution
    `
      <div class="slide-card animate-up" style="height:450px; display:flex; flex-direction:column; justify-content:center;">
        <span class="provider-badge" style="margin-bottom:16px;">Problem Statement &amp; Solution</span>
        <h2 style="font-size:28px; margin-bottom:20px; color:var(--text-white);">Solving On-Demand Fragmentation</h2>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:32px;">
          <div>
            <h3 style="color:var(--danger); font-size:16px; margin-bottom:10px; display:flex; align-items:center; gap:8px;">❌ The Problem</h3>
            <ul style="font-size:14px; color:var(--text-muted); padding-left:16px; display:flex; flex-direction:column; gap:10px;">
              <li>Unverified providers causing safety/quality concerns.</li>
              <li>Fragmented scheduling over phone calls/third-party apps.</li>
              <li>No central dashboard for tracking real-time booking statuses.</li>
              <li>Hidden costs, lacks rating visibility and transparent reviews.</li>
            </ul>
          </div>
          <div>
            <h3 style="color:var(--success); font-size:16px; margin-bottom:10px; display:flex; align-items:center; gap:8px;">✔️ ApexServices Solution</h3>
            <ul style="font-size:14px; color:var(--text-light); padding-left:16px; display:flex; flex-direction:column; gap:10px;">
              <li><strong>Verified Registry:</strong> Admins approve and verify all pros.</li>
              <li><strong>Seamless Booking Wizard:</strong> Schedule and price calculated instantly.</li>
              <li><strong>Real-Time Dashboards:</strong> Dedicated views for Customers, Pros, and Admins.</li>
              <li><strong>Secure Feedback:</strong> Multi-point ratings and database-persisted chat.</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    // Slide 3: Architecture
    `
      <div class="slide-card animate-up" style="height:450px; display:flex; flex-direction:column; justify-content:center;">
        <span class="provider-badge" style="margin-bottom:16px;">System Architecture</span>
        <h2 style="font-size:28px; margin-bottom:20px; color:var(--text-white);">Full-Stack Execution Flow</h2>
        <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:32px; align-items:center;">
          <div style="font-size:14px; color:var(--text-light); display:flex; flex-direction:column; gap:16px;">
            <p>
              <strong>Frontend Single Page Application (SPA):</strong> Built entirely with modular native ES6 Javascript, HTML5 semantics, and CSS grid layout system. Features zero client dependencies and no compile build times, making it extremely fast to load and modify.
            </p>
            <p>
              <strong>Backend REST Server:</strong> Powered by Express.js, exposing secured API endpoints for authentication, state transitions, reviews aggregate math, and chat.
            </p>
            <p>
              <strong>Built-in Database Engine:</strong> Uses Node 24 native <code>node:sqlite</code> module to compile queries against a localized database file, ensuring no database dependencies need binary compilation on Windows.
            </p>
          </div>
          <div class="glass-card" style="padding:16px; text-align:center; font-size:13px; border-style:dashed;">
            <strong style="color:var(--primary); display:block; margin-bottom:10px;">Presentation Offline Mode</strong>
            <p style="color:var(--text-muted); font-size:12px; line-height:1.4;">
              If the Node server is stopped, the client automatically switches to <strong>LocalStorage Mock DB</strong>. It handles login, admin registration, booking slots, and chats completely inside the browser so you can present the frontend features offline!
            </p>
          </div>
        </div>
      </div>
    `,
    // Slide 4: UI/UX Design System
    `
      <div class="slide-card animate-up" style="height:450px; display:flex; flex-direction:column; justify-content:center;">
        <span class="provider-badge" style="margin-bottom:16px;">UI/UX Design System</span>
        <h2 style="font-size:28px; margin-bottom:20px; color:var(--text-white);">Premium Visual Aesthetics</h2>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:20px; font-size:13px;">
          <div class="glass-card" style="padding:16px; border-color:rgba(102, 252, 241, 0.1);">
            <strong style="color:var(--primary); display:block; margin-bottom:8px;">1. Color Palette</strong>
            <p style="color:var(--text-muted); font-size:12px;">Tailored space dark (#0B0C10) background, deep charcoal cards, with luminous cyan (#66FCF1) overlays and glowing neon drop-shadows.</p>
          </div>
          <div class="glass-card" style="padding:16px; border-color:rgba(102, 252, 241, 0.1);">
            <strong style="color:var(--primary); display:block; margin-bottom:8px;">2. Typography</strong>
            <p style="color:var(--text-muted); font-size:12px;">Google Fonts integrated natively. <strong>Outfit</strong> for heavy, striking headlines and <strong>Inter</strong> for clean, highly legible dashboard tables and chat text.</p>
          </div>
          <div class="glass-card" style="padding:16px; border-color:rgba(102, 252, 241, 0.1);">
            <strong style="color:var(--primary); display:block; margin-bottom:8px;">3. Motion &amp; Feedback</strong>
            <p style="color:var(--text-muted); font-size:12px;">Transition easing on hover cards, slide-in toasts for success/error, backdrop-filter blurs (glassmorphism), and loading overlays.</p>
          </div>
        </div>
      </div>
    `,
    // Slide 5: Database Schema
    `
      <div class="slide-card animate-up" style="height:450px; display:flex; flex-direction:column; justify-content:center;">
        <span class="provider-badge" style="margin-bottom:16px;">Data Modeling</span>
        <h2 style="font-size:28px; margin-bottom:16px; color:var(--text-white);">SQLite Relational Schema</h2>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px; font-size:12px;">
          <div class="glass-card" style="padding:12px; background:rgba(0,0,0,0.2);">
            <strong style="color:var(--primary); display:block; margin-bottom:6px;">Users &amp; Providers</strong>
            <ul style="list-style:none; color:var(--text-muted);">
              <li>• id (INT) [PK]</li>
              <li>• name, email (TEXT)</li>
              <li>• password_hash, salt</li>
              <li>• role (customer/provider/admin)</li>
              <li>• category, rate, rating, bio</li>
            </ul>
          </div>
          <div class="glass-card" style="padding:12px; background:rgba(0,0,0,0.2);">
            <strong style="color:var(--primary); display:block; margin-bottom:6px;">Bookings &amp; Reviews</strong>
            <ul style="list-style:none; color:var(--text-muted);">
              <li>• id (INT) [PK]</li>
              <li>• customer_id, provider_id [FK]</li>
              <li>• date, time, duration</li>
              <li>• address, notes, price</li>
              <li>• status (pending/accepted/etc.)</li>
              <li>• rating, comment</li>
            </ul>
          </div>
          <div class="glass-card" style="padding:12px; background:rgba(0,0,0,0.2);">
            <strong style="color:var(--primary); display:block; margin-bottom:6px;">Messages &amp; Sessions</strong>
            <ul style="list-style:none; color:var(--text-muted);">
              <li>• id (INT) [PK]</li>
              <li>• sender_id, receiver_id [FK]</li>
              <li>• booking_id [FK]</li>
              <li>• message (TEXT)</li>
              <li>• token (TEXT) [Session PK]</li>
              <li>• expires_at (DATETIME)</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    // Slide 6: Status & Completion
    `
      <div class="slide-card animate-up" style="height:450px; display:flex; flex-direction:column; justify-content:center;">
        <span class="provider-badge" style="margin-bottom:16px;">Completion Status</span>
        <h2 style="font-size:28px; margin-bottom:20px; color:var(--text-white);">Interactive Presentation Panel</h2>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
          <div>
            <h3 style="color:var(--primary); font-size:16px; margin-bottom:10px;">🌟 Finished Operations</h3>
            <div style="font-size:13px; color:var(--text-muted); display:flex; flex-direction:column; gap:8px;">
              <div>• <strong>Customer Registration:</strong> Saves and auto-logs in.</div>
              <div>• <strong>Admin &amp; Pro Registration:</strong> Complete details saved.</div>
              <div>• <strong>Booking Wizard:</strong> Simulates timeslot and estimated costs.</div>
              <div>• <strong>Chat Box:</strong> Exchanging messages with automated response.</div>
              <div>• <strong>Dashboard Statistics:</strong> Aggregates financials and ratings.</div>
            </div>
          </div>
          <div class="glass-card" style="padding:16px; border-color:var(--primary-dark);">
            <h3 style="color:var(--primary); font-size:15px; margin-bottom:10px;">🛡️ Running Offline Mode</h3>
            <p style="font-size:12px; color:var(--text-light); line-height:1.5;">
              Currently, if the backend server is down, the web client activates its <strong>Offline Database</strong>. When you register a new customer, provider, or administrator, the state is persisted inside your browser's LocalStorage! You can log out, log back in, create bookings, and write reviews completely offline.
            </p>
          </div>
        </div>
      </div>
    `
  ];

  return `
    <div class="container animate-up" style="margin-top: 40px; max-width: 900px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px;">
        <div>
          <h2>Project presentation slides</h2>
          <p style="color: var(--text-muted)">Use this interactive slide deck to present details to your mentor</p>
        </div>
        <div style="background:rgba(102, 252, 241, 0.1); color:var(--primary); padding: 6px 16px; border-radius: 50px; font-weight: 600; font-size: 14px;">
          Slide ${activeSlideIndex + 1} of ${slidesContent.length}
        </div>
      </div>

      <div class="glass-card" style="padding: 40px; min-height: 500px; display:flex; flex-direction:column; justify-content:space-between; border-color:rgba(102, 252, 241, 0.15); box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
        <!-- Slide Content Panel -->
        <div id="presentation-slide-body" style="flex:1;">
          ${slidesContent[activeSlideIndex]}
        </div>

        <!-- Slide Navigation Controls -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid var(--border-glass); padding-top: 24px; margin-top:24px;">
          <button class="btn btn-secondary ${activeSlideIndex === 0 ? 'hidden' : ''}" id="btn-prev-slide">
            &larr; Previous Slide
          </button>
          <div style="flex:1;"></div>
          <button class="btn btn-primary ${activeSlideIndex === slidesContent.length - 1 ? 'hidden' : ''}" id="btn-next-slide">
            Next Slide &rarr;
          </button>
          ${activeSlideIndex === slidesContent.length - 1 ? `
            <button class="btn btn-primary" id="btn-slides-complete-close">Restart Presentation</button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

export function renderLoginPage() {
  return `
    <div class="container animate-up" style="margin-top: 60px; max-width: 480px;">
      <div class="glass-card" style="padding: 40px; box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6); border-color: var(--border-glass-hover);">
        <div style="text-align: center; margin-bottom: 28px;">
          <div class="logo-container" style="justify-content: center; margin-bottom: 12px;">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:40px; height:40px;">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h2 style="font-size: 28px; margin-bottom: 6px;">Sign In to ApexServices</h2>
          <p style="color: var(--text-muted); font-size: 14px;">Enter your credentials to access your account</p>
        </div>

        <form id="standalone-login-form">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="login-page-email" required placeholder="you@example.com">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="login-page-password" required placeholder="••••••••">
          </div>
          <button class="btn btn-primary" type="submit" style="width: 100%; margin-top: 12px; padding: 12px;">Sign In</button>
        </form>

        <div style="text-align: center; margin-top: 24px; border-top: 1px solid var(--border-glass); padding-top: 20px; font-size: 14px; color: var(--text-muted);">
          Don't have an account yet? <a href="#" class="nav-link" data-view="register" style="display:inline; font-weight:600; color:var(--primary);">Register here</a>
        </div>
      </div>
    </div>
  `;
}

export function renderRegisterPage() {
  return `
    <div class="container animate-up" style="margin-top: 40px; max-width: 540px;">
      <div class="glass-card" style="padding: 40px; box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6); border-color: var(--border-glass-hover);">
        <div style="text-align: center; margin-bottom: 28px;">
          <div class="logo-container" style="justify-content: center; margin-bottom: 12px;">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:40px; height:40px;">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h2 style="font-size: 28px; margin-bottom: 6px;">Create Your Account</h2>
          <p style="color: var(--text-muted); font-size: 14px;">Join ApexServices as a Customer, Provider, or Administrator</p>
        </div>

        <form id="standalone-register-form">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="reg-page-name" required placeholder="John Doe">
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="reg-page-email" required placeholder="you@example.com">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="reg-page-password" required placeholder="At least 6 characters">
          </div>
          
          <div class="form-group">
            <label>I want to sign up as a:</label>
            <select id="reg-page-role" required>
              <option value="customer">Customer (Looking for services)</option>
              <option value="provider">Service Provider (Offering skills)</option>
              <option value="admin">Administrator (Manage Platform)</option>
            </select>
          </div>

          <!-- Service Provider Extra Fields -->
          <div id="reg-page-provider-fields" class="hidden">
            <div class="form-group">
              <label>Select Category</label>
              <select id="reg-page-cat">
                <option value="Cleaning">Cleaning</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Appliance Repair">Appliance Repair</option>
                <option value="Beauty & Wellness">Beauty & Wellness</option>
                <option value="Pest Control">Pest Control</option>
              </select>
            </div>
            <div class="form-group">
              <label>Hourly Rate (₹)</label>
              <input type="number" id="reg-page-rate" placeholder="e.g. 500" min="100">
            </div>
            <div class="form-group">
              <label>Bio / Experience</label>
              <textarea id="reg-page-bio" rows="2" placeholder="Briefly describe your skill and work history..."></textarea>
            </div>
          </div>

          <button class="btn btn-primary" type="submit" style="width: 100%; margin-top: 12px; padding: 12px;">Create Account</button>
        </form>

        <div style="text-align: center; margin-top: 24px; border-top: 1px solid var(--border-glass); padding-top: 20px; font-size: 14px; color: var(--text-muted);">
          Already have an account? <a href="#" class="nav-link" data-view="login" style="display:inline; font-weight:600; color:var(--primary);">Sign in here</a>
        </div>
      </div>
    </div>
  `;
}

