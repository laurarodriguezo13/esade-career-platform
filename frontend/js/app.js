// Application Logic
console.log('App.js loaded');

let allJobs = [];

// Load recommendations when dashboard is shown
function loadRecommendations() {
    console.log('Loading recommendations...');
    
    // ONLY REAL jobs from Adzuna API
    const realJobs = [
        {
            title: 'Data Scientist',
            company: 'Smadex SLU',
            location: 'Barcelona',
            skills: ['Machine Learning', 'Python', 'Data Analysis'],
            matchScore: 92,
            url: 'https://www.adzuna.es/details/5499494183?utm_medium=api&utm_source=b6b04941',
            description: 'Leading advertising technology company seeking Data Scientist for ML algorithms.'
        },
        {
            title: 'Junior Consultant Systems Engineering',
            company: 'INVENSITY Stellenportal',
            location: 'Barcelona',
            skills: ['Systems Engineering', 'Automation', 'Project Management'],
            matchScore: 85,
            url: 'https://www.adzuna.es/details/5499519046?utm_medium=api&utm_source=b6b04941',
            description: 'Support planning, design, and development of production systems and automated work cells.'
        },
        {
            title: 'Operations Lead - Customer Success',
            company: 'Dynatrace',
            location: 'Barcelona',
            skills: ['Communication', 'Operations', 'SaaS'],
            matchScore: 78,
            url: 'https://www.adzuna.es/details/5499720558?utm_medium=api&utm_source=b6b04941',
            description: 'Seasoned Operations Lead for Customer Success with SaaS industry experience.'
        }
    ];
    
    allJobs = realJobs;
    
    // Get user preferences
    const userPreferences = getUserPreferences();
    
    // Filter and sort jobs based on preferences
    let filteredJobs = filterJobsByPreferences(realJobs, userPreferences);
    
    // Display all jobs (only 3 real ones)
    const container = document.getElementById('recommendedJobs');
    displayJobs(filteredJobs, container);
    
    loadTrendingSkills();
}

function getUserPreferences() {
    const saved = localStorage.getItem('user_preferences');
    if (saved) {
        return JSON.parse(saved);
    }
    
    return {
        skills: ['Python', 'Data Analysis', 'Machine Learning'],
        locations: ['Barcelona'],
        industries: ['Technology', 'Consulting']
    };
}

function filterJobsByPreferences(jobs, preferences) {
    return jobs.map(job => {
        let score = 0;
        
        const skillMatches = job.skills.filter(skill => 
            preferences.skills.some(userSkill => 
                skill.toLowerCase().includes(userSkill.toLowerCase()) ||
                userSkill.toLowerCase().includes(skill.toLowerCase())
            )
        ).length;
        score += (skillMatches / Math.max(job.skills.length, 1)) * 40;
        
        if (preferences.locations.includes(job.location)) {
            score += 30;
        }
        
        score += 30;
        
        return {
            ...job,
            matchScore: Math.min(95, Math.round(score))
        };
    }).sort((a, b) => b.matchScore - a.matchScore);
}

function loadTrendingSkills() {
    const container = document.getElementById('trendingSkills');
    
    const skills = [
        'Machine Learning', 'Python', 'Data Analysis', 'Systems Engineering',
        'Communication', 'Agile', 'Product Management', 'SQL', 
        'Business Analysis', 'Strategy', 'Project Management', 'Automation'
    ];
    
    container.innerHTML = skills.map(skill => 
        `<span class="skill-tag" onclick="filterBySkill('${skill}')">${skill}</span>`
    ).join('');
}

function filterBySkill(skill) {
    const userPrefs = getUserPreferences();
    if (!userPrefs.skills.includes(skill)) {
        userPrefs.skills.push(skill);
        localStorage.setItem('user_preferences', JSON.stringify(userPrefs));
    }
    loadRecommendations();
}

function displayJobs(jobs, container) {
    if (jobs.length === 0) {
        container.innerHTML = '<p>No jobs found matching your criteria.</p>';
        return;
    }
    
    container.innerHTML = jobs.map(job => `
        <div class="job-item">
            <div class="job-title">${job.title}</div>
            <div class="job-company">${job.company}</div>
            <div class="job-details">
                <span>📍 ${job.location}</span>
                <span>✨ Match: ${job.matchScore}%</span>
            </div>
            <p style="margin: 0.5rem 0; color: #666; font-size: 0.9rem;">${job.description}</p>
            <div style="margin-top: 0.5rem;">
                ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
            <a href="${job.url}" target="_blank" class="job-link">View Job Posting →</a>
        </div>
    `).join('');
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    addPreferencesButton();
});

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    
    if (!searchTerm) {
        resultsContainer.innerHTML = '<p style="color: #666;">Please enter a search term.</p>';
        return;
    }
    
    const filteredJobs = allJobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
        job.location.toLowerCase().includes(searchTerm)
    );
    
    if (filteredJobs.length === 0) {
        resultsContainer.innerHTML = `
            <p style="color: #666; margin-top: 1rem;">
                No jobs found for "${searchTerm}". Currently showing ${allJobs.length} jobs from Adzuna API.
                Try: <strong>data</strong>, <strong>systems</strong>, or <strong>operations</strong>
            </p>
        `;
    } else {
        resultsContainer.innerHTML = `
            <h4 style="margin-top: 1.5rem; color: #003d82;">
                Found ${filteredJobs.length} job${filteredJobs.length > 1 ? 's' : ''} for "${searchTerm}"
            </h4>
        `;
        displayJobs(filteredJobs, resultsContainer);
    }
}

function addPreferencesButton() {
    const nav = document.querySelector('header nav');
    if (nav && !document.getElementById('preferencesBtn')) {
        const prefsBtn = document.createElement('button');
        prefsBtn.id = 'preferencesBtn';
        prefsBtn.className = 'btn-secondary';
        prefsBtn.textContent = '⚙️ Preferences';
        prefsBtn.style.marginRight = '1rem';
        prefsBtn.onclick = showPreferencesModal;
        nav.insertBefore(prefsBtn, nav.firstChild);
    }
}

function showPreferencesModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    const userPrefs = getUserPreferences();
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Your Preferences</h2>
            
            <div class="form-group">
                <label>Your Skills (comma-separated)</label>
                <input type="text" id="prefsSkills" value="${userPrefs.skills.join(', ')}" 
                       placeholder="Python, Data Analysis, Machine Learning">
            </div>
            
            <div class="form-group">
                <label>Preferred Locations (comma-separated)</label>
                <input type="text" id="prefsLocations" value="${userPrefs.locations.join(', ')}" 
                       placeholder="Barcelona, Madrid">
            </div>
            
            <div class="form-group">
                <label>Industries of Interest (comma-separated)</label>
                <input type="text" id="prefsIndustries" value="${userPrefs.industries.join(', ')}" 
                       placeholder="Technology, Consulting, Finance">
            </div>
            
            <button onclick="savePreferences()" class="btn-primary btn-block">
                Save Preferences
            </button>
            
            <p style="margin-top: 1rem; color: #666; font-size: 0.9rem;">
                💡 Your preferences help us recommend the most relevant jobs for you.
            </p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function savePreferences() {
    const skills = document.getElementById('prefsSkills').value
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    
    const locations = document.getElementById('prefsLocations').value
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    
    const industries = document.getElementById('prefsIndustries').value
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    
    const preferences = { skills, locations, industries };
    localStorage.setItem('user_preferences', JSON.stringify(preferences));
    
    document.querySelector('.modal').remove();
    loadRecommendations();
    
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d4edda;
        color: #155724;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 10000;
    `;
    message.textContent = '✅ Preferences saved! Jobs updated.';
    document.body.appendChild(message);
    
    setTimeout(() => message.remove(), 3000);
}
