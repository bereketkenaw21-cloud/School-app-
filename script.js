// 1. የትምህርት አይነቶች እና የክፍል ዳታ
const grades = [
    { id: 9, name: "9ኛ ክፍል (አዲስ ካሪኩለም)", color: "#8e44ad" },
    { id: 10, name: "10ኛ ክፍል (አዲስ ካሪኩለም)", color: "#2980b9" },
    { id: 11, name: "11ኛ ክፍል (Social/Natural)", color: "#16a085" },
    { id: 12, name: "12ኛ ክፍል (Social/Natural)", color: "#d35400" }
];

const subjects = {
    9: ["Mathematics", "English", "Amharic", "Biology", "Chemistry", "Physics", "Geography", "History", "Citizenship", "Economics", "Information Technology", "HPE"],
    10: ["Mathematics", "English", "Amharic", "Biology", "Chemistry", "Physics", "Geography", "History", "Citizenship", "Economics", "Information Technology", "HPE"],
    11: {
        natural: ["Mathematics", "English", "Physics", "Chemistry", "Biology", "Information Technology", "Citizenship", "HPE", "General Business"],
        social: ["Mathematics", "English", "Geography", "History", "Economics", "Information Technology", "Citizenship", "HPE", "General Science"]
    },
    12: {
        natural: ["Mathematics", "English", "Physics", "Chemistry", "Biology", "Information Technology", "Citizenship", "HPE", "General Business"],
        social: ["Mathematics", "English", "Geography", "History", "Economics", "Information Technology", "Citizenship", "HPE", "General Science"]
    }
};

// 2. Splash Screen እና መግቢያ
setTimeout(() => {
    const isLogged = localStorage.getItem("isLoggedIn");
    document.getElementById('splash').classList.add('hidden');
    if (isLogged) {
        showDashboard();
    } else {
        document.getElementById('login-section').classList.remove('hidden');
    }
}, 4000);

function checkRole() {
    const role = document.getElementById('role').value;
    const pinArea = document.getElementById('pin-area');
    pinArea.innerHTML = (role === 'teacher' || role === 'admin') ? 
        `<input type="password" id="pin" placeholder="ሚስጥር ቁጥር ያስገቡ">` : '';
}

function handleLogin() {
    const role = document.getElementById('role').value;
    const pin = document.getElementById('pin') ? document.getElementById('pin').value : '';
    const phone = document.getElementById('phone').value;

    // የስልክ ቁጥር ቼክ (የቴሌ ብቻ)
    if (!phone.startsWith('09') && !phone.startsWith('07')) {
        alert("እባክዎ የኢትዮ ቴሌኮም ስልክ ቁጥር ይጠቀሙ!"); return;
    }

    if (role === 'teacher' && pin !== '121619') { alert("የመምህር ኮድ ተሳስቷል!"); return; }
    if (role === 'admin' && pin !== '12161921') { alert("የአስተዳደር ኮድ ተሳስቷል!"); return; }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", role);
    showDashboard();
}

// 3. ዳሽቦርድ እና የክፍል ምርጫ
function showDashboard() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    renderGrades();
}

function renderGrades() {
    const menu = document.getElementById('main-menu');
    let html = `<h3>የክፍል ደረጃ ይምረጡ</h3><div class="grid-container">`;
    grades.forEach(g => {
        html += `<div class="card" style="background: ${g.color}" onclick="selectGrade(${g.id})">${g.name}</div>`;
    });
    html += `</div>`;
    menu.innerHTML = html;
}

function selectGrade(gradeId) {
    const menu = document.getElementById('main-menu');
    let html = `<button onclick="renderGrades()" class="back-btn">⬅ ወደ ክፍሎች ተመለስ</button><br><br>`;

    if (gradeId === 11 || gradeId === 12) {
        html += `
            <div class="grid-container">
                <div class="card" style="background: #27ae60" onclick="showSubjects(${gradeId}, 'natural')">Natural Science</div>
                <div class="card" style="background: #e67e22" onclick="showSubjects(${gradeId}, 'social')">Social Science</div>
            </div>`;
    } else {
        showSubjects(gradeId);
        return;
    }
    menu.innerHTML = html;
}

function showSubjects(gradeId, stream = null) {
    const menu = document.getElementById('main-menu');
    let subList = stream ? subjects[gradeId][stream] : subjects[gradeId];
    
    let html = `<button onclick="selectGrade(${gradeId})" class="back-btn">⬅ ተመለስ</button>
                <h3>${gradeId}ኛ ክፍል ${stream ? '(' + stream + ')' : ''}</h3>
                <div class="grid-container">`;

    subList.forEach(subject => {
        html += `<div class="card" style="background: #34495e" onclick="openResources('${subject}')">${subject}</div>`;
    });
    menu.innerHTML = html + `</div>`;
}

function openResources(subject) {
    const menu = document.getElementById('main-menu');
    menu.innerHTML = `
        <button onclick="renderGrades()" class="back-btn">⬅ ተመለስ</button>
        <h2>${subject}</h2>
        <div class="resource-options">
            <div class="res-card" onclick="alert('PDF በመከፈት ላይ...')">📄 PDF</div>
            <div class="res-card" onclick="alert('ቪዲዮ በመከፈት ላይ...')">🎬 Video</div>
            <div class="res-card" onclick="alert('ምስል በመከፈት ላይ...')">🖼 Image</div>
            <div class="res-card" onclick="alert('Chat በመከፈት ላይ...')">💬 Chat</div>
        </div>`;
}

function logout() {
    localStorage.clear();
    location.reload();
}
