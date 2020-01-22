console.log('Client side javascript file is loaded!');
//Este archivo gestiona el lado cliente de nuestra aplicación

//La API Fetch solo opera dentro de los navegadores modernos. Esto quiere decir que su contenido no es accesible a través de los archivos del backend (los que corren Node.js)



const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');


weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = search.value;
    //Este fetch está ajustado para que en lugar de acceder a localhost (hardcoded), pueda acceder a una ruta disponible en Heroku, usando la barra '/' para designar la raíz del directorio se sirva desde donde se sirva
    fetch('/weather?address=' + location).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error;
            } else {
                messageOne.textContent = data.location;
                messageTwo.textContent = data.forecast;

            }
        }).catch((error) => {
            console.log(error);
        })
    });
});
