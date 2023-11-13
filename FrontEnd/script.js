// URL de l'API
const apiUrl = 'http://localhost:5678/api/works';



// Sélection de la classe "gallery"
const galleryElement = document.querySelector('.gallery');

// Sélection des filtres
const filterButtons = document.querySelectorAll('.fil');

// Fonction pour récupérer et afficher les données depuis l'API
function getDataFromAPI(categoryId, button) {
    fetch(apiUrl) //Récupération de l'API
        .then(response => {
            if (!response.ok) {
                throw new Error('La requête a échoué'); //Erreur si l'API n'a pas pu être récupéré
            }
            return response.json();
        })
        .then(data => {
            galleryElement.innerHTML = '';

            data.forEach(item => {
                // Vérifis si l'élément appartient à la catégorie sélectionnée ou si la catégorie est "tous"
                if (categoryId === 'tous' || categoryId === item.category.id.toString()) {
                    const figure = document.createElement('figure');

                    // Création de l'élément img
                    const image = document.createElement('img');
                    image.src = item.imageUrl; // Récupération de imageUrl de l'API

                    // Création de l'élément figcaption 
                    const titre = document.createElement('figcaption');
                    titre.textContent = item.title; //Récupération de title de l'API

                    // Ajout de img à la figure
                    figure.appendChild(image);

                    // Ajout de figcaption à la figure
                    figure.appendChild(titre);

                    // Ajout de la figure à "gallery"
                    galleryElement.appendChild(figure);
                }
            });


          
        })
        .catch(error => {
            console.error('Une erreur s\'est produite :', error);
        });
}

// Appel de la fonction
getDataFromAPI('tous');

//Filtres
filterButtons.forEach(function(filterButton){
    filterButton.addEventListener('click', function() {
        const categoryId = this.getAttribute('data-category-id'); //récupération de data-category-id dans le html

        console.log('Button clicked. Category ID:', categoryId);

        //Réinitialise la couleur des autres boutons 
        filterButtons.forEach(function(b) {
            b.style.backgroundColor = 'white';
            b.style.color = '#1D6154';
        })

        //A chaque clic sur le bouton, celui-ci change de couleur
        this.style.backgroundColor='#1D6154';
        this.style.color = 'white';


        // Chargement des données en fonction de la catégorie sélectionnée
        getDataFromAPI(categoryId, this);
    });
});
