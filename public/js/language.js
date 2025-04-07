// Language translations
const translations = {
    en: {
        // Common
        welcome: "Welcome to",
        shareContent: "Share content, connect with others, and discover something new.",
        login: "Login",
        register: "Register",
        logout: "Logout",
        submit: "Submit",
        home: "Home",
        userRoles: "User Roles",
        submitContent: "Submit Content",
        myProfile: "My Profile",
        adminPanel: "Admin Panel",
        editProfile: "Edit Profile",
        votes: "Votes",
        vote: "Vote",
        unvote: "Unvote",
        edit: "Edit",
        delete: "Delete",
        cancel: "Cancel",
        saveChanges: "Save Changes",
        or: "or",
        
        // User Roles Page
        userRolesTitle: "Kattapult User Roles",
        userRolesIntro: "Learn about the different user roles on Kattapult",
        loginPrompt: "To get started, please",
        userRole: "User",
        userCan: "Standard users can:",
        userAbility1: "Create posts (requires approval)",
        userAbility2: "Comment on approved posts",
        userAbility3: "Vote on posts",
        userAbility4: "Edit their own profile",
        userDescription: "Posts created by standard users must be approved by an admin before they appear on the site.",
        trustedUserRole: "Trusted User",
        trustedUserCan: "Trusted users can:",
        trustedUserAbility1: "Create posts (automatically approved)",
        trustedUserAbility2: "Comment on approved posts",
        trustedUserAbility3: "Vote on posts",
        trustedUserAbility4: "Edit their own profile",
        trustedUserAbility5: "Edit their own posts and comments",
        trustedUserDescription: "Posts created by trusted users are automatically approved and appear on the site immediately.",
        adminRole: "Admin",
        adminCan: "Admins can:",
        adminAbility1: "Create posts (automatically approved)",
        adminAbility2: "Comment on approved posts",
        adminAbility3: "Vote on posts",
        adminAbility4: "Edit their own profile",
        adminAbility5: "Edit their own posts and comments",
        adminAbility6: "Approve or reject posts from standard users",
        adminAbility7: "Edit any post or comment",
        adminAbility8: "Delete any post or comment",
        adminAbility9: "Manage user accounts",
        adminAbility10: "Access the admin panel",
        adminDescription: "Admins have full control over the site content and user management.",
        superAdminRole: "Super Admin",
        superAdminIntro: "The Super Admin (BobKåre) has all the capabilities of a regular admin, plus:",
        superAdminAbility1: "Cannot be deleted from the system",
        superAdminAbility2: "Cannot have their role changed",
        superAdminAbility3: "Has permanent access to all admin features",
        superAdminDescription: "The Super Admin role is a special role that cannot be assigned to other users and is protected from deletion or role changes.",
        
        // Submit page
        submitNewPost: "Submit New Post to Kattapult",
        title: "Title",
        titlePlaceholder: "Your post title",
        content: "Content",
        contentPlaceholder: "Write your content here...",
        addGif: "Add a GIF (optional)",
        searchGif: "Search for a GIF",
        searchBtn: "Search",
        selectedGif: "Selected GIF:",
        removeGif: "Remove GIF",
        
        // Comments
        comments: "Comments",
        showHideComments: "Show/Hide Comments",
        addComment: "Add a comment",
        commentPlaceholder: "Write your comment...",
        postComment: "Post Comment",
        commentContent: "Comment Content",
        currentGif: "Current GIF",
        keepGif: "Keep this GIF",
        editComment: "Edit Comment",
        
        // Profile
        yourProfile: "Your Kattapult Profile",
        role: "Role",
        joined: "Joined",
        profileInformation: "Profile Information",
        displayName: "Display Name",
        displayNameHelp: "This will be shown next to your username",
        updateDisplayName: "Update Display Name",
        newProfilePicture: "New Profile Picture",
        updateProfilePicture: "Update Profile Picture",
        supportedFormats: "Supported formats: WebP, JPG, PNG",
        updateProfile: "Update Profile",
        changePassword: "Change Password",
        currentPassword: "Current Password",
        newPassword: "New Password",
        
        // Admin
        adminPanelTitle: "Kattapult Admin Panel",
        userManagement: "User Management",
        createUser: "Create New User",
        username: "Username",
        password: "Password",
        approved: "Approved (can login immediately)",
        postedBy: "Posted by",
        postedOn: "Posted on",
        approve: "Approve",
        commentsManagement: "Comments Management",
        comment: "Comment",
        date: "Date",
        actions: "Actions",
        pendingContent: "Pending Content",
        approvedContent: "Approved Content",
        post: "Post",
        user: "User",
        editPost: "Edit Post",
        deletePost: "Delete Post"
    },
    no: {
        // Common
        welcome: "Velkommen til",
        shareContent: "Del innhold, koble til andre og oppdag noe nytt.",
        login: "Logg inn",
        register: "Registrer",
        logout: "Logg ut",
        submit: "Send inn",
        home: "Hjem",
        userRoles: "Brukerroller",
        submitContent: "Send inn innhold",
        myProfile: "Min profil",
        adminPanel: "Administrasjonspanel",
        editProfile: "Rediger profil",
        votes: "Stemmer",
        vote: "Stem",
        unvote: "Fjern stemme",
        edit: "Rediger",
        delete: "Slett",
        cancel: "Avbryt",
        saveChanges: "Lagre endringer",
        or: "eller",
        
        // User Roles Page
        userRolesTitle: "Kattapult Brukerroller",
        userRolesIntro: "Lær om de forskjellige brukerrollene på Kattapult",
        loginPrompt: "For å komme i gang, vennligst",
        userRole: "Bruker",
        userCan: "Vanlige brukere kan:",
        userAbility1: "Opprette innlegg (krever godkjenning)",
        userAbility2: "Kommentere på godkjente innlegg",
        userAbility3: "Stemme på innlegg",
        userAbility4: "Redigere sin egen profil",
        userDescription: "Innlegg opprettet av vanlige brukere må godkjennes av en administrator før de vises på nettstedet.",
        trustedUserRole: "Betrodd Bruker",
        trustedUserCan: "Betrodde brukere kan:",
        trustedUserAbility1: "Opprette innlegg (automatisk godkjent)",
        trustedUserAbility2: "Kommentere på godkjente innlegg",
        trustedUserAbility3: "Stemme på innlegg",
        trustedUserAbility4: "Redigere sin egen profil",
        trustedUserAbility5: "Redigere sine egne innlegg og kommentarer",
        trustedUserDescription: "Innlegg opprettet av betrodde brukere blir automatisk godkjent og vises på nettstedet umiddelbart.",
        adminRole: "Administrator",
        adminCan: "Administratorer kan:",
        adminAbility1: "Opprette innlegg (automatisk godkjent)",
        adminAbility2: "Kommentere på godkjente innlegg",
        adminAbility3: "Stemme på innlegg",
        adminAbility4: "Redigere sin egen profil",
        adminAbility5: "Redigere sine egne innlegg og kommentarer",
        adminAbility6: "Godkjenne eller avvise innlegg fra vanlige brukere",
        adminAbility7: "Redigere alle innlegg eller kommentarer",
        adminAbility8: "Slette alle innlegg eller kommentarer",
        adminAbility9: "Administrere brukerkontoer",
        adminAbility10: "Få tilgang til admin-panelet",
        adminDescription: "Administratorer har full kontroll over nettstedets innhold og brukeradministrasjon.",
        superAdminRole: "Superadministrator",
        superAdminIntro: "Superadministratoren (BobKåre) har alle funksjonene til en vanlig administrator, pluss:",
        superAdminAbility1: "Kan ikke slettes fra systemet",
        superAdminAbility2: "Kan ikke få endret sin rolle",
        superAdminAbility3: "Har permanent tilgang til alle admin-funksjoner",
        superAdminDescription: "Superadministratorrollen er en spesiell rolle som ikke kan tildeles andre brukere og er beskyttet mot sletting eller rolleendringer.",
        
        // Submit page
        submitNewPost: "Send inn nytt innlegg til Kattapult",
        title: "Tittel",
        titlePlaceholder: "Din innleggstittel",
        content: "Innhold",
        contentPlaceholder: "Skriv innholdet ditt her...",
        addGif: "Legg til en GIF (valgfritt)",
        searchGif: "Søk etter en GIF",
        searchBtn: "Søk",
        selectedGif: "Valgt GIF:",
        removeGif: "Fjern GIF",
        submit: "Send inn",
        
        // Comments
        comments: "Kommentarer",
        showHideComments: "Vis/Skjul kommentarer",
        addComment: "Legg til en kommentar",
        commentPlaceholder: "Skriv kommentaren din...",
        postComment: "Publiser kommentar",
        commentContent: "Kommentarinnhold",
        currentGif: "Nåværende GIF",
        keepGif: "Behold denne GIF-en",
        editComment: "Rediger kommentar",
        
        // Profile
        yourProfile: "Din Kattapult-profil",
        role: "Rolle",
        joined: "Ble med",
        profileInformation: "Profilinformasjon",
        displayName: "Visningsnavn",
        displayNameHelp: "Dette vil vises ved siden av brukernavnet ditt",
        updateDisplayName: "Oppdater visningsnavn",
        newProfilePicture: "Nytt profilbilde",
        updateProfilePicture: "Oppdater profilbilde",
        supportedFormats: "Støttede formater: WebP, JPG, PNG",
        updateProfile: "Oppdater profil",
        changePassword: "Endre passord",
        currentPassword: "Nåværende passord",
        newPassword: "Nytt passord",
        
        // Admin
        adminPanelTitle: "Kattapult administrasjonspanel",
        userManagement: "Brukeradministrasjon",
        createUser: "Opprett ny bruker",
        username: "Brukernavn",
        password: "Passord",
        approved: "Godkjent (kan logge inn umiddelbart)",
        postedBy: "Publisert av",
        postedOn: "Publisert",
        approve: "Godkjenn",
        commentsManagement: "Kommentaradministrasjon",
        comment: "Kommentar",
        date: "Dato",
        actions: "Handlinger",
        pendingContent: "Ventende innhold",
        approvedContent: "Godkjent innhold",
        post: "Innlegg",
        user: "Bruker",
        editPost: "Rediger innlegg",
        deletePost: "Slett innlegg"
    }
};

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    // Get the saved language from localStorage, default to English if none is saved
    const savedLanguage = localStorage.getItem('kattapult-language') || 'en';
    
    // Apply the language setting
    setLanguage(savedLanguage);
    
    // Set up language switch event listeners
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const language = this.getAttribute('data-lang');
            setLanguage(language);
        });
    });
});

// Set language - this handles both the initial setting and changes
function setLanguage(language) {
    // Save the selected language to localStorage
    localStorage.setItem('kattapult-language', language);
    
    // Update the document's lang attribute
    document.documentElement.lang = language;
    
    // Update UI to show the active language option
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        const optionLang = option.getAttribute('data-lang');
        if (optionLang === language) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Translate all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        if (translations[language] && translations[language][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.getAttribute('type') !== 'submit' && element.getAttribute('type') !== 'button') {
                    element.value = translations[language][key];
                }
            } else if (element.childElementCount > 0) {
                // Handle elements with children more carefully
                for (let i = 0; i < element.childNodes.length; i++) {
                    const node = element.childNodes[i];
                    if (node.nodeType === Node.TEXT_NODE && node.nodeValue && node.nodeValue.trim() !== '') {
                        node.nodeValue = translations[language][key];
                        break; // Only replace the first text node
                    }
                }
            } else {
                element.textContent = translations[language][key];
            }
        }
    });
    
    // Translate placeholders
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[language] && translations[language][key]) {
            element.setAttribute('placeholder', translations[language][key]);
        }
    });
}

// Helper function to programmatically translate text based on a key
function translate(key) {
    const language = localStorage.getItem('kattapult-language') || 'en';
    return translations[language] && translations[language][key] ? 
           translations[language][key] : key;
} 