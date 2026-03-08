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

// 1. Splash Screen
setTimeout(() => {
    document.getElementById('splash').classList.add('hidden');
    if (localStorage.getItem("isLoggedIn")) showDashboard();
    else document.getElementById('login-section').classList.remove('hidden');
}, 4500);

function checkRole() {
    const role = document.getElementById('role').value;
    const pinArea = document.getElementById('pin-area');
    pinArea.innerHTML = (role === 'teacher' || role === 'admin') ? `<input type="password" id="pin" placeholder="ሚስጥር ቁጥር ያስገቡ">` : '';
}

function handleLogin() {
    const role = document.getElementById('role').value;
    const pin = document.getElementById('pin') ? document.getElementById('pin').value : '';
    const phone = document.getElementById('phone').value;

    if (!phone.startsWith('09') && !phone.startsWith('07')) { alert("የቴሌ ስልክ ብቻ ይጠቀሙ!"); return; }
    if (role === 'teacher' && pin !== '121619') { alert("የመምህር ኮድ ተሳስቷል!"); return; }
    if (role === 'admin' && pin !== '12161921') { alert("የአስተዳደር ኮድ ተሳስቷል!"); return; }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", role);
    showDashboard();
}

function showDashboard() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    renderGrades();
}

function renderGrades() {
    document.getElementById('back-btn').classList.add('hidden');
    const main = document.getElementById('main-content');
    const grades = [
        { id: 9, name: "9ኛ ክፍል", col: "#8e44ad" },
        { id: 10, name: "10ኛ ክፍል", col: "#2980b9" },
        { id: 11, name: "11ኛ ክፍል", col: "#16a085" },
        { id: 12, name: "12ኛ ክፍል", col: "#d35400" }
    ];
    let html = `<div class="grid-container">`;
    grades.forEach(g => { html += `<div class="card" style="border-bottom: 4px solid ${g.col}" onclick="selectGrade(${g.id})">${g.name}</div>`; });
    main.innerHTML = html + `</div>`;
}

function selectGrade(id) {
    document.getElementById('back-btn').classList.remove('hidden');
    const main = document.getElementById('main-content');
    if (id === 11 || id === 12) {
        main.innerHTML = `<div class="grid-container">
            <div class="card" onclick="showSubjects(${id}, 'natural')">Natural Science</div>
            <div class="card" onclick="showSubjects(${id}, 'social')">Social Science</div>
        </div>`;
    } else showSubjects(id);
}

function showSubjects(id, stream = null) {
    const main = document.getElementById('main-content');
    let list = stream ? subjects[id][stream] : subjects[id];
    let html = `<div class="grid-container">`;
    list.forEach(s => { html += `<div class="card" style="background:#f8f9fa" onclick="openResources('${s}')">${s}</div>`; });
    main.innerHTML = html + `</div>`;
}

function openResources(s) {
    const role = localStorage.getItem("userRole");
    const main = document.getElementById('main-content');
    let html = `<div style="padding:20px; text-align:center;"><h2>${s}</h2>
        <div class="grid-container">
            <div class="card" onclick="alert('PDF በመከፈት ላይ...')">📄 PDF</div>
            <div class="card" onclick="alert('ቪዲዮ በመከፈት ላይ...')">🎬 Video</div>
            <div class="card" onclick="alert('ምስል በመከፈት ላይ...')">🖼 Image</div>
            <div class="card" onclick="openChat('${s}')">💬 Chat</div>
        </div>`;
    if (role !== 'student') {
        html += `<div style="margin-top:20px; border:1px dashed #ccc; padding:10px;">
            <h3>ፋይል መጫኛ</h3><input type="file" id="f"><textarea id="t" placeholder="ፁህፍ..."></textarea>
            <button onclick="alert('ተጭኗል!')">ፖስት አድርግ</button></div>`;
    }
    main.innerHTML = html + `</div>`;
}

function openChat(s) {
    const role = localStorage.getItem("userRole");
    const main = document.getElementById('main-content');
    let h = `<div style="padding:15px;"><h3>የ ${s} ውይይት</h3><div id="cb" style="height:250px; background:#ddd; overflow-y:auto; padding:10px; border-radius:10px;"></div>`;
    if (role !== 'student') {
        h += `<input id="ci" placeholder="መልዕክት..."><button onclick="sm()">ላክ</button>`;
    } else h += `<p style="color:red;">ተማሪዎች ማየት ብቻ ነው የሚችሉት።</p>`;
    main.innerHTML = h + `</div>`;
}

function goBack() { renderGrades(); }
function logout() { localStorage.clear(); location.reload(); }
