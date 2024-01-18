let token;

// Fonction se connecter
function submitForm() {
    var email = document.getElementById("email-form").value;
    var password = document.getElementById("password").value;
    var messageErreur = document.getElementById("messageErreur");

    // Création des données d'authentification
    var credentials = {
        email: email,
        password: password
    };

    // Configuration de la requête pour obtenir le token
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    };

    var tokenApiUrl = 'http://localhost:5678/api/users/login';

    // Obtention du toker
    fetch(tokenApiUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Nom d\'utilisateur ou mot de passe incorrect.');
            }
            return response.json();
        })
        .then(data => {
            // Récupération du token
            var token = data.token;

            // Stockage du token dans le stockage local
            localStorage.setItem('token', token);



            // Redirection vers la page d'accueil
            window.location.href = 'index.html';

        })
        .catch(error => {   
            console.error('Erreur de connexion:', error.message);
            // Si nom d'utilisateur ou mot de passe incorrect, message d'erreur
            messageErreur.innerHTML = error.message;
            messageErreur.style.color = "red";
        });
}

// Fonction pour modifier l'affichage quand l'utilisateur est connecté
function updateLoginStatus() {
    var login = document.getElementById("login");
    var logout = document.getElementById("logout");
    var modeEdition = document.getElementById("modeEdition");
    var filtre = document.getElementById("filtre");
    var ouvrirModal = document.getElementById("ouvrirModal");


    // Si le token est bien stocké alors on modifie la page d'accueil 
    if (localStorage.getItem('token')) {
        login.style.display = "none";
        logout.style.display = "flex"
        modeEdition.style.display = "flex";
        filtre.style.display = "none";
        ouvrirModal.style.display = "flex";

    // S'il n'est pas stocké, on remet la page d'accueil de base
    } else {
        login.style.display = "flex";
        logout.style.display = "none";
        modeEdition.style.display = "none";
        filtre.style.display = "flex";
        ouvrirModal.style.display = "none";

    }
}

// Appel de la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', function () {
    updateLoginStatus();
});

// Fonction de déconnexion
function logout() {
    // Suppression du toker
    localStorage.removeItem('token');
    // MAJ de la page
    updateLoginStatus();
    alert('Déconnexion réussie!');
}
