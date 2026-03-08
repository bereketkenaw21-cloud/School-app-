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
    
    // ማስታወቂያ ካለ ማሳያ
    const news = localStorage.getItem("latest_news");
    if(news) displayAnnouncement(news);

    renderGrades();
}

function renderGrades() {
    const menu = document.getElementById('main-menu');
    let html = `<h3>የክፍል ደረጃ ይምረጡ</h3><div class="grid-container">`;
    grades.forEach(g => {
        html += `<div class="card" style="background: ${g.color}" onclick="selectGrade(${g.id})">${g.name}</div>`;
    });
    html += `</div>`;
    
    // ለአስተዳደር ብቻ የሚታይ የማስታወቂያ መላኪያ በተን
    if(localStorage.getItem("userRole") === 'admin') {
        html += `<button onclick="sendAnnouncement()" style="margin-top:20px; background:red; color:white; padding:10px; border-radius:10px;">አዲስ ማስታወቂያ ላክ</button>`;
    }
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

// 4. ፋይሎችን የማየት እና የቻት ክፍል
function openResources(subject) {
    const role = localStorage.getItem("userRole");
    const menu = document.getElementById('main-menu');
    
    let html = `<button onclick="renderGrades()" class="back-btn">⬅ ተመለስ</button>
        <h2>${subject}</h2>
        <div class="resource-options">
            <div class="res-card" onclick="viewFile('pdf')">📄 PDF</div>
            <div class="res-card" onclick="viewFile('video')">🎬 Video</div>
            <div class="res-card" onclick="viewFile('image')">🖼 Image</div>
            <div class="res-card" onclick="openChat('${subject}')">💬 Chat</div>
        </div>`;

    // መምህራን እና አስተዳደር ብቻ ፋይል መጫን ይችላሉ
    if(role === 'teacher' || role === 'admin') {
        html += `<div style="margin-top:20px; border-top: 2px solid #ccc; padding-top:10px;">
                    <h3>ፋይል መጫኛ (ለመምህራን ብቻ)</h3>
                    <input type="file" id="fileInput">
                    <textarea id="textContent" placeholder="ፁህፍ ይፃፉ..."></textarea>
                    <button onclick="uploadContent()">ፖስት አድርግ</button>
                </div>`;
    }
    menu.innerHTML = html;
}

function viewFile(type) {
    alert(type + " ፋይል በመከፈት ላይ... (ኦፍላይን ማየት ይችላሉ)");
    // እዚህ ጋር ከፋይል ስርአቱ ጋር ይገናኛል
}

// 5. የቻት ክፍል (ተማሪዎች ማየት ብቻ፣ መምህር/አስተዳደር መፃፍ ይችላሉ)
function openChat(subject) {
    const role = localStorage.getItem("userRole");
    const menu = document.getElementById('main-menu');
    
    let chatHtml = `
        <button onclick="openResources('${subject}')" class="back-btn">⬅ ተመለስ</button>
        <h3>የ ${subject} ውይይት</h3>
        <div id="chat-box" style="height: 300px; overflow-y: auto; background: #eee; padding: 10px; border-radius: 10px;">
            <p><b>መምህር፦</b> ሰላም ተማሪዎች፣ የዛሬውን ፒዲኤፍ አንብባችሁ ጥያቄ ካላችሁ ጠይቁ።</p>
        </div>`;

    // መፃፍ የሚችሉት መምህር እና አስተዳደር ብቻ ናቸው
    if(role === 'teacher' || role === 'admin') {
        chatHtml += `
            <input type="text" id="chatInput" placeholder="መልዕክት ይፃፉ...">
            <button onclick="sendMessage()" style="width: 100%; margin-top: 5px; background:#27ae60; color:white;">ላክ</button>`;
    } else {
        chatHtml += `<p style="color:red; font-style:italic;">ማሳሰቢያ፦ ተማሪዎች መልዕክት መፃፍ አይችሉም፣ መመልከት ብቻ ነው የሚፈቀደው።</p>`;
    }
    
    menu.innerHTML = chatHtml;
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const chatBox = document.getElementById('chat-box');
    if (input.value !== "") {
        chatBox.innerHTML += `<p><b>እኔ፦</b> ${input.value}</p>`;
        input.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// 6. ማስታወቂያ
function displayAnnouncement(message) {
    const bar = document.getElementById('announcement-bar');
    bar.classList.remove('hidden');
    bar.innerHTML = `<marquee style="color: white; background: red; padding: 10px; font-weight:bold;">📢 ማስታወቂያ፦ ${message}</marquee>`;
}

function sendAnnouncement() {
    const msg = prompt("ለተማሪዎች የሚተላለፍ ማስታወቂያ ይፃፉ፦");
    if (msg) {
        localStorage.setItem("latest_news", msg);
        displayAnnouncement(msg);
    }
}

function logout() {
    localStorage.clear();
    location.reload();
}
