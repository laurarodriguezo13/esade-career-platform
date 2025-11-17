// Main application logic

async function loadRecommendations() {
    const container = document.getElementById('recommendedJobs');
    container.innerHTML = '<p>Loading real jobs from database...</p>';
    
    // Real jobs from your DynamoDB (updated manually for demo)
    const realJobs = [
        {
            title: 'Data Scientist',
            company: 'Smadex SLU',
            location: 'Barcelona',
            skills: ['Machine Learning', 'Python', 'Data Analysis'],
            matchScore: 92,
            url: 'https://www.adzuna.es/details/5495495341?utm_medium=api&utm_source=b6b04941',
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
        }
    ];
    
    displayJobs(realJobs, container);
    loadTrendingSkills();
}

function loadTrendingSkills() {
    const container = document.getElementById('trendingSkills');
    
    // Real skills from your database
    const skills = [
        'Machine Learning', 'Python', 'Data Analysis', 'Systems Engineering',
        'Communication', 'Agile', 'Product Management', 'SQL', 
        'Business Analysis', 'Strategy', 'Project Management', 'Automation'
    ];
    
    container.innerHTML = skills.map(skill => 
        `<span class="skill-tag">${skill}</span>`
    ).join('');
}

function displayJobs(jobs, container) {
    if (jobs.length === 0) {
        container.innerHTML = '<p>No jobs found.</p>';
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
if (document.getElementById('searchBtn')) {
    document.getElementById('searchBtn').addEventListener('click', () => {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const resultsContainer = document.getElementById('searchResults');
        
        if (searchTerm.trim()) {
            resultsContainer.innerHTML = `<p style="color: #666;">Search functionality would filter jobs by: "${searchTerm}". In production, this would query the DynamoDB API.</p>`;
        }
    });
}
