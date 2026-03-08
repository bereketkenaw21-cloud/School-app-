// 1. የትምህርት አይነቶች ዳታ (ከ9-12 አዲስ ካሪኩለም)
const subjects = {
    9: ["Mathematics", "English", "Amharic", "Biology", "Chemistry", "Physics", "Geography", "History", "Citizenship", "Economics", "IT", "HPE"],
    10: ["Mathematics", "English", "Amharic", "Biology", "Chemistry", "Physics", "Geography", "History", "Citizenship", "Economics", "IT", "HPE"],
    11: {
        natural: ["Mathematics", "English", "Physics", "Chemistry", "Biology", "IT", "Citizenship", "HPE", "General Business"],
        social: ["Mathematics", "English", "Geography", "History", "Economics", "IT", "Citizenship", "HPE", "General Science"]
    },
    12: {
        natural: ["Mathematics", "English", "Physics", "Chemistry", "Biology", "IT", "Citizenship", "HPE", "General Business"],
        social: ["Mathematics", "English", "Geography", "History", "Economics", "IT", "Citizenship", "HPE", "General Science"]
    }
};

// 2. Splash Screen (4.5 ሰከንድ ቆይታ)
setTimeout(() => {
    document.getElementById('splash').classList.add('hidden');
    if (localStorage.getItem("isLoggedIn")) {
        showDashboard();
    } else {
        document.getElementById('login-section').classList.remove('hidden');
    }
}, 4500);

// 3. Login እና Role Security
function checkRole() {
    const role = document.getElementById('role').value;
    const pinArea = document.getElementById('pin-area');
    pinArea.innerHTML = (role === 'teacher' || role === 'admin') ? 
        `<input type="password" id="pin" placeholder="የደህንነት ኮድ ያስገቡ" style="border: 2px solid #2481cc;">` : '';
}

function handleLogin() {
    const role = document.getElementById('role').value;
    const pin = document.getElementById('pin') ? document.getElementById('pin').value : '';
    const phone = document.getElementById('phone').value;

    if (!phone.startsWith('09') && !phone.startsWith('07')) {
        alert("እባክዎ የኢትዮ ቴሌኮም ስልክ ቁጥር ብቻ ይጠቀሙ!"); return;
    }

    if (role === 'teacher' && pin !== '121619') { alert("የመምህር ኮድ ተሳስቷል!"); return; }
    if (role === 'admin' && pin !== '12161921') { alert("የአስተዳደር ኮድ ተሳስቷል!"); return; }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", role);
    showDashboard();
}

// 4. Dashboard (ርሰ መምህር መልዕክት መላኪያ ያለው)
function showDashboard() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    
    // የተቀመጠ የርሰ መምህር መልዕክት ካለ ማሳያ
    const globalMsg = localStorage.getItem("global_news");
    if (globalMsg) displayAnnouncement(globalMsg);

    renderGrades();
}

function renderGrades() {
    document.getElementById('back-btn').classList.add('hidden');
    const main = document.getElementById('main-content');
    const role = localStorage.getItem("userRole");
    
    let html = "";

    // ርሰ መምህር (Admin) ከሆነ መልዕክት መላኪያ ሳጥን ይታያል
    if (role === 'admin') {
        html += `
        <div class="admin-panel" style="background:white; margin:15px; padding:15px; border-radius:15px; border:2px solid #ff4b2b;">
            <h4 style="margin:0 0 10px 0; color:#ff4b2b;">📢 የርሰ መምህር መልዕክት ማስተላለፊያ</h4>
            <textarea id="adminInput" placeholder="ለተማሪዎችና መምህራን መልዕክት ይፃፉ..." style="width:100%; height:60px; border-radius:10px; padding:10px;"></textarea>
            <button onclick="sendGlobalMessage()" style="width:100%; background:#ff4b2b; color:white; border:none; padding:10px; border-radius:10px; margin-top:5px; font-weight:bold;">መልዕክቱን አስተላልፍ</button>
        </div>`;
    }

    html += `<div class="grid-container">`;
    const grades = [
        { id: 9, name: "9ኛ ክፍል", col: "#8e44ad", icon: "📚" },
        { id: 10, name: "10ኛ ክፍል", col: "#2980b9", icon: "📖" },
        { id: 11, name: "11ኛ ክፍል", col: "#16a085", icon: "🔬" },
        { id: 12, name: "12ኛ ክፍል", col: "#d35400", icon: "🎓" }
    ];

    grades.forEach(g => {
        html += `<div class="card" style="border-bottom: 5px solid ${g.col}" onclick="selectGrade(${g.id})">
                    <div style="font-size:1.5rem;">${g.icon}</div>${g.name}
                 </div>`;
    });
    main.innerHTML = html + `</div>`;
}

// 5. የርሰ መምህር መልዕክት ተግባራት
function sendGlobalMessage() {
    const msg = document.getElementById('adminInput').value;
    if (msg.trim() === "") { alert("ባዶ መልዕክት መላክ አይቻልም!"); return; }
    localStorage.setItem("global_news", msg);
    displayAnnouncement(msg);
    alert("መልዕክቱ ተሰራጭቷል!");
}

function displayAnnouncement(msg) {
    const bar = document.getElementById('announcement-bar');
    bar.classList.remove('hidden');
    bar.innerHTML = `<marquee style="background:#ff4b2b; color:white; padding:8px; font-weight:bold;">📢 ርሰ መምህር፦ ${msg}</marquee>`;
}

// 6. የክፍል እና የሳብጀክት ምርጫ
function selectGrade(id) {
    document.getElementById('back-btn').classList.remove('hidden');
    const main = document.getElementById('main-content');
    if (id === 11 || id === 12) {
        main.innerHTML = `<div class="grid-container">
            <div class="card" onclick="showSubjects(${id}, 'natural')">🧪 Natural Science</div>
            <div class="card" onclick="showSubjects(${id}, 'social')">🌍 Social Science</div>
        </div>`;
    } else showSubjects(id);
}

function showSubjects(id, stream = null) {
    const main = document.getElementById('main-content');
    let list = stream ? subjects[id][stream] : subjects[id];
    let html = `<div class="grid-container">`;
    list.forEach(s => {
        html += `<div class="card" style="background:#f8f9fa" onclick="openResources('${s}')">${s}</div>`;
    });
    main.innerHTML = html + `</div>`;
}

// 7. ፋይል ማሳያ እና ቻት (ተማሪ መፃፍ አይችልም)
function openResources(s) {
    const role = localStorage.getItem("userRole");
    const main = document.getElementById('main-content');
    let html = `<div style="padding:20px; text-align:center;"><h3>${s}</h3>
        <div class="grid-container">
            <div class="card" onclick="alert('PDF በመከፈት ላይ...')">📄 PDF</div>
            <div class="card" onclick="alert('ቪዲዮ በመከፈት ላይ...')">🎬 Video</div>
            <div class="card" onclick="openChat('${s}')">💬 Chat</div>
        </div>`;
    
    // መምህር/አስተዳደር ብቻ ፋይል መጫን ይችላሉ
    if (role !== 'student') {
        html += `<div style="margin-top:20px; border-top:1px solid #ccc; padding-top:15px;">
            <h4>ፋይል መጫኛ (መምህር/አስተዳደር)</h4>
            <input type="file" id="fInput"><textarea id="tArea" placeholder="ማብራሪያ ይፃፉ..."></textarea>
            <button onclick="alert('ፋይሉ ተጭኗል!')" style="background:#2481cc; color:white; border:none; padding:10px; border-radius:10px; width:100%;">ፖስት አድርግ</button>
        </div>`;
    }
    main.innerHTML = html + `</div>`;
}

function openChat(s) {
    const role = localStorage.getItem("userRole");
    const main = document.getElementById('main-content');
    let h = `<div style="padding:15px;"><h3>የ ${s} ውይይት</h3>
        <div id="cb" style="height:250px; background:#e5ddd5; overflow-y:auto; padding:10px; border-radius:10px; border:1px solid #ccc;">
            <p style="background:white; padding:8px; border-radius:10px; width:fit-content;"><b>መምህር፦</b> ሰላም ተማሪዎች! ጥያቄ ካላችሁ እዚህ ተከታተሉኝ።</p>
        </div>`;
    
    if (role !== 'student') {
        h += `<div style="display:flex; margin-top:10px;">
                <input id="ci" placeholder="መልዕክት ይፃፉ..." style="flex:1;">
                <button onclick="sm()" style="background:#2481cc; color:white; border:none; padding:10px; border-radius:10px; margin-left:5px;">ላክ</button>
              </div>`;
    } else {
        h += `<p style="color:red; font-size:0.8rem; margin-top:10px;">⚠️ ተማሪዎች መፃፍ አይችሉም፤ መመልከት ብቻ ነው የሚፈቀደው።</p>`;
    }
    main.innerHTML = h + `</div>`;
}

function sm() {
    const i = document.getElementById('ci');
    const b = document.getElementById('cb');
    if(i.value) {
        b.innerHTML += `<p style="background:#dcf8c6; padding:8px; border-radius:10px; width:fit-content; align-self:flex-end; margin-left:auto;"><b>እኔ፦</b> ${i.value}</p>`;
        i.value = ""; b.scrollTop = b.scrollHeight;
    }
}

function goBack() { renderGrades(); }
function logout() { localStorage.clear(); location.reload(); }
