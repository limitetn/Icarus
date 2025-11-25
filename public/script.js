// script.js

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const welcomeCard = document.getElementById('welcome-card');
    const inviteForm = document.getElementById('invite-form');
    const keyDisplay = document.getElementById('key-display');
    const downloadForm = document.getElementById('download-form');
    const downloadReady = document.getElementById('download-ready');
    const welcomeAnimation = document.getElementById('welcome-animation');
    
    const enterCodeBtn = document.getElementById('enter-code-btn');
    const backBtn = document.getElementById('back-btn');
    const inviteCodeForm = document.getElementById('invite-code-form');
    const downloadKeyForm = document.getElementById('download-key-form');
    const downloadBtn = document.getElementById('download-btn');
    const copyKeyBtn = document.getElementById('copy-key-btn');
    
    const inviteCodeInput = document.getElementById('invite-code');
    const downloadKeyInput = document.getElementById('download-key-input');
    const downloadKeySpan = document.getElementById('download-key');
    const downloadLink = document.getElementById('download-link');
    
    // Hide welcome animation after delay
    setTimeout(function() {
        welcomeAnimation.classList.add('hidden');
    }, 3000);
    
    // Event Listeners
    enterCodeBtn.addEventListener('click', showInviteForm);
    backBtn.addEventListener('click', showWelcomeCard);
    inviteCodeForm.addEventListener('submit', handleInviteSubmission);
    downloadKeyForm.addEventListener('submit', handleDownloadSubmission);
    downloadBtn.addEventListener('click', showDownloadForm);
    copyKeyBtn.addEventListener('click', copyKeyToClipboard);
    
    // Functions
    function showWelcomeCard() {
        hideAllCards();
        welcomeCard.classList.remove('hidden');
    }
    
    function showInviteForm() {
        hideAllCards();
        inviteForm.classList.remove('hidden');
        inviteCodeInput.focus();
    }
    
    function showKeyDisplay(key) {
        hideAllCards();
        downloadKeySpan.textContent = key;
        keyDisplay.classList.remove('hidden');
    }
    
    function showDownloadForm() {
        hideAllCards();
        downloadForm.classList.remove('hidden');
        downloadKeyInput.value = downloadKeySpan.textContent;
        downloadKeyInput.focus();
    }
    
    function showDownloadReady(downloadLinkUrl, fileName) {
        hideAllCards();
        downloadLink.href = downloadLinkUrl;
        downloadLink.download = fileName;
        downloadLink.textContent = `Download ${fileName}`;
        downloadReady.classList.remove('hidden');
        
        // Auto-start download after a short delay
        setTimeout(() => {
            window.open(downloadLinkUrl, '_blank');
        }, 2000);
    }
    
    function hideAllCards() {
        welcomeCard.classList.add('hidden');
        inviteForm.classList.add('hidden');
        keyDisplay.classList.add('hidden');
        downloadForm.classList.add('hidden');
        downloadReady.classList.add('hidden');
    }
    
    async function handleInviteSubmission(e) {
        e.preventDefault();
        
        const inviteCode = inviteCodeInput.value.trim();
        
        if (!inviteCode) {
            alert('Please enter an invitation code');
            return;
        }
        
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inviteCode })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showKeyDisplay(data.downloadKey);
            } else {
                alert(data.error || 'Invalid invitation code');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    }
    
    async function handleDownloadSubmission(e) {
        e.preventDefault();
        
        const key = downloadKeyInput.value.trim();
        
        if (!key) {
            alert('Please enter a download key');
            return;
        }
        
        try {
            const response = await fetch('/api/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ key })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showDownloadReady(data.downloadLink, data.fileName);
            } else {
                alert(data.error || 'Invalid download key');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    }
    
    function copyKeyToClipboard() {
        const key = downloadKeySpan.textContent;
        navigator.clipboard.writeText(key).then(() => {
            // Show feedback
            const originalText = copyKeyBtn.textContent;
            copyKeyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyKeyBtn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }
});