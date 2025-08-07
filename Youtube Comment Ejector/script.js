// Configuration
const CONFIG = {
  maxResults: 500,
  maxCommentsPerPage: 100,
  displayLimit: 10
};

// State management
let allComments = [];
let isLoading = false;

// Utility functions
function extractVideoId(input) {
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^[a-zA-Z0-9_-]{11}$/ // Direct video ID
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1] || match[0];
  }
  return input; // Return as-is if no pattern matches
}

function validateVideoId(videoId) {
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}

function showLoading(show = true) {
  const button = document.getElementById('fetchButton');
  const progressContainer = document.getElementById('progressContainer');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  
  isLoading = show;
  button.disabled = show;
  button.textContent = show ? 'Fetching...' : 'Fetch Comments';
  progressContainer.style.display = show ? 'block' : 'none';
  
  if (!show) {
    progressBar.style.width = '0%';
    progressText.textContent = '';
  }
}

function updateProgress(current, total, status = '') {
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const percentage = Math.round((current / total) * 100);
  
  progressBar.style.width = percentage + '%';
  progressText.textContent = `${status} ${current}/${total} comments (${percentage}%)`;
}

async function fetchComments() {
  const videoIdInput = document.getElementById("videoId").value.trim();
  if (!videoIdInput) {
    showError("Please enter a YouTube video ID or URL");
    return;
  }

  const videoId = extractVideoId(videoIdInput);
  if (!validateVideoId(videoId)) {
    showError("Invalid YouTube video ID. Please check your input.");
    return;
  }

  const apiKey = document.getElementById("apiKey").value.trim();
  if (!apiKey) {
    showError("Please enter your YouTube API key");
    return;
  }

  showLoading(true);
  clearResults();
  allComments = [];
  
  let nextPageToken = "";
  let fetchedCount = 0;

  try {
    updateProgress(0, CONFIG.maxResults, 'Fetching');
    
    do {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/commentThreads?key=${apiKey}&videoId=${videoId}&part=snippet&maxResults=${CONFIG.maxCommentsPerPage}&pageToken=${nextPageToken}&order=relevance`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      if (!data.items || data.items.length === 0) {
        break;
      }

      data.items.forEach((item) => {
        const comment = item.snippet.topLevelComment.snippet;
        allComments.push({
          text: comment.textDisplay,
          textOriginal: comment.textOriginal,
          authorDisplayName: comment.authorDisplayName,
          authorProfileImageUrl: comment.authorProfileImageUrl,
          likeCount: comment.likeCount || 0,
          publishedAt: new Date(comment.publishedAt),
          length: comment.textDisplay.length,
          wordCount: comment.textDisplay.split(/\s+/).filter(word => word.length > 0).length
        });
      });

      fetchedCount = allComments.length;
      updateProgress(fetchedCount, CONFIG.maxResults, 'Fetched');
      nextPageToken = data.nextPageToken;
      
      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } while (nextPageToken && fetchedCount < CONFIG.maxResults);

    if (allComments.length === 0) {
      showError("No comments found for this video. The video might have comments disabled.");
      return;
    }

    displayResults();
    displayStats();
    
  } catch (err) {
    console.error("Error fetching comments:", err);
    showError(`Failed to fetch comments: ${err.message}`);
  } finally {
    showLoading(false);
  }
}

function showError(message) {
  const errorContainer = document.getElementById('errorContainer');
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = message;
  errorContainer.style.display = 'block';
  setTimeout(() => {
    errorContainer.style.display = 'none';
  }, 5000);
}

function clearResults() {
  document.getElementById('errorContainer').style.display = 'none';
  document.getElementById('mostLiked').innerHTML = '';
  document.getElementById('longestComments').innerHTML = '';
  document.getElementById('recentComments').innerHTML = '';
  document.getElementById('stats').innerHTML = '';
}

function displayResults() {
  displayTopLiked(allComments);
  displayLongest(allComments);
  displayRecent(allComments);
}

function displayTopLiked(comments) {
  const sorted = [...comments]
    .filter(c => c.likeCount > 0)
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, CONFIG.displayLimit);
  
  const container = document.getElementById("mostLiked");
  container.innerHTML = "";
  
  if (sorted.length === 0) {
    container.innerHTML = '<p class="no-results">No liked comments found.</p>';
    return;
  }
  
  sorted.forEach((comment, index) => {
    container.appendChild(createCommentElement(comment, index + 1, 'likes'));
  });
}

function displayLongest(comments) {
  const sorted = [...comments]
    .sort((a, b) => b.length - a.length)
    .slice(0, CONFIG.displayLimit);
  
  const container = document.getElementById("longestComments");
  container.innerHTML = "";
  
  sorted.forEach((comment, index) => {
    container.appendChild(createCommentElement(comment, index + 1, 'length'));
  });
}

function displayRecent(comments) {
  const sorted = [...comments]
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .slice(0, CONFIG.displayLimit);
  
  const container = document.getElementById("recentComments");
  container.innerHTML = "";
  
  sorted.forEach((comment, index) => {
    container.appendChild(createCommentElement(comment, index + 1, 'recent'));
  });
}

function createCommentElement(comment, rank, type) {
  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';
  
  const timeAgo = getTimeAgo(comment.publishedAt);
  let badge = '';
  
  switch(type) {
    case 'likes':
      badge = `<span class="badge likes-badge">#${rank} • ${comment.likeCount} likes</span>`;
      break;
    case 'length':
      badge = `<span class="badge length-badge">#${rank} • ${comment.length} characters</span>`;
      break;
    case 'recent':
      badge = `<span class="badge recent-badge">#${rank} • ${timeAgo}</span>`;
      break;
  }
  
  commentDiv.innerHTML = `
    <div class="comment-header">
      <img src="${comment.authorProfileImageUrl}" alt="${comment.authorDisplayName}" class="author-avatar" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22><rect width=%22100%%22 height=%22100%%22 fill=%22%23ddd%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22>${comment.authorDisplayName.charAt(0)}</text></svg>'">
      <div class="comment-info">
        <span class="author-name">${comment.authorDisplayName}</span>
        ${badge}
      </div>
    </div>
    <div class="comment-text">${comment.text}</div>
    <div class="comment-footer">
      <span class="comment-stats">
        👍 ${comment.likeCount} • 📝 ${comment.wordCount} words • 📅 ${timeAgo}
      </span>
    </div>
  `;
  
  return commentDiv;
}

function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

function displayStats() {
  if (allComments.length === 0) return;
  
  const stats = calculateStats(allComments);
  const container = document.getElementById("stats");
  
  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-number">${stats.totalComments}</span>
        <span class="stat-label">Total Comments</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">${stats.totalLikes}</span>
        <span class="stat-label">Total Likes</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">${stats.avgLength}</span>
        <span class="stat-label">Avg Length</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">${stats.engagementRate}%</span>
        <span class="stat-label">Engagement Rate</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">${stats.avgWords}</span>
        <span class="stat-label">Avg Words</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">${stats.mostActiveHour}</span>
        <span class="stat-label">Peak Hour</span>
      </div>
    </div>
  `;
}

function calculateStats(comments) {
  const totalComments = comments.length;
  const totalLikes = comments.reduce((sum, c) => sum + c.likeCount, 0);
  const totalLength = comments.reduce((sum, c) => sum + c.length, 0);
  const totalWords = comments.reduce((sum, c) => sum + c.wordCount, 0);
  const likedComments = comments.filter(c => c.likeCount > 0).length;
  
  // Find most active hour
  const hourCounts = new Array(24).fill(0);
  comments.forEach(c => {
    const hour = c.publishedAt.getHours();
    hourCounts[hour]++;
  });
  const mostActiveHour = hourCounts.indexOf(Math.max(...hourCounts));
  
  return {
    totalComments,
    totalLikes,
    avgLength: Math.round(totalLength / totalComments),
    avgWords: Math.round(totalWords / totalComments),
    engagementRate: Math.round((likedComments / totalComments) * 100),
    mostActiveHour: `${mostActiveHour}:00`
  };
}

// Search and filter functionality
function searchComments() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!query) {
    displayResults();
    return;
  }
  
  const filtered = allComments.filter(comment => 
    comment.text.toLowerCase().includes(query) ||
    comment.authorDisplayName.toLowerCase().includes(query)
  );
  
  displayTopLiked(filtered);
  displayLongest(filtered);
  displayRecent(filtered);
  
  // Update search result count
  const searchResults = document.getElementById('searchResults');
  searchResults.textContent = `Found ${filtered.length} comments matching "${query}"`;
  searchResults.style.display = 'block';
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').style.display = 'none';
  displayResults();
}

// Export functionality
function exportComments() {
  if (allComments.length === 0) {
    showError('No comments to export');
    return;
  }
  
  const csvContent = generateCSV(allComments);
  downloadFile(csvContent, 'youtube-comments.csv', 'text/csv');
}

function generateCSV(comments) {
  const headers = ['Author', 'Comment', 'Likes', 'Length', 'Words', 'Published Date'];
  const rows = comments.map(c => [
    `"${c.authorDisplayName.replace(/"/g, '""')}"`,
    `"${c.textOriginal.replace(/"/g, '""')}"`,
    c.likeCount,
    c.length,
    c.wordCount,
    c.publishedAt.toISOString()
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
