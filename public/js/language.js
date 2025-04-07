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
        
        // Login/Register
        loginTitle: "Login to Kattapult",
        registerTitle: "Join Kattapult",
        username: "Username",
        password: "Password",
        noAccount: "Don't have an account?",
        registerHere: "Register here",
        haveAccount: "Already have an account?",
        loginHere: "Login here",
        profilePictureOptional: "Profile Picture (Optional)",
        
        // Home page
        postedBy: "Posted by",
        postedOn: "on",
        deletePost: "Delete Post",
        showHideComments: "Show/Hide Comments",
        commentPlaceholder: "Add a comment...",
        searchGif: "Search for GIFs...",
        searchBtn: "Search",
        removeGif: "Remove GIF",
        postComment: "Post Comment",
        loginToComment: "Please",
        toPostAndComment: "to comment and post.",
        deleteConfirmation: "Are you sure you want to delete this post? This action cannot be undone.",
        deleteCommentConfirmation: "Are you sure you want to delete this comment?",
        
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
        noGifsFound: "No GIFs found",
        gifSearchError: "Error searching for GIFs",
        commentRequiredContent: "Please add either text or a GIF to your comment.",
        
        // Alerts
        usernameExists: "Username already exists",
        registrationSuccessful: "Registration successful! Please wait for admin approval before logging in.",
        invalidCredentials: "Invalid credentials",
        pendingApproval: "Your account is pending approval",
        loginFailed: "Login failed",
        registrationFailed: "Registration failed",
        serverError: "Server error",
        errorProcessingVote: "Error processing vote",
        voteRemoved: "Vote removed successfully",
        voteAdded: "Vote added successfully",
        commentAdded: "Comment added successfully",
        errorAddingComment: "Error adding comment",
        commentDeleted: "Comment deleted successfully",
        errorDeletingComment: "Error deleting comment",
        postApproved: "Item approved successfully",
        errorApprovingPost: "Error approving item",
        userApproved: "User approved successfully",
        userNotFound: "User not found",
        userDeleted: "User deleted successfully",
        errorDeletingUser: "Error deleting user",
        postDeleted: "Post deleted successfully",
        errorDeletingPost: "Error deleting post",
        userUnapproved: "User unapproved successfully",
        errorUnapproving: "Error unapproving user",
        cannotUnapproveAdmin: "Cannot unapprove super admin",
        passwordResetSuccess: "Password reset successfully",
        errorResettingPassword: "Error resetting password",
        passwordMinLength: "Password must be at least 6 characters long",
        userRoleUpdated: "User role updated successfully",
        errorUpdatingRole: "Error updating user role",
        cannotChangeAdminRole: "Cannot change super admin role",
        userCreated: "User created successfully",
        errorCreatingUser: "Error creating user",
        postUpdated: "Post updated successfully",
        errorUpdatingPost: "Error updating post",
        commentUpdated: "Comment updated successfully",
        errorUpdatingComment: "Error updating comment",
        commentMustContain: "Comments must contain either text or a GIF",
        postNotFound: "Post not found",
        commentNotFound: "Comment not found",
        notPermitted: "You do not have permission to perform this action",
        errorApprovingUser: "Error approving user",
        deleteUserConfirmation: "Are you sure you want to delete this user?",
        deletePostConfirmation: "Are you sure you want to delete this post? This action cannot be undone.",
        
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
        profilePictureSuccess: "Profile picture updated successfully",
        
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
        deletePost: "Delete Post",
        search: "Search",
        searchPlaceholder: "Search by username, display name, or role...",
        searchComments: "Search comments...",
        searchContent: "Search content...",
        sortBy: "Sort by",
        ascending: "Ascending",
        descending: "Descending",
        filterBy: "Filter by",
        allUsers: "All Users",
        approvedOnly: "Approved Only",
        pendingOnly: "Pending Only",
        clearFilters: "Clear Filters"
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
        
        // Login/Register
        loginTitle: "Logg inn på Kattapult",
        registerTitle: "Bli med på Kattapult",
        username: "Brukernavn",
        password: "Passord",
        noAccount: "Har du ikke en konto?",
        registerHere: "Registrer deg her",
        haveAccount: "Har du allerede en konto?",
        loginHere: "Logg inn her",
        profilePictureOptional: "Profilbilde (Valgfritt)",
        
        // Home page
        postedBy: "Skrevet av",
        postedOn: "den",
        deletePost: "Slett innlegg",
        showHideComments: "Vis/Skjul kommentarer",
        commentPlaceholder: "Legg til en kommentar...",
        searchGif: "Søk etter GIFer...",
        searchBtn: "Søk",
        removeGif: "Fjern GIF",
        postComment: "Send kommentar",
        loginToComment: "Vennligst",
        toPostAndComment: "for å kommentere og publisere.",
        deleteConfirmation: "Er du sikker på at du vil slette dette innlegget? Denne handlingen kan ikke angres.",
        deleteCommentConfirmation: "Er du sikker på at du vil slette denne kommentaren?",
        
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
        noGifsFound: "Ingen GIFs funnet",
        gifSearchError: "Feil ved søk etter GIF",
        commentRequiredContent: "Vennligst legg til enten tekst eller en GIF i kommentaren din.",
        
        // Alerts
        usernameExists: "Brukernavn eksisterer allerede",
        registrationSuccessful: "Registrering vellykket! Vennligst vent på admin-godkjenning før du logger inn.",
        invalidCredentials: "Ugyldige innloggingspålysninger",
        pendingApproval: "Kontoen din venter på godkjenning",
        loginFailed: "Innlogging feilet",
        registrationFailed: "Registrering feilet",
        serverError: "Serverfeil",
        errorProcessingVote: "Feil ved behandling av stemme",
        voteRemoved: "Stemme fjernet vellykket",
        voteAdded: "Stemme lagt til vellykket",
        commentAdded: "Kommentar lagt til vellykket",
        errorAddingComment: "Feil ved tilføying av kommentar",
        commentDeleted: "Kommentar fjernet vellykket",
        errorDeletingComment: "Feil ved sletting av kommentar",
        postApproved: "Element godkjent vellykket",
        errorApprovingPost: "Feil ved godkjenning av element",
        userApproved: "Bruker godkjent vellykket",
        userNotFound: "Bruker ikke funnet",
        userDeleted: "Bruker fjernet vellykket",
        errorDeletingUser: "Feil ved sletting av bruker",
        postDeleted: "Innlegg fjernet vellykket",
        errorDeletingPost: "Feil ved sletting av innlegg",
        userUnapproved: "Bruker ikke godkjent vellykket",
        errorUnapproving: "Feil ved ikke godkjenning av bruker",
        cannotUnapproveAdmin: "Kan ikke ikke godkjenne super admin",
        passwordResetSuccess: "Passord tilbakestilt vellykket",
        errorResettingPassword: "Feil ved tilbakestilling av passord",
        passwordMinLength: "Passord må være minst 6 tegn langt",
        userRoleUpdated: "Brukerrolle oppdatert vellykket",
        errorUpdatingRole: "Feil ved oppdatering av brukerrolle",
        cannotChangeAdminRole: "Kan ikke endre super admin-rolle",
        userCreated: "Bruker opprettet vellykket",
        errorCreatingUser: "Feil ved opprettelse av bruker",
        postUpdated: "Innlegg oppdatert vellykket",
        errorUpdatingPost: "Feil ved oppdatering av innlegg",
        commentUpdated: "Kommentar oppdatert vellykket",
        errorUpdatingComment: "Feil ved oppdatering av kommentar",
        commentMustContain: "Kommentarer må inneholde enten tekst eller en GIF",
        postNotFound: "Innlegg ikke funnet",
        commentNotFound: "Kommentar ikke funnet",
        notPermitted: "Du har ikke tillatelse til å utføre denne handlingen",
        errorApprovingUser: "Feil ved godkjenning av bruker",
        deleteUserConfirmation: "Er du sikker på at du vil slette denne brukeren?",
        deletePostConfirmation: "Er du sikker på at du vil slette dette innlegget? Denne handlingen kan ikke angres.",
        
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
        profilePictureSuccess: "Profilbilde oppdatert vellykket",
        
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
        deletePost: "Slett innlegg",
        search: "Søk",
        searchPlaceholder: "Søk etter brukernavn, visningsnavn eller rolle...",
        searchComments: "Søk i kommentarer...",
        searchContent: "Søk i innhold...",
        sortBy: "Sorter etter",
        ascending: "Stigende",
        descending: "Synkende",
        filterBy: "Filtrer etter",
        allUsers: "Alle brukere",
        approvedOnly: "Kun godkjente",
        pendingOnly: "Kun ventende",
        clearFilters: "Tøm filtre"
    }
};

// Set initial language from localStorage or browser default
function setLanguage(language) {
    // Default to English if no language is specified
    if (!language) {
        const savedLang = localStorage.getItem('kattapult-language');
        if (savedLang && translations[savedLang]) {
            language = savedLang;
        } else {
            // Use browser language if available and supported
            const browserLang = navigator.language.split('-')[0];
            language = translations[browserLang] ? browserLang : 'en';
        }
    }
    
    // Save to localStorage
    localStorage.setItem('kattapult-language', language);
    document.documentElement.lang = language;
    
    // Update active class on language switcher
    document.querySelectorAll('.language-option').forEach(option => {
        if (option.getAttribute('data-lang') === language) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Translate the page
    translatePage();
}

// Translate all elements with data-i18n attribute
function translatePage() {
    const currentLang = localStorage.getItem('kattapult-language') || 'en';
    const dictionary = translations[currentLang] || translations.en;
    
    // Translate text content
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (dictionary[key]) {
            element.textContent = dictionary[key];
        }
    });
    
    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (dictionary[key]) {
            element.setAttribute('placeholder', dictionary[key]);
        }
    });
}

// Helper function to get translation for a specific key
function translate(key) {
    const currentLang = localStorage.getItem('kattapult-language') || 'en';
    const dictionary = translations[currentLang] || translations.en;
    return dictionary[key] || key;
}

// Initialize language switcher
document.addEventListener('DOMContentLoaded', function() {
    // Set the initial language
    setLanguage();
    
    // Add event listeners to language switcher
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
}); 