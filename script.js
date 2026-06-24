
function animateValue(id, start, end, duration) {
    let obj = document.getElementById(id);
    if (!obj) return;

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end.toLocaleString() + "+";
        }
    };
    window.requestAnimationFrame(step);
}

// --- Global Toast Notifications ---
window.showToast = function(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed; top:20px; right:20px; background:var(--success); color:white; padding:15px 25px; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.2); z-index:99999; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); opacity: 0; transform: translateX(50px); display: flex; align-items: center; gap: 12px; font-weight: bold; border-right: 5px solid rgba(255,255,255,0.5);';
    toast.innerHTML = `<i class="fa-solid fa-bell" style="font-size: 20px;"></i> <span>${msg}</span>`;
    document.body.appendChild(toast);
    
    // Play sound optionally
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
        audio.volume = 0.5;
        audio.play().catch(e=>e);
    } catch(e) {}

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 50);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => toast.remove(), 400);
    }, 4500);
};

document.addEventListener('DOMContentLoaded', () => {
    // Inject Professional Styles and Loader
    const logoPath = 'logo.svg.png';

    const loaderHtml = `
        <div id="global-loader" style="position:fixed; top:0; left:0; width:100%; height:100%; background:var(--bg-color); z-index:999999; display:flex; flex-direction:column; justify-content:center; align-items:center; transition: opacity 0.5s ease;">
            <div style="position: relative; display: flex; justify-content: center; align-items: center; margin-bottom: 35px; width: 180px; height: 180px;">
                <div style="position: absolute; width: 100%; height: 100%; border: 3px solid transparent; border-top-color: var(--primary); border-bottom-color: var(--primary); border-radius: 50%; animation: spin 2s linear infinite;"></div>
                <div style="position: absolute; width: 85%; height: 85%; border: 3px solid transparent; border-left-color: rgba(10, 124, 255, 0.5); border-right-color: rgba(10, 124, 255, 0.5); border-radius: 50%; animation: spin 1.5s linear infinite reverse;"></div>
                <img src="${logoPath}" alt="Loading..." style="width: 110px; height: auto; animation: pulseLoader 1.5s infinite alternate ease-in-out; filter: drop-shadow(0 5px 10px rgba(10, 124, 255, 0.2)); z-index: 10;">
            </div>
            <h3 style="color:var(--primary); font-weight:bold; letter-spacing:2px; margin:0; font-size: 1.8rem; text-shadow: 0 2px 10px rgba(10, 124, 255, 0.2);">Med Track</h3>
            <p style="color: var(--text-color); font-size: 1rem; margin-top: 10px; opacity: 0.8; animation: pulse 2s ease-in-out infinite;">جاري التحميل...</p>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', loaderHtml);

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0% { transform: scale(0.95); opacity: 0.7; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.7; } }
        @keyframes pulseLoader { 0% { transform: scale(1); filter: drop-shadow(0 5px 5px rgba(10, 124, 255, 0.2)); } 100% { transform: scale(1.15); filter: drop-shadow(0 15px 25px rgba(10, 124, 255, 0.6)); } }
        /* Professional Buttons */
        .btn {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease !important;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .btn:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 20px rgba(10, 124, 255, 0.3) !important;
        }
        .btn:active {
            transform: translateY(0) !important;
        }
        /* Icon Hover Effects */
        i { transition: transform 0.3s ease; }
        a:hover i, .btn:hover i, .card:hover i, .sidebar ul li a:hover i {
            transform: scale(1.15);
        }
        .card { transition: all 0.3s ease; }
        .card:hover { transform: translateY(-5px); box-shadow: var(--shadow); }
        
        /* Force hide mobile menu button on desktop despite .btn class */
        @media (min-width: 992px) {
            .mobile-menu-btn { display: none !important; }
        }
    `;
    document.head.appendChild(style);

    // Start counters
    animateValue("patientsCount", 0, 15420, 2500);
    animateValue("doctorsCount", 0, 320, 2500);
    animateValue("appointmentsCount", 0, 48500, 2500);

    // Add mobile menu toggle for dashboards
    const header = document.querySelector('.dash-header');
    const sidebar = document.querySelector('.sidebar');
    if (header && sidebar) {
        // Create Sidebar Overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        const toggleBtn = document.createElement('button');
        toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        toggleBtn.className = 'btn mobile-menu-btn floating-menu-btn';
        toggleBtn.style.cssText = 'position: fixed; top: 20px; left: 20px; z-index: 1000; width: 50px; height: 50px; border-radius: 50%; font-size: 20px; box-shadow: 0 5px 20px rgba(10, 124, 255, 0.4); background: var(--primary); color: white; justify-content: center; align-items: center; border: none; outline: none; cursor: pointer;';
        document.body.appendChild(toggleBtn);
        
        const closeSidebar = () => {
            sidebar.classList.remove('sidebar-active');
            overlay.classList.remove('active');
            toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        };

        const toggleSidebar = () => {
            const isActive = sidebar.classList.toggle('sidebar-active');
            if(isActive) {
                overlay.classList.add('active');
                toggleBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            } else {
                overlay.classList.remove('active');
                toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        };

        toggleBtn.onclick = toggleSidebar;
        overlay.onclick = closeSidebar;
        
        // Close sidebar when clicking a link inside it on mobile
        const sidebarLinks = sidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 991) {
                    closeSidebar();
                }
            });
        });
    }

    // Main nav mobile menu injection removed per user request

    // --- History API & LocalStorage for Persistence ---
    window.showSec = function(id, el, updateHash = true) {
        document.querySelectorAll('.sidebar ul li a').forEach(a => a.classList.remove('active'));
        if (el) {
            el.classList.add('active');
        } else {
            const link = document.querySelector(`a[onclick*="${id}"]`);
            if (link) link.classList.add('active');
        }
        document.querySelectorAll('.content-section').forEach(sec => sec.style.display = 'none');
        const targetSec = document.getElementById(id);
        if (targetSec) targetSec.style.display = 'block';
        
        if (updateHash) {
            try { window.history.replaceState(null, null, '#' + id); } catch(e) {}
            window._ignoreHashChange = true;
            window.location.hash = id;
            setTimeout(() => { window._ignoreHashChange = false; }, 50);
            
            // Save to localStorage for foolproof persistence on refresh
            localStorage.setItem('activeSec_' + window.location.pathname.split('/').pop(), id);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', () => {
        if (window._ignoreHashChange) return;
        
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            window.showSec(hash, null, false);
        } else {
            const firstLink = document.querySelector('.sidebar ul li a');
            if (firstLink) {
                const match = firstLink.getAttribute('onclick').match(/showSec\('([^']+)'/);
                if (match) window.showSec(match[1], firstLink, false);
            }
        }
    });

    // Determine initial section
    const savedSec = localStorage.getItem('activeSec_' + window.location.pathname.split('/').pop());
    const currentHash = window.location.hash.substring(1);
    const initialSec = (currentHash && document.getElementById(currentHash)) ? currentHash : (savedSec && document.getElementById(savedSec) ? savedSec : null);

    if (initialSec) {
        setTimeout(() => window.showSec(initialSec, null, false), 50);
    } else {
        const firstActive = document.querySelector('.sidebar ul li a.active');
        if (firstActive) {
            const match = firstActive.getAttribute('onclick').match(/showSec\('([^']+)'/);
            if (match) {
                try { window.history.replaceState(null, null, '#' + match[1]); } catch(e){}
            }
        }
    }

    // --- Functional Chat System ---
    const chatSec = document.getElementById('sec-chat');
    if (chatSec) {
        const isDoctor = window.location.pathname.includes('doctor.html');
        const chatInput = document.getElementById('doctorChatInput') || document.getElementById('patientChatInput') || chatSec.querySelector('input[type="text"]');
        const chatBtn = document.getElementById('doctorChatBtn') || document.getElementById('patientChatBtn') || chatSec.querySelector('button');
        const chatContainer = document.getElementById('doctorChatContainer') || document.getElementById('patientChatContainer') || chatSec.querySelector('div[style*="overflow-y: auto"]');
        
        // Chat Search Filter
        const searchInput = document.getElementById('chatSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                document.querySelectorAll('.chat-contact').forEach(contact => {
                    const text = contact.innerText.toLowerCase();
                    contact.style.display = text.includes(term) ? 'block' : 'none';
                });
            });
        }
        
        // Close attach menu when clicking outside
        document.addEventListener('click', (e) => {
            const menus = document.querySelectorAll('#patientAttachMenu, #doctorAttachMenu');
            menus.forEach(m => {
                if (m && m.style.display === 'flex') {
                    // Check if click is inside menu or on the toggle button
                    if (!m.contains(e.target) && !e.target.closest('.fa-paperclip')) {
                        m.style.display = 'none';
                    }
                }
            });
        });

        if (chatInput && chatBtn && chatContainer) {
            if (window.dbListenMessages) {
                let initialLoad = true;
                window.dbListenMessages('medtrack_chat', (msgs) => {
                    chatContainer.innerHTML = '';
                    if (msgs && msgs.length > 0) {
                        msgs.forEach(msg => {
                            const div = document.createElement('div');
                            const isMine = (isDoctor && msg.sender === 'doctor') || (!isDoctor && msg.sender === 'patient');
                            
                            if (isMine) {
                                div.style = 'align-self: flex-end; background: var(--primary); color: white; padding: 10px 15px; border-radius: 15px; border-top-left-radius: 0; box-shadow: var(--shadow);';
                            } else {
                                div.style = 'align-self: flex-start; background: var(--card-bg); color: var(--text-main); padding: 10px 15px; border-radius: 15px; border-top-right-radius: 0; box-shadow: var(--shadow);';
                            }
                            div.innerText = msg.text;
                            chatContainer.appendChild(div);
                        });
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                        
                        if (!initialLoad) {
                            const lastMsg = msgs[msgs.length - 1];
                            if (lastMsg && ((isDoctor && lastMsg.sender === 'patient') || (!isDoctor && lastMsg.sender === 'doctor'))) {
                                window.showToast('رسالة جديدة وردت الآن! <i class="fa-solid fa-envelope"></i>');
                            }
                        }
                    }
                    initialLoad = false;
                });

                const sendMessage = async () => {
                    const text = chatInput.value.trim();
                    if (!text) return;
                    try {
                        await window.dbAddMessage('medtrack_chat', {
                            sender: isDoctor ? 'doctor' : 'patient',
                            text: text
                        });
                        chatInput.value = '';
                    } catch (e) {
                        alert(e.message);
                    }
                };

                chatBtn.addEventListener('click', sendMessage);
                chatInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') sendMessage();
                });
            }
        }
    }

    // --- Complaints Support Chat System ---
    const supportChatPatient = document.querySelector('#sec-support .form-box[style*="height: 500px"]');
    const supportChatAdmin = document.querySelector('#sec-complaints > div > div:nth-child(2)');
    
    let supportChatSec, isSupportAdmin;
    if (supportChatPatient) {
        supportChatSec = supportChatPatient;
        isSupportAdmin = false;
    } else if (supportChatAdmin) {
        supportChatSec = supportChatAdmin;
        isSupportAdmin = true;
    }

    if (supportChatSec) {
        const supInput = supportChatSec.querySelector('input[type="text"]');
        const supBtn = supportChatSec.querySelector('button');
        const supContainer = supportChatSec.querySelector('div[style*="overflow-y: auto"]');
        
        if (supInput && supBtn && supContainer) {
            if (window.dbListenMessages) {
                window.dbListenMessages('medtrack_support', (msgs) => {
                    supContainer.innerHTML = '';
                    if (msgs && msgs.length > 0) {
                        msgs.forEach(msg => {
                            const div = document.createElement('div');
                            const isMine = (isSupportAdmin && msg.sender === 'admin') || (!isSupportAdmin && msg.sender === 'patient');
                            
                            if (isMine) {
                                div.style = 'align-self: flex-end; background: var(--primary); color: white; padding: 10px 15px; border-radius: 15px; border-top-left-radius: 0; box-shadow: var(--shadow);';
                                div.innerHTML = `<strong>${isSupportAdmin ? 'أنت (الإدارة)' : 'أنت'}:</strong><br>${msg.text}`;
                            } else {
                                div.style = 'align-self: flex-start; background: var(--card-bg); color: var(--text-main); padding: 10px 15px; border-radius: 15px; border-top-right-radius: 0; box-shadow: var(--shadow);';
                                div.innerHTML = `<strong style="color:var(--warning);"><i class="fa-solid fa-${isSupportAdmin ? 'user' : 'headset'}"></i> ${isSupportAdmin ? 'المريض' : 'موظف الدعم'}:</strong><br>${msg.text}`;
                            }
                            supContainer.appendChild(div);
                        });
                        supContainer.scrollTop = supContainer.scrollHeight;
                    }
                });

                const sendSupportMsg = async () => {
                    const text = supInput.value.trim();
                    if (!text) return;
                    try {
                        await window.dbAddMessage('medtrack_support', {
                            sender: isSupportAdmin ? 'admin' : 'patient',
                            text: text
                        });
                        supInput.value = '';
                    } catch(e) {
                        alert(e.message);
                    }
                };

                supBtn.addEventListener('click', sendSupportMsg);
                supInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') sendSupportMsg();
                });
            }
        }
    }

    // --- Prescriptions Linking ---
    const doctorPrescriptionSec = document.getElementById('sec-prescriptions');
    const patientMedsSec = document.getElementById('sec-meds');

    if (doctorPrescriptionSec) {
        const savePrescriptionBtn = document.querySelector('#sec-prescriptions button[onclick*="حفظ واعتماد الروشتة"]');
        if (savePrescriptionBtn) {
            savePrescriptionBtn.addEventListener('click', async () => {
                const medItems = document.querySelectorAll('#medicationsContainer .med-item');
                const meds = [];
                medItems.forEach(item => {
                    const inputs = item.querySelectorAll('input');
                    if (inputs.length >= 4 && inputs[0].value) {
                        meds.push({
                            name: inputs[0].value,
                            dose: inputs[1].value,
                            freq: inputs[2].value,
                            duration: inputs[3].value
                        });
                    }
                });
                if (meds.length > 0) {
                    try {
                        for(let med of meds) {
                            await window.dbAddRecord('medtrack_meds', med);
                        }
                        alert('تم حفظ الروشتة وإرسالها لملف المريض بنجاح!');
                    } catch (e) {
                        alert(e.message);
                    }
                }
            });
        }
    }

    if (patientMedsSec) {
        if (window.dbListenRecords) {
            window.dbListenRecords('medtrack_meds', (meds) => {
                const tbody = patientMedsSec.querySelector('tbody');
                if (tbody && meds && meds.length > 0) {
                    tbody.innerHTML = '';
                    meds.forEach(med => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `<td>${med.name}</td><td>${med.dose}</td><td>${med.freq}</td><td>${med.duration}</td>`;
                        tbody.appendChild(tr);
                    });
                }
            });
        }
    }

    // --- Labs & X-Rays Linking ---
    const patientLabsSec = document.getElementById('sec-labs');
    const doctorLabsSec = document.querySelector('body > .dashboard > .main-content > #sec-labs');
    
    // Patient upload logic
    if (patientLabsSec && !window.location.pathname.includes('doctor.html')) {
        const uploadBtns = patientLabsSec.querySelectorAll('.form-box button');
        uploadBtns.forEach(btn => {
            if (btn.innerText.includes('إضافة')) {
                // Prevent default form submission and multiple alerts
                btn.onclick = null;
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                newBtn.addEventListener('click', async () => {
                    const input = newBtn.previousElementSibling;
                    if (input && input.type === 'file' && input.files && input.files.length > 0) {
                        const isXray = newBtn.innerText.includes('أشعة');
                        try {
                            await window.dbAddRecord('medtrack_labs', {
                                type: isXray ? 'أشعة' : 'تحليل',
                                name: isXray ? 'أشعة مرفوعة حديثاً' : 'تحليل مرفوع حديثاً',
                                date: new Date().toLocaleDateString('ar-EG'),
                                patient: 'سالم عبدالله (MT-12345)',
                                uploadedBy: 'المريض'
                            });
                            alert('تم رفع ' + (isXray ? 'الأشعة' : 'التحليل') + ' بنجاح وسيظهر للطبيب.');
                        } catch (e) {
                            alert(e.message);
                        }
                    } else {
                        alert('يرجى اختيار ملف أولاً للرفع.');
                    }
                });
            }
        });
    }
        
        const patientLabsTableBody = document.getElementById('patientLabsTableBody');
        if (patientLabsTableBody && window.dbListenRecords) {
            window.dbListenRecords('medtrack_labs', (labs) => {
                const hospitalLabs = labs.filter(lab => lab.uploadedBy === 'المختبر' || lab.uploadedBy === 'المستشفى');
                if (hospitalLabs.length > 0) {
                    patientLabsTableBody.innerHTML = '';
                    hospitalLabs.forEach(lab => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `<td>${lab.name}</td><td>${lab.date}</td><td>${lab.uploadedBy}</td><td><button class="btn" style="padding: 5px 15px; font-size:12px;" onclick="alert('جاري عرض التقرير المرفق...')">عرض</button></td>`;
                        patientLabsTableBody.appendChild(tr);
                    });
                }
            });
        }

    // --- Lab Dashboard Upload Logic ---
    window.uploadLabFromDashboard = async function() {
        const patientId = document.getElementById('patientIdInput');
        const labType = document.getElementById('labTypeSelect');
        const fileInput = document.getElementById('labFileUpload');
        
        if (!patientId || !patientId.value.trim()) {
            alert('يرجى إدخال أو مسح كود المريض أولاً.');
            return;
        }
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert('يرجى اختيار ملف النتيجة المرفق أولاً.');
            return;
        }
        
        const typeValue = labType ? labType.value : 'أشعة/تحليل';
        const isXray = typeValue.includes('أشعة') || typeValue.includes('رنين');
        
        try {
            await window.dbAddRecord('medtrack_labs', {
                type: isXray ? 'أشعة' : 'تحليل',
                name: typeValue,
                date: new Date().toLocaleDateString('ar-EG'),
                patient: `سالم عبدالله (${patientId.value})`,
                uploadedBy: 'المختبر'
            });
            alert('تم رفع النتيجة بنجاح! ستظهر الآن في ملف المريض وعند أطبائه.');
            patientId.value = '';
            fileInput.value = '';
        } catch (e) {
            alert(e.message);
        }
    };

    // Doctor view logic
    if (window.location.pathname.includes('doctor.html') && doctorLabsSec && window.dbListenRecords) {
        window.dbListenRecords('medtrack_labs', (labs) => {
            const container = doctorLabsSec.querySelector('.grid-container');
            if (container && labs.length > 0) {
                container.querySelectorAll('.added-lab').forEach(el => el.remove());
                labs.forEach(lab => {
                    const div = document.createElement('div');
                    div.className = 'stat-box added-lab';
                    div.style.textAlign = 'right';
                    div.style.position = 'relative';
                    const icon = lab.type === 'أشعة' ? 'fa-x-ray' : 'fa-file-medical';
                    const color = lab.type === 'أشعة' ? 'var(--primary)' : 'var(--success)';
                    div.innerHTML = `
                        <span style="position: absolute; top: 15px; left: 15px; background: var(--danger); color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">جديد</span>
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                            <i class="fa-solid ${icon}" style="font-size: 40px; color: ${color};"></i>
                            <div>
                                <h3 style="margin: 0;">${lab.name}</h3>
                                <p style="color: var(--text-muted); font-size: 13px;">المريض: ${lab.patient}</p>
                            </div>
                        </div>
                        <p style="color: var(--text-main); font-size: 14px; margin-bottom: 15px;"><i class="fa-solid fa-calendar-day"></i> تاريخ الرفع: ${lab.date}</p>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn" style="flex: 1; padding: 8px;" onclick="alert('جاري عرض الملف...')"><i class="fa-solid fa-eye"></i> عرض</button>
                            <button class="btn btn-outline" style="flex: 1; padding: 8px;" onclick="alert('جاري التنزيل...')"><i class="fa-solid fa-download"></i> تحميل</button>
                        </div>
                    `;
                    container.insertBefore(div, container.firstChild);
                });
            }
        });
    }
});

// Hide loader when everything is fully loaded (simulating network delay if needed)
window.addEventListener('load', () => {
    const loader = document.getElementById('global-loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 500);
        }, 300); // slight artificial delay for professional feel
    }
});