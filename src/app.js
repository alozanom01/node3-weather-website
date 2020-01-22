const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

//Path el path definitivo una vez se han unido los argumentos que se le pasan
// console.log(path.join(__dirname, '../public/'));
const app = express();
const publicDirectoryPath = path.join(__dirname, '../public');
const partialsPath = path.join(__dirname, '../templates/partials');

//Creamos una nueva ruta absoluta hacia la carpeta 'templates', donde guardamos las vistas de hbs
const viewsPath = path.join(__dirname, '../templates/views');

//Con app.set(), añadimos una opcion que nos permita implenentar hbs, que es un paquete de npm que integra express.js con el paquete handlebars. Handlebars nos permitirá crear templates dinámicos que podremos emplear las vistas de nuestra aplicación

//hbs requiere que guardemos estos templates en el directorio templates, que por defecto se llama views pero que nosotros hemos personalizado.
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Conn esta linea determinamos cuál es el directorio de recursos estáticos que vamos a sevir: public
app.use(express.static(publicDirectoryPath));

//Serviremos nuestro html a través de los archivos .hbs de este directorio, y nos desharemos de los archivos estáticos .html. Para ello, usaremos la función 'render()', y no 'send()'. Utilizamos render porque queremos dar respuesta a la petición del cliente con una vista configurada dinámicamente con hbs

//El template se escribe así: la sintaxis debe incluir como primer parámetro el nombre, sin extensión, del archivo hbs que queremos servir
//El segundo parámetro de render es un objeto con las opciones que queremos implementar en la vista
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Andrew Mead'
    })
});

app.get('/about', (req, res) => {
    res.render('about', {
        about: 'About page served from hbs file',
    })
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text',
        title: 'Help page',
        message: 'How can I help you?'
    })
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        res.send({
            error: 'You need to provide an address'
        })
    } else {
        //Es necesario establecer un objeto por defecto, aunque esté vacío, para que el servidor no se caiga si la búsqueda no devuelve resultados pero es válida
        geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
            if (error) {
                return res.send(error);
            }
            //Si la dirección
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send(error);
                }
                res.send({
                    forecast: forecastData, location,
                    address: req.query.address
                })
            })
        });

        /*   res.send({
               forecast: 'It is snowing',
               location: 'Philadelphia',
               address: req.query.address
           })*/
    }
});

app.get('/products', (req, res) => {
    //Si no gestionamos las posibles respuestas dentro de condicionales como este, node nos arrojará un error, ya que no podemos responder dos veces a una petición
    if (!req.query.search) {
        res.send({
            error: 'You must provide a search term'
        })
    } else {
        console.log(req.query);
        res.send({
            products: []
        })
    }
});

//Gestión de errores personalizando los que da por defecto Express. Esta petición debe ir al final de todas las demás. Para ello usamos el carácter 'wildcard' (*):

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Page not found.'
    })
})

app.listen(3000);
