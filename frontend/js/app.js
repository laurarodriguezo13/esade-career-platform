console.log('App.js loaded - Full Version');
let allJobs = [];
let filteredJobs = [];

async function loadRecommendations() {
    const container = document.getElementById('recommendedJobs');
    container.innerHTML = '<p>Loading jobs...</p>';
    
    try {
        const prefs = getUserPreferences();
        let url = CONFIG.api.endpoint + '/jobs';
        const params = new URLSearchParams();
        
        if (prefs.locations && prefs.locations[0]) {
            params.append('location', prefs.locations[0]);
        }
        if (prefs.skills && prefs.skills.length > 0) {
            params.append('skills', prefs.skills.join(','));
        }
        
        if (params.toString()) url += '?' + params.toString();
        
        const response = await fetch(url);
        const data = await response.json();
        filteredJobs = data.success ? data.jobs : [];
        
        // Load all jobs for search
        const allResponse = await fetch(CONFIG.api.endpoint + '/jobs');
        const allData = await allResponse.json();
        allJobs = allData.success ? allData.jobs : [];
        
    } catch (e) {
        console.error('API Error:', e);
        filteredJobs = [];
        allJobs = [];
    }
    
    displayJobs(filteredJobs.slice(0, 10), container);
    loadTrendingSkills();
}

function getUserPreferences() {
    const saved = localStorage.getItem('user_preferences');
    return saved ? JSON.parse(saved) : {skills: ['Python', 'Data Analysis'], locations: ['Barcelona'], industries: ['Technology']};
}

function loadTrendingSkills() {
    const container = document.getElementById('trendingSkills');
    if (!container) return;
    const skills = ['Machine Learning', 'Python', 'Data Analysis', 'Communication', 'Agile', 'Excel', 'SQL', 'AWS'];
    container.innerHTML = skills.map(s => `<span class="skill-tag" onclick="filterBySkill('${s}')">${s}</span>`).join('');
}

function filterBySkill(skill) {
    const prefs = getUserPreferences();
    if (!prefs.skills.includes(skill)) {
        prefs.skills.push(skill);
        localStorage.setItem('user_preferences', JSON.stringify(prefs));
    }
    loadRecommendations();
}

function displayJobs(jobs, container) {
    if (!jobs.length) { container.innerHTML = '<p>No jobs found for your preferences.</p>'; return; }
    container.innerHTML = jobs.map(job => `
        <div class="job-item">
            <div class="job-title">${job.title}</div>
            <div class="job-company">${job.company}</div>
            <div class="job-details"><span>📍 ${job.location}</span><span>✨ ${job.matchScore}%</span></div>
            <p style="margin:0.5rem 0;color:#666;font-size:0.9rem">${job.description}</p>
            <div>${(job.skills||[]).map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>
            <a href="${job.url}" target="_blank" class="job-link">View Job →</a>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('searchBtn');
    const input = document.getElementById('searchInput');
    if (btn && input) {
        btn.addEventListener('click', performSearch);
        input.addEventListener('keypress', e => { if (e.key === 'Enter') performSearch(); });
    }
    addPreferencesButton();
});

function performSearch() {
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    if (!input || !results) return;
    const term = input.value.toLowerCase().trim();
    if (!term) { results.innerHTML = '<p>Enter a search term.</p>'; return; }
    
    const filtered = allJobs.filter(j => 
        j.title.toLowerCase().includes(term) || 
        j.company.toLowerCase().includes(term) || 
        j.location.toLowerCase().includes(term) ||
        j.description.toLowerCase().includes(term) ||
        (j.skills||[]).some(s => s.toLowerCase().includes(term))
    );
    
    if (!filtered.length) {
        results.innerHTML = `<p>No jobs found for "${term}".</p>`;
    } else {
        results.innerHTML = `<h4 style="margin:1rem 0;color:#003d82">Found ${filtered.length} job(s) for "${term}"</h4>`;
        displayJobs(filtered, results);
    }
}

function addPreferencesButton() {
    const nav = document.querySelector('header nav');
    if (nav && !document.getElementById('preferencesBtn')) {
        const btn = document.createElement('button');
        btn.id = 'preferencesBtn';
        btn.className = 'btn-secondary';
        btn.textContent = '⚙️ Preferences';
        btn.style.marginRight = '1rem';
        btn.onclick = showPreferencesModal;
        nav.insertBefore(btn, nav.firstChild);
    }
}

function showPreferencesModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    const prefs = getUserPreferences();
    modal.innerHTML = `
        <div class="modal-content" style="max-width:600px">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Your Preferences</h2>
            <div class="form-group"><label>Skills</label><input type="text" id="prefsSkills" value="${prefs.skills.join(', ')}"></div>
            <div class="form-group"><label>Location</label>
                <select id="prefsLocations">
                    <option value="Barcelona" ${prefs.locations[0]==='Barcelona'?'selected':''}>🇪🇸 Barcelona</option>
                    <option value="Madrid" ${prefs.locations[0]==='Madrid'?'selected':''}>🇪🇸 Madrid</option>
                    <option value="London" ${prefs.locations[0]==='London'?'selected':''}>🇬🇧 London</option>
                    <option value="Paris" ${prefs.locations[0]==='Paris'?'selected':''}>🇫🇷 Paris</option>
                    <option value="Berlin" ${prefs.locations[0]==='Berlin'?'selected':''}>🇩🇪 Berlin</option>
                    <option value="Amsterdam" ${prefs.locations[0]==='Amsterdam'?'selected':''}>🇳🇱 Amsterdam</option>
                </select>
            </div>
            <div class="form-group"><label>Industries</label><input type="text" id="prefsIndustries" value="${prefs.industries.join(', ')}"></div>
            <button onclick="savePreferences()" class="btn-primary btn-block">Save & Refresh</button>
        </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

function savePreferences() {
    const prefs = {
        skills: document.getElementById('prefsSkills').value.split(',').map(s => s.trim()).filter(s => s),
        locations: [document.getElementById('prefsLocations').value],
        industries: document.getElementById('prefsIndustries').value.split(',').map(s => s.trim()).filter(s => s)
    };
    localStorage.setItem('user_preferences', JSON.stringify(prefs));
    document.querySelector('.modal').remove();
    loadRecommendations();
}
