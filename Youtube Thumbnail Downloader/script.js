// Function to handle the downloadThumbnail button click event
function downloadThumbnail(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the YouTube video URL from the input field
  let videoUrl = document.getElementById("videoUrl").value;

  // Extract the video ID from the YouTube URL
  let videoId = extractVideoId(videoUrl);

  // Check if a valid videoId is obtained
  if (videoId) {
    // Get the thumbnail element
    let thumbnail = document.getElementById("thumbnail");

    // Construct the URL for the high-resolution thumbnail image
    let url = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg?t=${new Date().getTime()}`;

    // Test loading the image
    const testImage = new Image();
    testImage.onload = () => {
      // Set the thumbnail image source
      thumbnail.src = url;

      // Save the URL and filename for later download
      window.downloadUrl = url;
      window.downloadFilename = `${videoId}.jpg`;
    };

    testImage.onerror = () => {
      alert("Failed to load the thumbnail. The video may not have a high-resolution thumbnail.");
    };

    testImage.src = url; // Attempt to load
  } else {
    alert("Invalid YouTube video URL. Please check and try again.");
  }
}

// Function to extract the video ID from a YouTube video URL
function extractVideoId(url) {
  let match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:v\/|u\/\w\/|embed\/|watch\?v=|&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

// Function to handle the downloadImage button click event
function downloadImage() {
  if (window.downloadUrl && window.downloadFilename) {
    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = window.downloadUrl;
    a.download = window.downloadFilename;

    // Programmatically click the anchor element to trigger the download
    a.target = "_blank"; // Open in a new tab if needed
    a.click();
  } else {
    alert("No image to download. Please enter a valid YouTube video URL.");
  }
}
