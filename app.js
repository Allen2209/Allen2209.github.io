import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: 'AIzaSyA4HgGGAqHWWlRh_-Ga_44-B8FdTGCAXHM',
  authDomain: 'churchweb-b233b.firebaseapp.com',
  projectId: 'churchweb-b233b',
  storageBucket: 'churchweb-b233b.firebasestorage.app',
  messagingSenderId: '819289241387',
  appId: '1:819289241387:web:b19ae79c837a7f2592b76e',
  measurementId: 'G-P0WVM3LTYF'
};

const allowedAdmins = [
  'stlourdeschurchthennur@gmail.com'
];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

const pageDefinitions = [
  {
    key: 'index',
    filename: 'index.html',
    title: 'முகப்புப் பக்கம்',
    icon: '🏠',
    sections: [
      {
        id: 'homepageWelcome',
        title: 'வணக்கம் செய்தி',
        type: 'html',
        defaultValue: `<marquee behavior="scroll" direction="left" scrollamount="5">தூய லூர்து அன்னை ஆலய இணையதளத்திற்கு உங்களை அன்புடன் வரவேற்கிறோம். இங்கு நீங்கள் முகவரி, திருப்பலி நேரம், நிகழ்வுகள், புகைப்படங்கள், தொடர்பு, ஆலய வரலாறு, ஜெபங்கள் மற்றும் செய்திகள் பற்றிய தகவல்களை காணலாம்.</marquee>`
      }
    ]
  },
  {
    key: 'news',
    filename: 'news.html',
    title: 'செய்திகள்',
    icon: '📢',
    sections: [
      {
        id: 'newsDetails',
        title: 'செய்திகள் மற்றும் அறிவிப்புகள்',
        type: 'html',
        defaultValue: `<p>வாரத்தின் அனைத்து செவ்வாய் கிழமை மாலை அந்தோணியாரின் நவநாள் / புனித செபஸ்தியார் நவநாள் திருப்பலி நடைபெறும்.</p><p>பிப்ரவரி 2: அன்னையின் ஆண்டு பெருவிழா கொடியேற்றம்</p><p>பிப்ரவரி 10: அன்னையின் ஆண்டு பெருவிழா ஆடம்பர தேர்பவனி</p><p>பிப்ரவரி 11: அன்னையின் ஆண்டு பெருவிழா மற்றும் கொடியிறக்கம்</p><p>நவம்பர் 2: கல்லறை திருநாள்</p><p>டிசம்பர் 25: கிறிஸ்து பிறப்பு</p><p>ஜனவரி 1: புத்தாண்டு திருப்பலி.</p>`
      }
    ]
  },
  {
    key: 'events',
    filename: 'events.html',
    title: 'நிகழ்வுகள்',
    icon: '📅',
    sections: [
      {
        id: 'eventsDetails',
        title: 'நிகழ்வுகள் விவரம்',
        type: 'html',
        defaultValue: `<ul><li>பிப்ரவரி 2: அன்னையின் ஆண்டு பெருவிழா கொடியேற்றம்</li><li>பிப்ரரி 10: அன்னையின் ஆண்டு பெருவிழா ஆடம்பர தேர்பவனி</li><li>பிப்ரவரி 11: அன்னையின் ஆண்டு பெருவிழா மற்றும் கொடியிறக்கம்</li><li>ஏப்ரில்: புனித செபஸ்தியார் வாசகப்பா</li><li>நவம்பர் 2: கல்லறை திருநாள்</li><li>டிசம்பர் 25: கிறிஸ்து பிறப்பு</li><li>ஜனவரி 1: புத்தாண்டு சிறப்பு திருப்பலி</li></ul>`
      }
    ]
  },
  {
    key: 'mass',
    filename: 'mass.html',
    title: 'திருப்பலி நேரம்',
    icon: '⛪',
    sections: [
      {
        id: 'massTimings',
        title: 'திருப்பலி நேரம்',
        type: 'html',
        defaultValue: `<ul><li>ஞாயிறு: காலை 7.00 மற்றும் மாலை 6.00</li><li>வாரநாட்கள்: காலை 6.00</li><li>செவ்வாய்: மாலை 6.00 புனித அந்தோணியார் / புனித செபஸ்தியார் நவநாள்</li><li>சனி: காலை 6.00 அன்னையின் நவநாள்</li><li>முதல் வெள்ளி சிறப்பு திருப்பலி மற்றும் திவ்ய ஆசீர்வாதம்</li></ul>`
      }
    ]
  },
  {
    key: 'gallery',
    filename: 'gallery.html',
    title: 'படங்கள்',
    icon: '🖼️',
    sections: [
      {
        id: 'galleryImages',
        title: 'கேலரிக்குப் படங்கள்',
        type: 'images',
        defaultValue: [
          'assets/image1.jpg', 'assets/image2.jpg', 'assets/image3.jpg', 'assets/image4.jpg', 'assets/image5.jpg', 'assets/image9.jpg', 'assets/image10.jpg', 'assets/image1-1.jpg', 'assets/image111.jpg', 'assets/image222.jpg', 'assets/image333.jpg', 'assets/image444.jpg', 'assets/image555.jpg', 'assets/image666.jpg'
        ]
      }
    ]
  },
  {
    key: 'contact',
    filename: 'contact.html',
    title: 'தொடர்பு',
    icon: '☎️',
    sections: [
      {
        id: 'contactInfo',
        title: 'தொடர்பு விவரம்',
        type: 'html',
        defaultValue: `<p><strong>முகவரி:</strong> தூய லூர்து அன்னை ஆலயம், தென்னூர், ஆண்டிமடம், அரியலூர் மாவட்டம் - 621805</p><p><strong>தொலைபேசி:</strong> +91 12345 67890</p><p><strong>மின்னஞ்சல்:</strong> <a href=\"mailto:stlourdeschurchthennur@gmail.com\">stlourdeschurchthennur@gmail.com</a></p><p><strong>YouTube:</strong> <a href=\"https://www.youtube.com/@OURLADYOFLOURDESCHURCHTHENNUR\" target=\"_blank\">பார்க்க</a></p>`
      }
    ]
  },
  {
    key: 'address',
    filename: 'address.html',
    title: 'முகவரி',
    icon: '📌',
    sections: [
      {
        id: 'addressInfo',
        title: 'முகவரி மற்றும் வரைபடம்',
        type: 'html',
        defaultValue: `<p>தூய லூர்து அன்னை ஆலயம், தென்னூர், அரியலூர் மாவட்டம், தமிழ்நாடு, இந்தியா.</p><p>இணையதளத்திலிருந்து நேரடி வரைபடத்தைக் காண்பிக்கவும் கீழே உள்ள இணைப்பை அழுத்தவும்.</p>`
      }
    ]
  },
  {
    key: 'shrines',
    filename: 'shrines.html',
    title: 'சிற்றாலயங்கள்',
    icon: '🏛️',
    sections: [
      {
        id: 'shrineDetails',
        title: 'சிற்றாலய விவரங்கள்',
        type: 'html',
        defaultValue: `<div><h3>1. புனித வனத்து சின்னப்பர் ஆலயம் - பொன்னாங்கன்னிநத்தம்</h3><p>புனித ஆன்மீக ஆலயம் சுற்றுப்புற பகுதியின் நம்பிக்கையுடன் பிரசித்தி பெற்றது.</p><img src="assets/shrine1.jpg" alt="புனித வனத்து சின்னப்பர் ஆலயம்" style="max-width:100%;border-radius:18px;margin-top:1rem;"></div><div><h3>2. குழந்தை இயேசு ஆலயம் - மன்னாங்கோரை</h3><p>மக்களை மகிழ்விக்கும் புனித ஆலயம்.</p><img src="assets/shrine2.jpg" alt="குழந்தை இயேசு ஆலயம்" style="max-width:100%;border-radius:18px;margin-top:1rem;"></div><div><h3>3. புனித ஆரோக்கிய நாதர் ஆலயம் - ஆரோக்கியபுரம்</h3><p>ஆரோக்கிய ஆசீர்வாதங்களை அருளும் ஆலயம்.</p><img src="assets/shrine3.jpg" alt="ஆரோக்கிய நாதர் ஆலயம்" style="max-width:100%;border-radius:18px;margin-top:1rem;"></div>`
      }
    ]
  },
  {
    key: 'schools',
    filename: 'schools.html',
    title: 'பள்ளிகள்',
    icon: '🏫',
    sections: [
      {
        id: 'schoolDetails',
        title: 'பள்ளிகள் விவரம்',
        type: 'html',
        defaultValue: `<p>தூய மாமரி ஆண்கள் துவக்கப்பள்ளி, தூய சூசையப்பர் பெண்கள் துவக்கப்பள்ளி மற்றும் அன்னை லூர்து பெண்கள் மேல்நிலைப் பள்ளி ஆகியவை தென்னூரின் கல்வி விதிகளை வலுப்படுத்தி வந்துள்ளன.</p><p>இந்த பள்ளிகள் சமூகத்தின் கல்வி வளர்ச்சிக்கு முக்கிய பங்காற்றி வருகின்றன.</p>`
      }
    ]
  },
  {
    key: 'history',
    filename: 'history.html',
    title: 'அலய வரலாறு',
    icon: '📖',
    sections: [
      {
        id: 'anbiyamDetails',
        title: 'அன்பிய விவரங்கள்',
        type: 'html',
        defaultValue: `<p>தூய லூர்து அன்னை ஆலயம் திருப்பூர் மாவட்டத்தில் உள்ள ஒரு முக்கியமான ஆன்மீக மையமாக விளங்குகிறது. அன்பியங்கள், பிரார்த்தனைகள் மற்றும் மக்கள் நம்பிக்கை பற்றிய விவரங்கள் இங்கே பதிவுக்கிடக்கப்பட்டுள்ளன.</p>`
      }
    ]
  },
  {
    key: 'miracles',
    filename: 'miracles.html',
    title: 'புதுமைகள்',
    icon: '✨',
    sections: [
      {
        id: 'miraclesInfo',
        title: 'புதுமை கதைகள்',
        type: 'html',
        defaultValue: `<p>நம் ஆலயத்தில் நிகழ்ந்த கருணை மிகுதிகள் மற்றும் நம்பிக்கை செழித்திய நிகழ்வுகளை பகிர்கிறோம்.</p>`
      }
    ]
  },
  {
    key: 'prayers',
    filename: 'prayers.html',
    title: 'ஜெபங்கள்',
    icon: '📿',
    sections: [
      {
        id: 'prayersInfo',
        title: 'ஜெபங்கள் மற்றும் எச்சரிக்கை',
        type: 'html',
        defaultValue: `<p>தியான ஜெபங்கள், புனிதப் பிரார்த்தனைகள் மற்றும் நாளாந்த வழிபாட்டு வழிமுறைகள் இங்கே உள்ளன.</p>`
      }
    ]
  }
];

const pageKey = document.body.dataset.page || 'index';
const pageDefinition = pageDefinitions.find((page) => page.key === pageKey) || pageDefinitions[0];
let isAdmin = false;
let currentUser = null;
let currentSection = null;
let draftImages = [];
let lastSavedValue = null;

const state = {
  sections: {}
};

function createElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function formatHtml(value) {
  return value || '';
}

function showToast(message) {
  const toast = document.getElementById('toastMessage');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function buildNav() {
  return pageDefinitions
    .map((page) => `<li><a href="${page.filename}" class="${page.key === pageKey ? 'active' : ''}">${page.icon} ${page.title}</a></li>`)
    .join('');
}

function renderShell() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <header>
      <div class="header-inner">
        <div class="site-brand"><span>⛪</span> தூய லூர்து அன்னை ஆலயம்</div>
        <div class="header-actions">
          <div id="adminBadge" style="display:none;color:#0f172a;font-weight:700;">Admin</div>
          <button id="authButton" class="button-primary">Admin Login</button>
        </div>
      </div>
    </header>
    <div class="layout">
      <aside class="sidebar">
        <h2>பொருளடக்கம்</h2>
        <ul class="nav-list">
          ${buildNav()}
        </ul>
      </aside>
      <main class="main">
        <div class="page-heading">
          <h1>${pageDefinition.title}</h1>
          <div id="pageStatus"></div>
        </div>
        <div id="pageSections"></div>
      </main>
    </div>
    <div class="modal-backdrop" id="modalBackdrop"></div>
    <div class="modal-panel" id="modalPanel">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modalTitle">Edit section</h3>
          <button id="closeModal" class="button-ghost">✕</button>
        </div>
        <div class="modal-body" id="modalBody"></div>
        <div class="modal-actions">
          <button id="undoButton" class="button-secondary">Undo</button>
          <button id="saveButton" class="button-primary">Save changes</button>
        </div>
      </div>
    </div>
    <div class="toast" id="toastMessage"></div>
  `;

  document.getElementById('authButton').addEventListener('click', handleAuthButton);
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', closeModal);
  document.getElementById('undoButton').addEventListener('click', undoEdit);
  document.getElementById('saveButton').addEventListener('click', saveEdit);
}

function renderSections() {
  const container = document.getElementById('pageSections');
  container.innerHTML = pageDefinition.sections
    .map((section) => {
      const sectionValue = state.sections[section.id];
      if (section.type === 'images') {
        return `
          <section class="section-card">
            <div class="section-header">
              <h2 class="section-title">${section.title}</h2>
              ${isAdmin ? `<button class="edit-button" data-section="${section.id}">✏️ மாற்ற</button>` : ''}
            </div>
            <div class="section-body">
              <div class="gallery-grid" id="${section.id}"></div>
            </div>
          </section>
        `;
      }
      return `
        <section class="section-card">
          <div class="section-header">
            <h2 class="section-title">${section.title}</h2>
            ${isAdmin ? `<button class="edit-button" data-section="${section.id}">✏️ மாற்ற</button>` : ''}
          </div>
          <div class="section-body" id="${section.id}">${formatHtml(sectionValue)}</div>
        </section>
      `;
    })
    .join('');

  pageDefinition.sections.forEach((section) => {
    if (section.type === 'images') {
      const galleryEl = document.getElementById(section.id);
      const sectionValue = state.sections[section.id] || [];
      galleryEl.innerHTML = sectionValue
        .map((imageUrl) => `
          <div class="gallery-item">
            <img src="${imageUrl}" alt="Gallery image" loading="lazy">
          </div>
        `)
        .join('');
    }
  });

  if (isAdmin) {
    document.querySelectorAll('.edit-button').forEach((btn) => {
      btn.addEventListener('click', () => openEditor(btn.dataset.section));
    });
  }
}

function setAdminMode(value) {
  isAdmin = value;
  document.getElementById('adminBadge').style.display = value ? 'inline-flex' : 'none';
  document.getElementById('authButton').textContent = value ? 'Logout' : 'Admin Login';
  document.getElementById('pageStatus').textContent = value ? `வணக்கம், ${currentUser.email}` : '';
  renderSections();
}

async function handleAuthButton() {
  if (isAdmin) {
    await signOut(auth);
    return;
  }
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
    showToast('உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.');
  }
}

function getPageSectionById(sectionId) {
  return pageDefinition.sections.find((section) => section.id === sectionId);
}

async function openEditor(sectionId) {
  const section = getPageSectionById(sectionId);
  if (!section) return;
  currentSection = section;
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  modalTitle.textContent = `Edit — ${section.title}`;
  lastSavedValue = JSON.parse(JSON.stringify(state.sections[sectionId] || section.defaultValue));
  draftImages = [];

  if (section.type === 'images') {
    const existingImages = state.sections[sectionId] || [];
    modalBody.innerHTML = `
      <div class="editor-toolbar">
        <label class="button-secondary" style="display:inline-flex;align-items:center;gap:0.5rem;">
          📁 படங்களைத் தேர்ந்தெடு <input type="file" id="imageUploadInput" accept="image/*" multiple style="display:none;">
        </label>
      </div>
      <div class="section-body" id="galleryEditorList"></div>
      <div class="section-body preview-panel" id="galleryPreview"></div>
    `;
    document.getElementById('imageUploadInput').addEventListener('change', handleImageSelection);
    renderGalleryEditor(existingImages);
  } else {
    modalBody.innerHTML = `
      <div class="editor-toolbar">
        <button data-command="bold">B</button>
        <button data-command="italic">I</button>
        <button data-command="underline">U</button>
        <button data-command="insertUnorderedList">• List</button>
        <button data-command="createLink">Link</button>
      </div>
      <div id="editorArea" class="editor-area" contenteditable="true"></div>
      <div class="preview-panel">
        <strong>Preview</strong>
        <div id="previewArea"></div>
      </div>
    `;
    const editorArea = document.getElementById('editorArea');
    const previewArea = document.getElementById('previewArea');
    editorArea.innerHTML = state.sections[sectionId] || '';
    previewArea.innerHTML = editorArea.innerHTML;
    modalBody.querySelectorAll('.editor-toolbar button').forEach((button) => {
      button.addEventListener('click', (event) => {
        const command = event.target.dataset.command;
        if (command === 'createLink') {
          const url = prompt('URL ஐ உள்ளிடவும்');
          if (url) document.execCommand(command, false, url);
          return;
        }
        document.execCommand(command, false, null);
        previewArea.innerHTML = editorArea.innerHTML;
      });
    });
    editorArea.addEventListener('input', () => {
      previewArea.innerHTML = editorArea.innerHTML;
    });
  }

  openModal();
}

function renderGalleryEditor(images) {
  const galleryEditorList = document.getElementById('galleryEditorList');
  const galleryPreview = document.getElementById('galleryPreview');
  galleryEditorList.innerHTML = images
    .map((imageUrl, index) => `
      <div class="section-card" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;">
        <div style="display:flex;gap:1rem;align-items:center;">
          <img src="${imageUrl}" alt="Gallery item" style="height:70px;width:110px;object-fit:cover;border-radius:12px;" />
          <span>Image ${index + 1}</span>
        </div>
        <button type="button" class="button-secondary" data-remove="${index}">Remove</button>
      </div>
    `)
    .join('');

  galleryEditorList.querySelectorAll('[data-remove]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const removeIndex = Number(event.target.dataset.remove);
      const updatedImages = (state.sections[currentSection.id] || []).filter((_, idx) => idx !== removeIndex);
      state.sections[currentSection.id] = updatedImages;
      renderGalleryEditor(updatedImages);
    });
  });

  galleryPreview.innerHTML = `<strong>Preview before update</strong><div class="gallery-grid">${[...(state.sections[currentSection.id] || []), ...draftImages.map((file) => URL.createObjectURL(file))]
    .map((url) => `<div class="gallery-item"><img src="${url}" alt="Preview image"></div>`)
    .join('')}</div>`;
}

function handleImageSelection(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  draftImages = draftImages.concat(files);
  renderGalleryEditor(state.sections[currentSection.id] || []);
}

function openModal() {
  document.getElementById('modalBackdrop').classList.add('show');
  document.getElementById('modalPanel').style.display = 'grid';
}

function closeModal() {
  document.getElementById('modalBackdrop').classList.remove('show');
  document.getElementById('modalPanel').style.display = 'none';
  currentSection = null;
  draftImages = [];
}

function undoEdit() {
  if (!currentSection) return;
  const modalBody = document.getElementById('modalBody');
  if (currentSection.type === 'images') {
    state.sections[currentSection.id] = JSON.parse(JSON.stringify(lastSavedValue));
    renderGalleryEditor(state.sections[currentSection.id]);
    showToast('Changes reverted to previous saved state.');
    return;
  }
  const editorArea = document.getElementById('editorArea');
  const previewArea = document.getElementById('previewArea');
  editorArea.innerHTML = lastSavedValue;
  previewArea.innerHTML = lastSavedValue;
}

async function saveEdit() {
  if (!currentSection) return;
  if (currentSection.type === 'images') {
    await saveGallerySection();
    return;
  }
  const editorArea = document.getElementById('editorArea');
  const content = editorArea.innerHTML.trim();
  await saveSection(currentSection.id, content);
}

async function saveGallerySection() {
  const sectionId = currentSection.id;
  const existingImages = state.sections[sectionId] || [];
  const allImages = [...existingImages];
  if (draftImages.length) {
    try {
      const uploadedUrls = await Promise.all(draftImages.map(uploadImageFile));
      uploadedUrls.forEach((url) => allImages.push(url));
      draftImages = [];
    } catch (error) {
      console.error(error);
      showToast('படத்தை பதிவேற்றும் போது பிழை ஏற்பட்டது.');
      return;
    }
  }
  await saveSection(sectionId, allImages, true);
}

async function uploadImageFile(file) {
  const path = `gallery/${Date.now()}_${file.name}`;
  const storageReference = storageRef(storage, path);
  await uploadBytes(storageReference, file);
  return getDownloadURL(storageReference);
}

async function saveSection(sectionId, value, isImages = false) {
  try {
    const payload = isImages ? { images: value } : { content: value };
    const reference = doc(db, 'churchContent', sectionId);
    await setDoc(reference, {
      ...payload,
      updatedAt: serverTimestamp(),
      updatedBy: currentUser?.email || 'anonymous'
    }, { merge: true });
    state.sections[sectionId] = value;
    renderSections();
    closeModal();
    showToast('தகவல் இடையே சேமிக்கப்பட்டது.');
  } catch (error) {
    console.error(error);
    showToast('சேமிக்க முடியவில்லை. சரிபார்க்கவும்.');
  }
}

async function loadSections() {
  const promises = pageDefinition.sections.map(async (section) => {
    try {
      const snapshot = await getDoc(doc(db, 'churchContent', section.id));
      if (snapshot.exists()) {
        const data = snapshot.data();
        state.sections[section.id] = section.type === 'images' ? data.images || section.defaultValue : data.content || section.defaultValue;
      } else {
        state.sections[section.id] = section.defaultValue;
      }
    } catch (error) {
      console.warn('Firestore load failed:', error);
      state.sections[section.id] = section.defaultValue;
    }
  });
  await Promise.all(promises);
}

async function refreshPage() {
  renderShell();
  setAdminMode(isAdmin);
  await loadSections();
  renderSections();
}

function initAuthListener() {
  onAuthStateChanged(auth, (user) => {
    if (user && allowedAdmins.includes(user.email)) {
      currentUser = user;
      setAdminMode(true);
      showToast(`வணக்கம், ${user.email}`);
    } else {
      if (user) {
        signOut(auth);
        showToast('இடமில்லை அல்லது அனுமதி தவறான மின்னஞ்சல்');
      }
      currentUser = null;
      setAdminMode(false);
    }
  });
}

async function init() {
  renderShell();
  initAuthListener();
  await loadSections();
  renderSections();
}

init();
