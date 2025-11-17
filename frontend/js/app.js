// Main application logic

async function loadRecommendations() {
    const container = document.getElementById('recommendedJobs');
    container.innerHTML = '<p>Loading...</p>';
    
    // Mock data for demonstration
    const mockJobs = [
        {
            jobId: '001',
            title: 'Data Scientist',
            company: 'Tech Corp Europe',
            location: 'Barcelona, Spain',
            skills: ['Python', 'Machine Learning', 'SQL'],
            matchScore: 85,
            url: 'https://example.com/job/1'
        },
        {
            jobId: '002',
            title: 'Management Consultant',
            company: 'Strategy Partners',
            location: 'Madrid, Spain',
            skills: ['Strategy', 'Business Analysis', 'Excel'],
            matchScore: 78,
            url: 'https://example.com/job/2'
        },
        {
            jobId: '003',
            title: 'Product Manager',
            company: 'Innovation Labs',
            location: 'Remote',
            skills: ['Product Management', 'Agile', 'User Research'],
            matchScore: 72,
            url: 'https://example.com/job/3'
        }
    ];
    
    displayJobs(mockJobs, container);
    loadTrendingSkills();
}

function loadTrendingSkills() {
    const container = document.getElementById('trendingSkills');
    
    const skills = [
        'Python', 'Machine Learning', 'SQL', 'Strategy', 
        'Business Analysis', 'Excel', 'Product Management',
        'Agile', 'Data Analysis', 'Communication'
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
                ${job.matchScore ? `<span>✨ Match: ${job.matchScore}%</span>` : ''}
            </div>
            ${job.skills ? `<div class="job-details">
                ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>` : ''}
            <a href="${job.url}" target="_blank" class="job-link">View Job Posting →</a>
        </div>
    `).join('');
}

// Search functionality
if (document.getElementById('searchBtn')) {
    document.getElementById('searchBtn').addEventListener('click', () => {
        const searchTerm = document.getElementById('searchInput').value;
        const resultsContainer = document.getElementById('searchResults');
        
        if (searchTerm.trim()) {
            resultsContainer.innerHTML = '<p>Searching for "' + searchTerm + '"...</p>';
            // In production, this would call the API
            setTimeout(() => {
                resultsContainer.innerHTML = '<p>No results found. Try different keywords.</p>';
            }, 1000);
        }
    });
}
