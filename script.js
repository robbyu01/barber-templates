// ============================================
// FADE CO. - Urban Barbershop Scripts
// Simplified Calendar Booking System
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initBookingSystem();
    initInteractiveEffects();
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                closeMobileMenu();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!menuBtn || !mobileMenu) return;
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function closeMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.about-img, .work-item'
    );
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );
    
    animatedElements.forEach(el => observer.observe(el));
}

// ============================================
// INTERACTIVE EFFECTS
// ============================================
function initInteractiveEffects() {
    // Parallax orbs on mouse move
    const hero = document.querySelector('.hero');
    const orbs = document.querySelectorAll('.orb');
    
    if (hero && orbs.length > 0) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 15;
                const xMove = x * speed;
                const yMove = y * speed;
                orb.style.transform = `translate(${xMove}px, ${yMove}px)`;
            });
        });
        
        hero.addEventListener('mouseleave', () => {
            orbs.forEach(orb => {
                orb.style.transform = 'translate(0, 0)';
                orb.style.transition = 'transform 0.5s ease-out';
            });
        });
        
        hero.addEventListener('mouseenter', () => {
            orbs.forEach(orb => {
                orb.style.transition = 'transform 0.1s ease-out';
            });
        });
    }
    
    // Subtle card tilt on hover (work items only)
    const workItems = document.querySelectorAll('.work-item');
    
    workItems.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const tiltX = (y - 0.5) * 5;
            const tiltY = (x - 0.5) * -5;
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ============================================
// BOOKING SYSTEM (Simplified - No Services)
// ============================================
function initBookingSystem() {
    const bookingState = {
        currentStep: 1,
        date: null,
        time: null,
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear()
    };
    
    // Available time slots
    const timeSlots = [
        '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
        '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
        '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
        '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM'
    ];
    
    // Simulated booked slots (random for demo)
    function getBookedSlots(date) {
        const seed = date.getDate() + date.getMonth();
        const bookedCount = (seed % 5) + 3;
        const booked = [];
        
        for (let i = 0; i < bookedCount; i++) {
            const index = (seed * (i + 1) * 7) % timeSlots.length;
            if (!booked.includes(timeSlots[index])) {
                booked.push(timeSlots[index]);
            }
        }
        
        return booked;
    }
    
    // Initialize calendar
    initCalendar();
    
    // Step navigation
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = parseInt(btn.dataset.next);
            goToStep(nextStep);
        });
    });
    
    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = parseInt(btn.dataset.back);
            goToStep(prevStep);
        });
    });
    
    function goToStep(step) {
        bookingState.currentStep = step;
        
        // Update step indicators
        document.querySelectorAll('.step').forEach(s => {
            const stepNum = parseInt(s.dataset.step);
            s.classList.remove('active', 'completed');
            if (stepNum === step) {
                s.classList.add('active');
            } else if (stepNum < step) {
                s.classList.add('completed');
            }
        });
        
        // Show/hide steps
        document.querySelectorAll('.booking-step').forEach(s => {
            s.classList.add('hidden');
        });
        document.getElementById(`step${step}`).classList.remove('hidden');
        
        // Update summary when going to step 2
        if (step === 2) {
            updateSummary();
        }
    }
    
    function updateSummary() {
        document.getElementById('summaryDate').textContent = bookingState.date ? 
            bookingState.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : '-';
        document.getElementById('summaryTime').textContent = bookingState.time || '-';
    }
    
    // Calendar functionality
    function initCalendar() {
        renderCalendar();
        
        document.querySelector('.cal-nav.prev').addEventListener('click', () => {
            bookingState.currentMonth--;
            if (bookingState.currentMonth < 0) {
                bookingState.currentMonth = 11;
                bookingState.currentYear--;
            }
            renderCalendar();
        });
        
        document.querySelector('.cal-nav.next').addEventListener('click', () => {
            bookingState.currentMonth++;
            if (bookingState.currentMonth > 11) {
                bookingState.currentMonth = 0;
                bookingState.currentYear++;
            }
            renderCalendar();
        });
    }
    
    function renderCalendar() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        
        const year = bookingState.currentYear;
        const month = bookingState.currentMonth;
        
        document.querySelector('.cal-month-year').textContent = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const calendarDays = document.querySelector('.calendar-days');
        calendarDays.innerHTML = '';
        
        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDay - 1; i >= 0; i--) {
            const day = document.createElement('div');
            day.className = 'cal-day other-month disabled';
            day.textContent = prevMonthLastDay - i;
            calendarDays.appendChild(day);
        }
        
        // Current month days
        for (let i = 1; i <= totalDays; i++) {
            const day = document.createElement('div');
            day.className = 'cal-day';
            day.textContent = i;
            
            const currentDate = new Date(year, month, i);
            currentDate.setHours(0, 0, 0, 0);
            
            // Check if today
            if (currentDate.getTime() === today.getTime()) {
                day.classList.add('today');
            }
            
            // Check if past or Sunday/Monday (closed)
            const dayOfWeek = currentDate.getDay();
            if (currentDate < today || dayOfWeek === 0 || dayOfWeek === 1) {
                day.classList.add('disabled');
            } else {
                day.addEventListener('click', () => selectDate(currentDate, day));
            }
            
            // Check if selected
            if (bookingState.date && 
                currentDate.getTime() === bookingState.date.getTime()) {
                day.classList.add('selected');
            }
            
            calendarDays.appendChild(day);
        }
        
        // Next month days
        const remainingDays = 42 - (startingDay + totalDays);
        for (let i = 1; i <= remainingDays; i++) {
            const day = document.createElement('div');
            day.className = 'cal-day other-month disabled';
            day.textContent = i;
            calendarDays.appendChild(day);
        }
    }
    
    function selectDate(date, element) {
        bookingState.date = date;
        bookingState.time = null; // Reset time when date changes
        
        // Update UI
        document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
        element.classList.add('selected');
        
        // Update date display
        const dateDisplay = document.querySelector('.selected-date-display');
        dateDisplay.textContent = date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Render time slots
        renderTimeSlots(date);
        
        // Disable next button until time is selected
        document.querySelector('#step1 .btn-next').disabled = true;
    }
    
    function renderTimeSlots(date) {
        const container = document.querySelector('.time-slots');
        const bookedSlots = getBookedSlots(date);
        
        container.innerHTML = '';
        
        timeSlots.forEach(slot => {
            const slotEl = document.createElement('div');
            slotEl.className = 'time-slot';
            slotEl.textContent = slot;
            
            if (bookedSlots.includes(slot)) {
                slotEl.classList.add('unavailable');
            } else {
                slotEl.addEventListener('click', () => selectTime(slot, slotEl));
            }
            
            container.appendChild(slotEl);
        });
    }
    
    function selectTime(time, element) {
        bookingState.time = time;
        
        // Update UI
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        element.classList.add('selected');
        
        // Enable next button
        document.querySelector('#step1 .btn-next').disabled = false;
    }
    
    // Form submission
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>Processing...</span>';
            submitBtn.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success
            document.querySelectorAll('.booking-step').forEach(s => s.classList.add('hidden'));
            document.getElementById('stepSuccess').classList.remove('hidden');
            
            // Update success details
            document.getElementById('successDateTime').textContent = 
                `${bookingState.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${bookingState.time}`;
            
            // Reset button
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            
            // Log booking
            console.log('Booking:', {
                ...bookingState,
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                notes: formData.get('notes')
            });
        });
    }
    
    // Book another button
    const bookAnotherBtn = document.getElementById('bookAnother');
    if (bookAnotherBtn) {
        bookAnotherBtn.addEventListener('click', () => {
            // Reset state
            bookingState.date = null;
            bookingState.time = null;
            
            // Reset form
            form.reset();
            
            // Reset time slots
            document.querySelector('.time-slots').innerHTML = 
                '<p class="time-placeholder">Choose a date to see available times</p>';
            document.querySelector('.selected-date-display').textContent = 'Select a date';
            
            // Disable continue button
            document.querySelector('#step1 .btn-next').disabled = true;
            
            // Go back to step 1
            goToStep(1);
            renderCalendar();
        });
    }
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            
            e.target.value = value;
        });
    }
}
