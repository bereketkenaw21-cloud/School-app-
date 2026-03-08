// የክፍል ደረጃዎች ዳታ
const grades = [
    { id: 9, name: "9ኛ ክፍል (አዲስ ካሪኩለም)", color: "#8e44ad" },
    { id: 10, name: "10ኛ ክፍል (አዲስ ካሪኩለም)", color: "#2980b9" },
    { id: 11, name: "11ኛ ክፍል (Social/Natural)", color: "#16a085" },
    { id: 12, name: "12ኛ ክፍል (Social/Natural)", color: "#d35400" }
];

// 1. Splash Screen
setTimeout(() => {
    const isLogged = localStorage.getItem("isLoggedIn");
    document.getElementById('splash').classList.add('hidden');
    if (isLogged) {
        showDashboard();
    } else {
        document.getElementById('login-section').classList.remove('hidden');
    }
}, 4000);

// 2. PIN logic
function checkRole() {
    const role = document.getElementById('role').value;
    const pinArea = document.getElementById('pin-area');
    pinArea.innerHTML = (role === 'teacher' || role === 'admin') ? 
        `<input type="password" id="pin" placeholder="ሚስጥር ቁጥር ያስገቡ">` : '';
}

// 3. Login
function handleLogin() {
    const role = document.getElementById('role').value;
    const pin = document.getElementById('pin') ? document.getElementById('pin').value : '';
    const phone = document.getElementById('phone').value;

    if (!phone.startsWith('09') && !phone.startsWith('07')) {
        alert("እባክዎ የኢትዮ ቴሌኮም ስልክ ቁጥር ይጠቀሙ!"); return;
    }

    if (role === 'teacher' && pin !== '121619') { alert("የመምህር ኮድ ተሳስቷል!"); return; }
    if (role === 'admin' && pin !== '12161921') { alert("የአስተዳደር ኮድ ተሳስቷል!"); return; }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", role);
    showDashboard();
}

// 4. Dashboard View
function showDashboard() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    
    const role = localStorage.getItem("userRole");
    if(role === 'teacher' || role === 'admin') {
        document.getElementById('upload-section').classList.remove('hidden');
    }

    renderGrades();
}

function renderGrades() {
    const menu = document.getElementById('main-menu');
    menu.innerHTML = grades.map(g => `
        <div class="card" style="background: ${g.color}" onclick="selectGrade(${g.id})">
            ${g.name}
        </div>
    `).join('');
}

function logout() {
    localStorage.clear();
    location.reload();
}
