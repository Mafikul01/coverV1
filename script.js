// ==================== STATE MANAGEMENT ====================
let currentTheme = 'cyber';
let sidebarOpen = true;

// Department mapping
const departments = {
    'cse': {
        name: 'Department of CSE',
        logo: 'logo/dept.png'
    },
    'eee': {
        name: 'Department of EEE',
        logo: 'logo/eee.png'
    },
    'bba': {
        name: 'Department of BBA',
        logo: 'logo/bba.jpg'
    },
    'english': {
        name: 'Department of English',
        logo: 'logo/english.jpg'
    },
    'economics': {
        name: 'Department of Economics',
        logo: 'logo/economics.jpg'
    },
    'law': {
        name: 'Department of Law',
        logo: 'logo/law.jpg'
    },
    'pharmacy': {
        name: 'Department of Pharmacy',
        logo: 'logo/pharmacy.jpg'
    },
    'political': {
        name: 'Dept. of Political Science',
        logo: 'logo/political.jpg'
    },
    'islamic': {
        name: 'Dept. of Islamic Studies',
        logo: 'logo/islamic.png'
    },
    'jcms': {
        name: 'Department of JCMS',
        logo: 'logo/jcms.png'
    },
    'publichealth': {
        name: 'Dept. of Public Health',
        logo: 'logo/Public Health Logo.jpg'
    },
    'sociology': {
        name: 'Department of Sociology',
        logo: 'logo/dept.png'
    }
};

// ==================== INITIALIZATION ====================
window.onload = () => {
    updatePreview();
    loadFromLocalStorage();
    updateCompletionRate();
    initializeTheme();
    initMobileDevInfo();
    initMobileSidebar();
    // Initialize department selector
    onDeptChange();
};

// Initialize sidebar for mobile devices (open by default)
function initMobileSidebar() {
    if (window.innerWidth <= 968) {
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.getElementById('menuToggleBtn');
        
        // Open sidebar on mobile by default
        sidebar.classList.add('active');
        document.body.classList.add('sidebar-open');
        
        // Update button icon to show close icon
        const icon = menuBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-times';
        }
    }
}

// Populate and handle mobile dev info visibility
function initMobileDevInfo() {
    const mobileBox = document.getElementById('mobileDevInfo');
    const devCard = document.querySelector('.dev-card');
    const previewWrapper = document.getElementById('previewWrapper');

    if (!mobileBox || !devCard || !previewWrapper) return;

    // Build mini content: avatar, name, social links
    const nameEl = document.querySelector('.dev-name');
    const avatarEl = document.querySelector('.avatar-circle');
    const socialLinks = document.querySelector('.social-links');

    const avatarClone = document.createElement('div');
    avatarClone.className = 'avatar-mini';
    // Use fallback icon since photo upload system is removed
    const icon = document.createElement('i');
    icon.className = 'fas fa-user-graduate';
    avatarClone.appendChild(icon);

    const nameMini = document.createElement('div');
    nameMini.className = 'dev-name-mini';
    nameMini.textContent = nameEl ? nameEl.textContent : 'Developer';

    const socialMini = document.createElement('div');
    socialMini.className = 'social-mini';
    if (socialLinks) {
        // clone the social anchor nodes (only icons)
        socialLinks.querySelectorAll('a').forEach(a => {
            const link = a.cloneNode(true);
            link.classList.add('mini');
            socialMini.appendChild(link);
        });
    }

    mobileBox.appendChild(avatarClone);
    mobileBox.appendChild(nameMini);
    mobileBox.appendChild(socialMini);

    // show/hide on scroll for small screens
    function onScroll() {
        if (window.innerWidth > 968) {
            mobileBox.classList.remove('visible');
            return;
        }
        if (previewWrapper.scrollTop > 40) {
            mobileBox.classList.add('visible');
            mobileBox.setAttribute('aria-hidden', 'false');
        } else {
            mobileBox.classList.remove('visible');
            mobileBox.setAttribute('aria-hidden', 'true');
        }
    }

    previewWrapper.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
}

// ==================== SIDEBAR TOGGLE ====================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const layout = document.getElementById('layout');
    const menuBtn = document.getElementById('menuToggleBtn');
    
    // Check if mobile or desktop
    if (window.innerWidth <= 968) {
        // MOBILE: Toggle sidebar active class and body class
        sidebar.classList.toggle('active');
        document.body.classList.toggle('sidebar-open');
        
        // Update button icon
        const icon = menuBtn.querySelector('i');
        if (sidebar.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    } else {
        // DESKTOP: Toggle layout class
        layout.classList.toggle('sidebar-hidden');
        sidebarOpen = !sidebarOpen;
        
        // Update button icon
        const icon = menuBtn.querySelector('i');
        if (layout.classList.contains('sidebar-hidden')) {
            icon.className = 'fas fa-chevron-right';
        } else {
            icon.className = 'fas fa-bars';
        }
    }
}

// Close sidebar (used by overlay click)
function closeSidebar() {
    if (window.innerWidth <= 968) {
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.getElementById('menuToggleBtn');
        
        sidebar.classList.remove('active');
        document.body.classList.remove('sidebar-open');
        
        // Reset icon
        const icon = menuBtn.querySelector('i');
        icon.className = 'fas fa-bars';
    }
}

// ==================== LIVE PREVIEW ====================
function updatePreview() {
    const fields = {
        'deptIn': 'deptOut',
        'uniIn': 'uniOut',
        'courseTitleIn': 'courseTitleOut',
        'reportNoIn': 'reportNoOutTop',
        'expNoIn': 'expNoOutTable',
        'expNameIn': 'expNameOut',
        'stuNameIn': 'stuNameOut',
        'stuIdIn': 'stuIdOut',
        'codeIn': 'codeOut',
        't1Name': 't1NameOut',
        't2Name': 't2NameOut'
    };

    for (let key in fields) {
        const input = document.getElementById(key);
        const output = document.getElementById(fields[key]);

        if (input && output) {
            const value = input.value.trim();

            if (value === '') {
                output.innerText = '';
            } else {
                output.innerText = value.includes(':')
                    ? value.split(':')[1].trim()
                    : value;
            }
        }
    }

    // Handle semester and section with special logic for "other" inputs
    const semSelect = document.getElementById('semIn');
    const semOther = document.getElementById('semOther');
    const semOut = document.getElementById('semOut');
    
    if (semSelect && semOut) {
        if (semOther && semOther.style.display !== 'none' && semOther.value.trim()) {
            semOut.innerText = semOther.value.trim();
        } else {
            semOut.innerText = semSelect.value;
        }
    }

    const secSelect = document.getElementById('secIn');
    const secOther = document.getElementById('secOther');
    const secOut = document.getElementById('secOut');
    
    if (secSelect && secOut) {
        if (secOther && secOther.style.display !== 'none' && secOther.value.trim()) {
            secOut.innerText = secOther.value.trim();
        } else {
            secOut.innerText = secSelect.value;
        }
    }

    updateCompletionRate();
}

// ==================== THEME SWITCHER ====================
function initializeTheme() {
    const savedTheme = localStorage.getItem('vu-theme') || 'cyber';
    setTheme(savedTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('vu-theme', theme);
    
    // Update active button
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-theme') === theme) {
            btn.classList.add('active');
        }
    });
    
    showToast(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme activated`);
}

// ==================== QUICK ACTIONS ====================
function fillSampleData() {
    document.getElementById('deptSelect').value = 'cse';
    onDeptChange();
    document.getElementById('courseTitleIn').value = 'Digital Signal Processing Lab';
    document.getElementById('codeIn').value = 'CSE-312';
    document.getElementById('reportNoIn').value = '01';
    document.getElementById('expNoIn').value = '01';
    document.getElementById('expNameIn').value = 'Introduction to MATLAB';
    document.getElementById('stuNameIn').value = 'Mafikul Islam';
    document.getElementById('stuIdIn').value = '232311070';
    document.getElementById('semIn').value = '6th';
    document.getElementById('secIn').value = 'B';
    document.getElementById('t1Name').value = 'Dr. John Doe';
    document.getElementById('t2Name').value = 'Prof. Jane Smith';
    
    updatePreview();
    showToast('Sample data loaded successfully!');
}

function clearAllFields() {
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        if (input.id !== 'deptIn' && input.id !== 'uniIn') {
            input.value = '';
        }
    });
    updatePreview();
    showToast('All fields cleared!');
}

// ==================== LOCAL STORAGE ====================
function saveToLocalStorage() {
    const data = {};
    const inputs = document.querySelectorAll('input[type="text"]');
    
    inputs.forEach(input => {
        data[input.id] = input.value;
    });
    
    localStorage.setItem('vu-cover-data', JSON.stringify(data));
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const lastSavedElement = document.getElementById('lastSaved');
    if (lastSavedElement) {
        lastSavedElement.textContent = timeStr;
    }
    
    showToast('Draft saved successfully!');
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('vu-cover-data');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        
        for (let key in data) {
            const input = document.getElementById(key);
            if (input) {
                input.value = data[key];
            }
        }
        
        updatePreview();
    }
}



// ==================== ADVANCED OPTIONS ====================
function toggleAdvanced() {
    const content = document.getElementById('advancedContent');
    const icon = document.getElementById('advancedToggle');
    
    content.classList.toggle('expanded');
    icon.classList.toggle('rotated');
}

function toggleBorder() {
    const table = document.querySelector('.exp-table');
    const checkbox = document.getElementById('showBorder');
    
    if (checkbox.checked) {
        table.style.borderCollapse = 'collapse';
        table.querySelectorAll('td').forEach(td => {
            td.style.border = '1px solid black';
        });
    } else {
        table.querySelectorAll('td').forEach(td => {
            td.style.border = 'none';
        });
    }
}

function toggleLogos() {
    const logos = document.querySelectorAll('.logo-box');
    const checkbox = document.getElementById('showLogos');
    
    logos.forEach(logo => {
        logo.style.display = checkbox.checked ? 'block' : 'none';
    });
}

function changeFontSize() {
    const select = document.getElementById('fontSize');
    const coverPage = document.getElementById('cover-page');
    
    const sizes = {
        small: '0.9',
        medium: '1',
        large: '1.1'
    };
    
    const scale = sizes[select.value] || '1';
    coverPage.style.fontSize = scale + 'em';
}

// ==================== ZOOM CONTROLS ====================
// Zoom feature removed

// ==================== TOAST NOTIFICATION ====================
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== PDF DOWNLOAD ====================
function downloadPDF() {
    const element = document.getElementById('cover-page');
    
    // Show loading toast
    showToast('Generating PDF...');
    
    // Store original transform
    const originalTransform = element.style.transform;
    element.style.transform = "scale(1)";

    const opt = {
        margin: 0,
        filename: 'VU_Cover_Page.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
            scale: 3, 
            useCORS: true, 
            letterRendering: true,
            logging: false 
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        }
    };

    html2pdf()
        .set(opt)
        .from(element)
        .toPdf()
        .get('pdf')
        .then(function (pdf) {
            // Restore original transform
            element.style.transform = originalTransform;
            
            // Remove extra pages
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = totalPages; i > 1; i--) {
                pdf.deletePage(i);
            }
            
            showToast('PDF generated successfully!');
        })
        .save();
}

// Helper function to get teacher designation
function getTeacherDesignation(teacherNum) {
    const select = document.getElementById(`${teacherNum}Designation`);
    const other = document.getElementById(`${teacherNum}DesignationOther`);
    
    if (select.value === 'custom' && other.value.trim()) {
        return other.value.trim();
    } else if (select.value === 'lecturer') {
        return 'Lecturer';
    } else if (select.value === 'associate') {
        return 'Associate Professor';
    } else {
        return 'Lecturer';
    }
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveToLocalStorage();
    }
    
    // Ctrl/Cmd + P to download PDF
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        downloadPDF();
    }
    
    // Ctrl/Cmd + K to toggle sidebar
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleSidebar();
    }
    
    // ESC to close sidebar on mobile
    if (e.key === 'Escape' && window.innerWidth <= 968) {
        closeSidebar();
    }
});

// ==================== RESPONSIVE HANDLING ====================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 968) {
            // Close sidebar on desktop when resizing from mobile
            const sidebar = document.getElementById('sidebar');
            const menuBtn = document.getElementById('menuToggleBtn');
            
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            
            // Reset desktop icon
            const icon = menuBtn.querySelector('i');
            if (document.getElementById('layout').classList.contains('sidebar-hidden')) {
                icon.className = 'fas fa-chevron-right';
            } else {
                icon.className = 'fas fa-bars';
            }
        } else {
            // Open sidebar on mobile when resizing from desktop
            const sidebar = document.getElementById('sidebar');
            const menuBtn = document.getElementById('menuToggleBtn');
            
            sidebar.classList.add('active');
            document.body.classList.add('sidebar-open');
            
            // Update button icon to show close icon
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-times';
            }
        }
    }, 250);
});

// ==================== UTILITY FUNCTIONS ====================
// Smooth scroll for form sections
document.querySelectorAll('.input-card').forEach(card => {
    card.addEventListener('click', function() {
        this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

// Add ripple effect to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ==================== PERFORMANCE OPTIMIZATION ====================
// Debounce function for input events
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

// Apply debounce to updatePreview
const debouncedUpdate = debounce(updatePreview, 150);

// Update all input listeners to use debounced version
document.querySelectorAll('input[type="text"]').forEach(input => {
    input.removeEventListener('input', updatePreview);
    input.addEventListener('input', debouncedUpdate);
});

// ==================== ANALYTICS & TRACKING ====================
// Track user actions (optional - can be connected to analytics service)
function trackAction(action, details) {
    console.log(`Action: ${action}`, details);
    // Can be extended to send to analytics service
}

// Track button clicks
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        trackAction('button_click', { button: button.textContent });
    });
});

// ==================== MISSING FUNCTIONS ====================
// Department selector change handler
function onDeptChange() {
    const deptSelect = document.getElementById('deptSelect');
    const deptInput = document.getElementById('deptIn');
    const deptLogo = document.querySelector('.left-logo img');
    
    const selectedDept = deptSelect.value;
    
    if (selectedDept === 'other') {
        // Clear input for custom department
        deptInput.value = '';
        deptInput.placeholder = 'Enter custom department name';
        deptInput.focus();
        
        // Use default logo for custom department
        if (deptLogo) {
            deptLogo.src = 'logo/dept.png';
            deptLogo.alt = 'Department Logo';
        }
    } else if (departments[selectedDept]) {
        // Auto-fill but keep editable for preset departments
        deptInput.value = departments[selectedDept].name;
        deptInput.placeholder = 'Click to edit department name';
        
        if (deptLogo) {
            deptLogo.src = departments[selectedDept].logo;
            deptLogo.alt = departments[selectedDept].name + ' Logo';
        }
    }
    
    // Always make input editable
    deptInput.removeAttribute('readonly');
    deptInput.style.backgroundColor = '';
    
    updatePreview();
}

// Semester change handler
function onSemChange() {
    const semSelect = document.getElementById('semIn');
    const semOther = document.getElementById('semOther');
    
    if (semSelect.value === 'other') {
        semOther.style.display = 'block';
        semOther.placeholder = 'Enter custom semester';
        semOther.focus();
    } else {
        semOther.style.display = 'none';
        semOther.value = '';
    }
    updatePreview();
}

// Section change handler  
function onSecChange() {
    const secSelect = document.getElementById('secIn');
    const secOther = document.getElementById('secOther');
    
    if (secSelect.value === 'other') {
        secOther.style.display = 'block';
        secOther.placeholder = 'Enter custom section';
        secOther.focus();
    } else {
        secOther.style.display = 'none';
        secOther.value = '';
    }
    updatePreview();
}

// Teacher 1 designation change handler  
function onT1DesignationChange() {
    const designationSelect = document.getElementById('t1Designation');
    const designationOther = document.getElementById('t1DesignationOther');
    
    if (designationSelect.value === 'custom') {
        designationOther.style.display = 'block';
        designationOther.placeholder = 'Enter custom designation';
        designationOther.focus();
    } else {
        designationOther.style.display = 'none';
        designationOther.value = '';
    }
    updateTeacherDesignations();
}

// Teacher 2 designation change handler  
function onT2DesignationChange() {
    const designationSelect = document.getElementById('t2Designation');
    const designationOther = document.getElementById('t2DesignationOther');
    
    if (designationSelect.value === 'custom') {
        designationOther.style.display = 'block';
        designationOther.placeholder = 'Enter custom designation';
        designationOther.focus();
    } else {
        designationOther.style.display = 'none';
        designationOther.value = '';
    }
    updateTeacherDesignations();
}

// Update teacher designations in preview
function updateTeacherDesignations() {
    // Teacher 1 designation
    const t1Select = document.getElementById('t1Designation');
    const t1Other = document.getElementById('t1DesignationOther');
    const t1Output = document.getElementById('t1DesignationOut');
    
    if (t1Output) {
        if (t1Select.value === 'custom' && t1Other.value.trim()) {
            t1Output.innerText = t1Other.value.trim();
        } else if (t1Select.value === 'lecturer') {
            t1Output.innerText = 'Lecturer';
        } else if (t1Select.value === 'associate') {
            t1Output.innerText = 'Associate Professor';
        } else {
            t1Output.innerText = 'Lecturer';
        }
    }
    
    // Teacher 2 designation
    const t2Select = document.getElementById('t2Designation');
    const t2Other = document.getElementById('t2DesignationOther');
    const t2Output = document.getElementById('t2DesignationOut');
    
    if (t2Output) {
        if (t2Select.value === 'custom' && t2Other.value.trim()) {
            t2Output.innerText = t2Other.value.trim();
        } else if (t2Select.value === 'lecturer') {
            t2Output.innerText = 'Lecturer';
        } else if (t2Select.value === 'associate') {
            t2Output.innerText = 'Associate Professor';
        } else {
            t2Output.innerText = 'Lecturer';
        }
    }
}

// Update completion rate
function updateCompletionRate() {
    const inputs = document.querySelectorAll('input[type="text"], select');
    let filled = 0;
    let total = 0;
    
    inputs.forEach(input => {
        if (input.id && !input.id.includes('Other') && input.id !== 'deptIn') {
            total++;
            if (input.value.trim() !== '') {
                filled++;
            }
        }
    });
    
    const percentage = total > 0 ? Math.round((filled / total) * 100) : 0;
    const completionElement = document.getElementById('completionRate');
    if (completionElement) {
        completionElement.textContent = percentage + '%';
    }
}

// ==================== EXPORT FUNCTIONS ====================
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.updatePreview = updatePreview;
window.initMobileSidebar = initMobileSidebar;
window.setTheme = setTheme;
window.fillSampleData = fillSampleData;
window.clearAllFields = clearAllFields;
window.saveToLocalStorage = saveToLocalStorage;
window.loadFromLocalStorage = loadFromLocalStorage;
window.toggleAdvanced = toggleAdvanced;
window.toggleBorder = toggleBorder;
window.toggleLogos = toggleLogos;
window.changeFontSize = changeFontSize;
window.downloadPDF = downloadPDF;
window.onDeptChange = onDeptChange;
window.onSemChange = onSemChange;
window.onSecChange = onSecChange;
window.onT1DesignationChange = onT1DesignationChange;
window.onT2DesignationChange = onT2DesignationChange;
window.updateTeacherDesignations = updateTeacherDesignations;
window.updateCompletionRate = updateCompletionRate;