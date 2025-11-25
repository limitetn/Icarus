// script.js

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const welcomeCard = document.getElementById('welcome-card');
    const loginForm = document.getElementById('login-form');
    const userDashboard = document.getElementById('user-dashboard');
    const inviteForm = document.getElementById('invite-form');
    const keyDisplay = document.getElementById('key-display');
    const downloadForm = document.getElementById('download-form');
    const downloadReady = document.getElementById('download-ready');
    const welcomeAnimation = document.getElementById('welcome-animation');
    
    const enterCodeBtn = document.getElementById('enter-code-btn');
    const loginBtn = document.getElementById('login-btn');
    const loginBackBtn = document.getElementById('login-back-btn');
    const backBtn = document.getElementById('back-btn');
    const inviteCodeForm = document.getElementById('invite-code-form');
    const loginCodeForm = document.getElementById('login-code-form');
    const downloadKeyForm = document.getElementById('download-key-form');
    const downloadBtn = document.getElementById('download-btn');
    const copyKeyBtn = document.getElementById('copy-key-btn');
    const copyRegInviteBtn = document.getElementById('copy-reg-invite-btn');
    const copyInviteBtn = document.getElementById('copy-invite-btn');
    const copyDownloadBtn = document.getElementById('copy-download-btn');
    const generateInviteBtn = document.getElementById('generate-invite-btn');
    const proceedDownloadBtn = document.getElementById('proceed-download-btn');
    
    const inviteCodeInput = document.getElementById('invite-code');
    const loginCodeInput = document.getElementById('login-code');
    const downloadKeyInput = document.getElementById('download-key-input');
    const downloadKeySpan = document.getElementById('download-key');
    const regInviteCodeSpan = document.getElementById('reg-invite-code');
    const downloadLink = document.getElementById('download-link');
    
    const userInviteCode = document.getElementById('user-invite-code');
    const userDownloadKey = document.getElementById('user-download-key');
    const invitesRemaining = document.getElementById('invites-remaining');
    const inviteList = document.getElementById('invite-list');
    const generatedInvites = document.getElementById('generated-invites');
    
    let currentUserData = null;
    
    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
    
    // Hide welcome animation after delay
    setTimeout(function() {
        welcomeAnimation.classList.add('hidden');
    }, 3000);
    
    // Event Listeners
    enterCodeBtn.addEventListener('click', showInviteForm);
    loginBtn.addEventListener('click', showLoginForm);
    loginBackBtn.addEventListener('click', showWelcomeCard);
    backBtn.addEventListener('click', showWelcomeCard);
    inviteCodeForm.addEventListener('submit', handleInviteSubmission);
    loginCodeForm.addEventListener('submit', handleLoginSubmission);
    downloadKeyForm.addEventListener('submit', handleDownloadSubmission);
    downloadBtn.addEventListener('click', showDownloadForm);
    copyKeyBtn.addEventListener('click', () => copyToClipboard(downloadKeySpan.textContent, copyKeyBtn));
    copyRegInviteBtn.addEventListener('click', () => copyToClipboard(regInviteCodeSpan.textContent, copyRegInviteBtn));
    copyInviteBtn.addEventListener('click', () => copyToClipboard(userInviteCode.textContent, copyInviteBtn));
    copyDownloadBtn.addEventListener('click', () => copyToClipboard(userDownloadKey.textContent, copyDownloadBtn));
    generateInviteBtn.addEventListener('click', handleGenerateInvite);
    proceedDownloadBtn.addEventListener('click', () => {
        downloadKeyInput.value = currentUserData.downloadKey;
        showDownloadForm();
    });
    
    // Functions
    function showWelcomeCard() {
        hideAllCards();
        welcomeCard.classList.remove('hidden');
    }
    
    function showLoginForm() {
        hideAllCards();
        loginForm.classList.remove('hidden');
        loginCodeInput.focus();
    }
    
    function showInviteForm() {
        hideAllCards();
        inviteForm.classList.remove('hidden');
        inviteCodeInput.focus();
    }
    
    function showUserDashboard(userData) {
        hideAllCards();
        currentUserData = userData;
        userInviteCode.textContent = userData.inviteCode;
        userDownloadKey.textContent = userData.downloadKey;
        invitesRemaining.textContent = userData.invitesRemaining;
        
        // Display generated invites
        if (userData.invitesCreated && userData.invitesCreated.length > 0) {
            inviteList.innerHTML = '';
            userData.invitesCreated.forEach(code => {
                const li = document.createElement('li');
                li.innerHTML = `<span class="invite-code-item">${code}</span>`;
                inviteList.appendChild(li);
            });
            generatedInvites.classList.remove('hidden');
        }
        
        userDashboard.classList.remove('hidden');
    }
    
    function showKeyDisplay(inviteCode, downloadKey) {
        hideAllCards();
        regInviteCodeSpan.textContent = inviteCode;
        downloadKeySpan.textContent = downloadKey;
        keyDisplay.classList.remove('hidden');
    }
    
    function showDownloadForm() {
        hideAllCards();
        downloadForm.classList.remove('hidden');
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
        loginForm.classList.add('hidden');
        userDashboard.classList.add('hidden');
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
                showKeyDisplay(data.inviteCode, data.downloadKey);
            } else {
                alert(data.error || 'Invalid invitation code');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    }
    
    async function handleLoginSubmission(e) {
        e.preventDefault();
        
        const code = loginCodeInput.value.trim();
        
        if (!code) {
            alert('Please enter your code');
            return;
        }
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showUserDashboard(data);
            } else {
                alert(data.error || 'Invalid code');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    }
    
    async function handleGenerateInvite() {
        if (!currentUserData) {
            alert('Please login first');
            return;
        }
        
        if (currentUserData.invitesRemaining <= 0) {
            alert('You have used all your invites (5/5 limit)');
            return;
        }
        
        try {
            const response = await fetch('/api/user/generate-invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userCode: currentUserData.downloadKey })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert(`New invite code generated: ${data.inviteCode}`);
                
                // Update UI
                currentUserData.invitesRemaining = data.invitesRemaining;
                currentUserData.invitesCreated.push(data.inviteCode);
                invitesRemaining.textContent = data.invitesRemaining;
                
                // Add to list
                const li = document.createElement('li');
                li.innerHTML = `<span class="invite-code-item">${data.inviteCode}</span>`;
                inviteList.appendChild(li);
                generatedInvites.classList.remove('hidden');
            } else {
                alert(data.error || 'Failed to generate invite');
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
    
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard');
        });
    }
});
