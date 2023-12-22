// URL de l'API
const apiUrl = 'http://localhost:5678/api/works';



// Sélection de la classe "gallery"
const galleryElement = document.querySelector('.gallery');
const galleryElement2 = document.querySelector('.gallery2');



// Sélection des filtres
const filterButtons = document.querySelectorAll('.fil');

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
            galleryElement2.innerHTML = '';

            data.forEach(item => {
                // Vérifis si l'élément appartient à la catégorie sélectionnée ou si la catégorie est "tous"
                if (categoryId === 'tous' || categoryId === item.category.id.toString()) {
                    const figure = document.createElement('figure');
                    
                    // Création de l'élément img
                    const image = document.createElement('img');
                    image.src = item.imageUrl; // Récupération de imageUrl de l'API
                    // Ajout de l'ID de l'image à l'élément figure
                    image.dataset.id = item.id;


                    // Création de la div contenant l'image
                    const imageContainer = document.createElement('div');
                    imageContainer.classList.add('image-container'); // Ajoute une classe pour le style CSS
                    imageContainer.appendChild(image);
                    imageContainer.style.display = 'flex';
                    imageContainer.style.position = 'relative';



                    // Création de l'élément figcaption 
                    const titre = document.createElement('figcaption');
                    titre.textContent = item.title; //Récupération de title de l'API

                    // Ajout de la div contenant l'image à la figure
                    figure.appendChild(image.cloneNode(true));

                    // Ajout de figcaption à la figure
                    figure.appendChild(titre);

                    // Ajout de la figure à "gallery"
                    galleryElement.appendChild(figure);
                    galleryElement2.appendChild(imageContainer.cloneNode(true)); // Utilisation de cloneNode pour créer une copie
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
filterButtons.forEach(function (filterButton) {
    filterButton.addEventListener('click', function () {
        const categoryId = this.getAttribute('data-category-id'); //récupération de data-category-id dans le html

        console.log('Button clicked. Category ID:', categoryId);

        //Réinitialise la couleur des autres boutons 
        filterButtons.forEach(function (b) {
            b.style.backgroundColor = 'white';
            b.style.color = '#1D6154';
        })

        //A chaque clic sur le bouton, celui-ci change de couleur
        this.style.backgroundColor = '#1D6154';
        this.style.color = 'white';


        // Chargement des données en fonction de la catégorie sélectionnée
        getDataFromAPI(categoryId, this);
    });
});


// document.addEventListener('DOMContentLoaded', function () {

//     let login = document.getElementById("login");

//     let formulaire = document.getElementById("form");
//     let introduction = document.getElementById("introduction");
//     let portfolio = document.getElementById("portfolio");
//     let contact = document.getElementById("contact");

//     login.addEventListener('click', function (){
//         introduction.style.display = "none";
//         portfolio.style.display = "none";
//         contact.style.display = "none";
//         formulaire.style.display = "flex"
//         formulaire.style.justifyContent = "center"

//     });

// });


// Fonction pour ouvrir la modale
function openModal() {
    var modal = document.getElementById('modal');
    var modalImages = modal.getElementsByTagName('img'); // Sélectionnez toutes les images dans la modal
    var imageContainer = document.getElementsByClassName('image-container');
    var image = modal.querySelectorAll('.image-container img');


    // Parcourez toutes les images dans la modal et définissez la largeur maximale
    for (var i = 0; i < modalImages.length; i++) {
        modalImages[i].style.maxWidth = "100%"; // Ajustez la valeur selon vos besoins
        imageContainer[i].style.maxWidth = "20%"

        // Récupération de l'ID de l'image à partir de l'attribut dataset



        // Création de l'icône de corbeille
        const trashIcon = document.createElement('i');
        trashIcon.className = 'fa-solid fa-trash-can';
        trashIcon.style.color = 'white';
        trashIcon.style.backgroundColor = 'black'
        trashIcon.style.padding = '0.2rem';
        trashIcon.style.position = 'absolute';
        trashIcon.style.top = '0.3rem';
        trashIcon.style.right = '0.3rem';
        trashIcon.style.cursor = 'pointer';
        trashIcon.style.borderRadius = '10%'



        trashIcon.addEventListener('click', function () {
            var image = this.closest('.image-container').querySelector('img');
            if (image) {
                var imageId = image.dataset.id; // Modification ici
        
                // Appel de la fonction pour supprimer l'image par son ID
                deleteImage(imageId);
        
                // Suppression de l'image de la modal
                image.closest('.image-container').remove();
            }
        });
        

        // Ajout du conteneur avec l'icône à l'image
        modalImages[i].parentNode.appendChild(trashIcon);

        modalImages[i].style.display = 'flex';


    }


    galleryElement2.style.gap = "1rem";
    galleryElement2.style.display = "flex";
    galleryElement2.style.flexWrap = "wrap";
    galleryElement2.style.marginTop = "2rem";

    modal.style.overflowY = "auto"; // Ajouter le défilement vertical




    modal.style.display = 'block';

    // var contenu = document.getElementById("contenu");
    // const addButton = document.createElement("button");
    // addButton.innerHTML = "Ajouter";
    // contenu.appendChild(addButton);

}

// Fonction pour fermer la modale
function closeModal() {
    var modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Ajouter des gestionnaires d'événements au bouton d'ouverture
var ouvrirModal = document.getElementById('ouvrirModal');
ouvrirModal.addEventListener('click', openModal);

// Ajouter un gestionnaire d'événements au bouton de fermeture
var fermerModal = document.getElementById('fermer');
fermerModal.addEventListener('click', closeModal);

// Ferme la modale quand on clique en dehors de celle-ci
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


// Fonction pour supprimer l'image
function deleteImage(id) {
    var deleteApiUrl = apiUrl + '/' + id;

    fetch(deleteApiUrl, { 
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),

         },
      
    
     })
        .then(response => {
            if (!response.ok) {
                throw new Error('La suppression a échoué');
            }
            console.log('Image supprimée avec succès.');
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la suppression :', error);
        });
}