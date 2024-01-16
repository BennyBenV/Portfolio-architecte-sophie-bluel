// URL de l'API
const apiUrl = 'http://localhost:5678/api/works';



// Sélection des filtres
const filterButtons = document.querySelectorAll('.fil');

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



// Sélection de la classe "gallery"
const galleryElement = document.querySelector('.gallery');
const galleryElement2 = document.querySelector('.gallery2');


//Récupération et affichage des images sur la page principal et sur la modal via l'API
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
                    // Récupération de imageUrl de l'API
                    image.src = item.imageUrl; 
                    // Ajout de l'ID de l'image à l'élément figure
                    image.dataset.id = item.id;



                    // Création de la div contenant l'image
                    const imageContainer = document.createElement('div');
                    imageContainer.classList.add('image-container'); 
                    imageContainer.appendChild(image);
                    imageContainer.style.display = 'flex';
                    imageContainer.style.position = 'relative';



                    // Création de l'élément figcaption 
                    const titre = document.createElement('figcaption');
                     //Récupération de title de l'API
                    titre.textContent = item.title;

                    // Ajout de la div contenant l'image à la figure
                    figure.appendChild(image.cloneNode(true));

                    // Ajout de figcaption à la figure
                    figure.appendChild(titre);

                    // Ajout de la figure sur la page principal
                    galleryElement.appendChild(figure);
                    // Ajout de la figure dans la modal
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




// Fonction pour l'ouverture de la modal
function openModal() {
    var modal = document.getElementById('modal');
    var modalImages = modal.getElementsByTagName('img');
    var imageContainer = document.getElementsByClassName('image-container');


    // Parcours de toutes les images dans la modal 
    for (var i = 0; i < modalImages.length; i++) {
        modalImages[i].style.maxWidth = "30%";
        if (imageContainer[i]) {

            imageContainer[i].style.maxWidth = "20%"

        }


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



        //Fonction pour supprimer une image au clic de l'icône de corbeille
        trashIcon.addEventListener('click', function () {
            var image = this.closest('.image-container').querySelector('img');
            if (image) {
                var imageId = image.dataset.id; 

                // Appel de la fonction pour supprimer l'image par son ID
                deleteImage(imageId);

                // Suppression de l'image de la modal
                image.closest('.image-container').remove();

                //Met à jour la liste des images
                refreshGalleryElement()

            }
        });


        // Ajout du conteneur avec l'icône à l'image
        modalImages[i].parentNode.appendChild(trashIcon);

        modalImages[i].style.display = 'flex';

        // Sélection des images de galleryElement2
        const gallery2Images = document.querySelectorAll('.gallery2 .image-container img');

        // Appliquer le style uniquement aux images de galleryElement2
        gallery2Images.forEach(img => {
            img.style.maxWidth = '100%';
        });



    }


    galleryElement2.style.gap = "1rem";
    galleryElement2.style.display = "flex";
    galleryElement2.style.flexWrap = "wrap";
    galleryElement2.style.marginTop = "2rem";

    modal.style.overflowY = "auto"; // Ajoute le scroll
    modal.style.display = 'block';


}

// Fonction pour fermer la modale
function closeModal() {
    var modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Ouvre la modale au clic du bouton "modifier" sur la page principal
var ouvrirModal = document.getElementById('ouvrirModal');
ouvrirModal.addEventListener('click', openModal);

// Fermeture de la modal au clic de la croix
var fermerModal = document.querySelector('.fermer');
fermerModal.addEventListener('click', closeModal);


// Ferme la modale quand on clique en dehors de celle-ci
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


// Fonction pour supprimer l'image
async function deleteImage(id) {
    var deleteApiUrl = apiUrl + '/' + id;

    try {
        const response = await fetch(deleteApiUrl, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ` + localStorage.getItem('token'),
            },

        });

        if (response.ok) {
            console.log('Image supprimée avec succès.');



        } else {
            throw new Error('La suppression a échoué');
        }
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la suppression :', error);
    }


}


var contenu = document.getElementById("contenu");
var ajoutImage = document.getElementById("ajoutImage");
var retour = document.getElementById("flecheGauche");

var addButton = document.getElementById('addButton');
// Foncton pour passer de la page pour supprimer une image à la page pour ajouter une image dans la modale
addButton.onclick = function () {

    contenu.style.display = "none";
    ajoutImage.style.display = "flex";
    ajoutImage.style.height = "auto"
    retour.style.display = "initial"


}

//Fonction pour le retour en arrière sur la modal
retour.onclick = function () {
    retour.style.display = "none";
    ajoutImage.style.display = "none";
    contenu.style.display = "flex";
}


const formAjoutImage = document.getElementById('formAjoutImage');
const submitImage = document.getElementById('submitImage');

// Activation / désactivation du boutton, si le formulaire n'est pas rempli il est désactivé sinon, il est ativé
formAjoutImage.addEventListener('input', function () {
    if (submitImage.disabled != !formAjoutImage.checkValidity()) {
        submitImage.style.backgroundColor = "#A7A7A7";
        submitImage.style.color = "white";
    } else {
        submitImage.style.backgroundColor = "#1D6154";
        submitImage.style.color = "white";
    }


});

const imageUrl = document.getElementById('imageUrl');
const cadreAjout = document.getElementById('cadreAjout');

// Fonction pour la prévisualisation de l'image dans le cadre, quand on ajoute une image, l'image sélectionné est affiché et les autres éléments ne sont pas affichés
imageUrl.addEventListener('change', function () {
    if (imageUrl.files && imageUrl.files[0]) {

        const imgElement = document.createElement('img');
        imgElement.src = URL.createObjectURL(imageUrl.files[0]);
        imgElement.alt = "Prévisualisation de l'image";
        imgElement.style.maxWidth = "30%";
        imgElement.id = "previsualisation";

        cadreAjout.appendChild(imgElement);

        var descriptionCadreAjout = document.getElementById("descriptionCadreAjout");
        var logoImage = document.getElementById("logo-image");
        var addPhotoDescription = document.getElementById("addPhotoDescription");
        var addImageLabel = document.getElementById("addImageLabel");
        descriptionCadreAjout.style.display = "none";
        logoImage.style.display = "none";
        addPhotoDescription.style.display = "none";
        addImageLabel.style.display = "none";

    }
});


let btnAjoutProjet = document.getElementById("submitImage");


// Envoie du formulaire et ajout de l'image dynamiquement à la page principal
btnAjoutProjet.addEventListener('click', async function (event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const categoryId = document.getElementById('categoryId').value;


    // Récupérer le fichier image depuis l'input file
    const image = imageUrl.files[0];

    try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", categoryId);
        formData.append("image", image);

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ` + localStorage.getItem('token'),
            },
            body: formData,
        });

        if (response.status === 201) {
            console.log("Projet ajouté avec succès");
            // Récupérer l'URL de l'image à partir des données de réponse
            const responseData = await response.json();
            const imageUrl = responseData.imageUrl;

            // Créer un nouvel élément figure
            const figure = document.createElement('figure');

            // Créer un nouvel élément img et attribuer l'URL de l'image
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;

            // Créer un nouvel élément figcaption pour le titre de l'image
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = title;

            // Ajouter l'img et le figcaption à l'élément figure
            figure.appendChild(imgElement);
            figure.appendChild(figcaption);

            // Ajouter l'élément figure à galleryElement
            galleryElement.appendChild(figure);

            var previsualisation = document.getElementById("previsualisation");
            var descriptionCadreAjout = document.getElementById("descriptionCadreAjout");
            var logoImage = document.getElementById("logo-image");
            var addPhotoDescription = document.getElementById("addPhotoDescription");
            var addImageLabel = document.getElementById("addImageLabel");
            previsualisation.remove();
            descriptionCadreAjout.style.display = "initial";
            logoImage.style.display = "initial";
            addPhotoDescription.style.display = "initial";
            addImageLabel.style.display = "flex";

            console.log(previsualisation);


        } else if (response.status === 400) {
            alert("Merci de remplir tous les champs");
        } else if (response.status === 500) {
            alert("Erreur serveur");
        }
    }

    catch (error) {
        console.log(error);
    }
})

// Rafraichit la liste des images 
function refreshGalleryElement() {
    // Vide le contenu de galleryElement
    galleryElement.innerHTML = '';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('La requête a échoué');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                const figure = document.createElement('figure');

                const image = document.createElement('img');
                image.src = item.imageUrl;
                image.dataset.id = item.id;

                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');
                imageContainer.appendChild(image);
                imageContainer.style.display = 'flex';
                imageContainer.style.position = 'relative';

                const titre = document.createElement('figcaption');
                titre.textContent = item.title;

                figure.appendChild(image.cloneNode(true));
                figure.appendChild(titre);

                galleryElement.appendChild(figure);

                galleryElement2.appendChild(imageContainer.cloneNode(true)); // Utilisation de cloneNode pour créer une copie

            });
        })
        .catch(error => {
            console.error('Une erreur s\'est produite :', error);
        });
}

