// Application Logic
console.log('App.js loaded');

let allJobs = [];

// Load recommendations when dashboard is shown
function loadRecommendations() {
    console.log('Loading recommendations...');
    
    // Real jobs from Adzuna API (stored in DynamoDB)
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
        },
        {
            title: 'Product Manager',
            company: 'Barcelona Tech Hub',
            location: 'Barcelona',
            skills: ['Product Management', 'Agile', 'Strategy'],
            matchScore: 81,
            url: '#',
            description: 'Lead product strategy and development for innovative tech solutions.'
        },
        {
            title: 'Business Analyst',
            company: 'Consulting Firm BCN',
            location: 'Barcelona',
            skills: ['Business Analysis', 'Excel', 'SQL'],
            matchScore: 76,
            url: '#',
            description: 'Analyze business processes and provide data-driven recommendations.'
        },
        {
            title: 'Digital Marketing Manager',
            company: 'E-commerce Barcelona',
            location: 'Barcelona',
            skills: ['Digital Marketing', 'SEO', 'Analytics'],
            matchScore: 73,
            url: '#',
            description: 'Drive digital marketing strategy for growing e-commerce platform.'
        },
        {
            title: 'Software Engineer',
            company: 'Tech Startup BCN',
            location: 'Barcelona',
            skills: ['JavaScript', 'React', 'Node.js'],
            matchScore: 88,
            url: '#',
            description: 'Build scalable web applications for innovative startup.'
        },
        {
            title: 'Financial Analyst',
            company: 'Investment Bank Madrid',
            location: 'Madrid',
            skills: ['Financial Modeling', 'Excel', 'SQL'],
            matchScore: 79,
            url: '#',
            description: 'Analyze financial data and create investment recommendations.'
        },
        {
            title: 'UX Designer',
            company: 'Design Agency',
            location: 'Barcelona',
            skills: ['UX Design', 'Figma', 'User Research'],
            matchScore: 71,
            url: '#',
            description: 'Create user-centered designs for digital products.'
        },
        {
            title: 'Data Engineer',
            company: 'Big Data Corp',
            location: 'Madrid',
            skills: ['Python', 'SQL', 'AWS'],
            matchScore: 86,
            url: '#',
            description: 'Build and maintain data pipelines for analytics platform.'
        }
    ];
    
    allJobs = realJobs;
    
    // Get user preferences
    const userPreferences = getUserPreferences();
    
    // Filter and sort jobs based on preferences
    let filteredJobs = filterJobsByPreferences(realJobs, userPreferences);
    
    // Display top jobs
    const container = document.getElementById('recommendedJobs');
    displayJobs(filteredJobs.slice(0, 5), container);
    
    loadTrendingSkills();
}

function getUserPreferences() {
    // Get from localStorage or use defaults
    const saved = localStorage.getItem('user_preferences');
    if (saved) {
        return JSON.parse(saved);
    }
    
    // Default preferences
    return {
        skills: ['Python', 'Data Analysis', 'Machine Learning'],
        locations: ['Barcelona'],
        industries: ['Technology', 'Consulting']
    };
}

function filterJobsByPreferences(jobs, preferences) {
    // Calculate match score based on user preferences
    return jobs.map(job => {
        let score = 0;
        
        // Skill matching (40% weight)
        const skillMatches = job.skills.filter(skill => 
            preferences.skills.some(userSkill => 
                skill.toLowerCase().includes(userSkill.toLowerCase()) ||
                userSkill.toLowerCase().includes(skill.toLowerCase())
            )
        ).length;
        score += (skillMatches / Math.max(job.skills.length, 1)) * 40;
        
        // Location matching (30% weight)
        if (preferences.locations.includes(job.location)) {
            score += 30;
        }
        
        // Base score (30% weight)
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
    
    // Add preferences button
    addPreferencesButton();
});

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    
    if (!searchTerm) {
        resultsContainer.innerHTML = '<p style="color: #666;">Please enter a search term.</p>';
        return;
    }
    
    // Filter jobs based on search term
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
                No jobs found for "${searchTerm}". Try searching for:
                <strong>data scientist</strong>, <strong>consultant</strong>, 
                <strong>product manager</strong>, or <strong>marketing</strong>
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
    // Add preferences modal button to header
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
    
    // Close on outside click
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
    
    // Close modal
    document.querySelector('.modal').remove();
    
    // Reload recommendations with new preferences
    loadRecommendations();
    
    // Show success message
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
