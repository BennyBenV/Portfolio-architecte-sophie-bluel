// URL de l'API
const apiUrl = 'http://localhost:5678/api/works';

// Sélection de la classe "gallery"
const galleryElement = document.querySelector('.gallery');

// Fonction pour récupérer et afficher les données depuis l'API
function getData() {
    //Récupération de l'API
    fetch(apiUrl) 
        .then(response => {
            if (!response.ok) {
                throw new Error('La requête a échoué'); //Erreur si API non récupéré
            }
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                //Création de l'élément figure
                const figure = document.createElement('figure');

                // Création l'élément img
                const image = document.createElement('img');
                image.src = item.imageUrl; //Récupération de imageUrl qui se trouve dans l'API

                // Création l'élément figcaption pour le titre
                const titre = document.createElement('figcaption');
                titre.textContent = item.title; // //Récupération de title qui se trouve dans l'API

                // Ajout de l'élément img à figure
                figure.appendChild(image);
                // Ajout de l'élément figcaption à figure
                figure.appendChild(titre);

                // Ajout de figure à la div class="gallery"
                galleryElement.appendChild(figure);
            });
        })
        .catch(error => {
            console.error('Une erreur s\'est produite :', error);
        });
}

// Appel de la fonction
getData();
