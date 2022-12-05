window.onload = function() {
    var button = document.getElementById("buttonAjax");
    button.disabled = true;
    button.innerText = "Cargando...";
    cabecera();
    
    button.onclick = () => {
        let div = document.getElementById("perros");
        div.innerHTML = "";
        var select = document.getElementById("raza");
        var raza = select.options[select.selectedIndex].value;
        peticion(token, page, raza);
    };
    window.addEventListener('scroll', () => {
        if (
            window.scrollY - 400 + window.innerHeight >= document.body.offsetHeight - 1000
        ) {
            if (masPaginas) {
                page++;
                peticion(token, page);
            }
        }
    });
}

var token = '';
var page = 2;
var breed = '';
var masPaginas = true;
function cabecera() {
    var jdata = new Object();
    jdata.grant_type = "client_credentials";
    jdata.client_id = "TcwSrYYl9VhFboIlvAPpOcTw2s73FZs0kzVODJar1VytGL3W7R";
    jdata.client_secret = "Dsa1bacREBHc6uCfPVNMdgPgjySiyCj54bRzTrc4";
    httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", "https://api.petfinder.com/v2/oauth2/token", true);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(JSON.stringify(jdata));
    
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var respuesta = JSON.parse(httpRequest.responseText);
                console.log(respuesta.access_token);
                token = respuesta.access_token;
                var button = document.getElementById("buttonAjax");
                button.disabled = false;
                peticionRazas();
                button.innerText = "Buscar perros";
            }
        }
    }
}

function peticionRazas() {
    httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", "https://api.petfinder.com/v2/types/dog/breeds", true);
    httpRequest.setRequestHeader("Authorization", "Bearer " + token);
    httpRequest.onreadystatechange = trateRespuestaRazas;
    httpRequest.send();
}
function trateRespuestaRazas() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            var objetoXML = JSON.parse(httpRequest.responseText);
            console.log(objetoXML);
            for (raza of objetoXML.breeds) {
                var select = document.getElementById("raza");
                let option = document.createElement("option");
                option.value = raza.name;
                option.innerText = raza.name;
                select.appendChild(option);
            }
        } else if (httpRequest.status === 400 || httpRequest === 401) {
            cabecera();
        } else {
            alert("There was a problem with the request.");
        }
    }
}

function peticion(token, page, raza) {
    httpRequest = new XMLHttpRequest();
    // var s = document.getElementById("inputAjax").value;
    httpRequest.open("GET", "https://api.petfinder.com/v2/animals?type=dog&breed=" + raza + "&page=" + page, true);
    httpRequest.setRequestHeader("Authorization", "Bearer " + token);
    httpRequest.onreadystatechange = trateRespuesta;
    httpRequest.send();
}
function trateRespuesta() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            var objetoXML = JSON.parse(httpRequest.responseText);
            console.log(objetoXML);
            for (perro of objetoXML.animals) {
                var divPrincipal = document.getElementById("perros");
                let div = document.createElement("div");
                div.className = "perro";
                let img = document.createElement("img");
                img.class = "imgPerro";
                let h2 = document.createElement("h2");
                let img2 = document.createElement("img");
                img.class = "imgPerro";
                let h22 = document.createElement("h2");
                if (perro.photos.length > 0) {
                    img.src = perro.photos[0].medium;
                    img2.src = perro.photos[0].medium;
                } else {
                    img.src = "https://via.placeholder.com/300";
                    img2.src = "https://via.placeholder.com/300";
                    page++;
                    peticion(token, page)
                }
                h2.innerHTML = perro.name;
                h22.innerHTML = perro.name;
                div.appendChild(h2);
                div.appendChild(img);
                div.addEventListener("click", () => {
                    let todosDiv = document.getElementsByClassName("perro");
                    for (let i = 0; i < todosDiv.length; i++) {
                        todosDiv[i].style.opacity = "0.2";
                    }
                    divPulsado = document.createElement("div");
                    p = document.createElement("p");
                    p.innerText = 'Edad: ' + perro.age + '\nSexo: ' + perro.gender + '\nEstado: ' + perro.status + '\nTamaño: ' + perro.size + '\nRaza: ' + perro.breeds.primary + '\nEmail: ' + perro.contact.email + '\nTelefono: ' + perro.contact.phone;
                    divPulsado.appendChild(h22);
                    divPulsado.appendChild(img2);
                    divPulsado.appendChild(p);
                    divPulsado.className = "divPulsado";
                    divPulsado.style.opacity = "1";
                    divPulsado.addEventListener("click", () => {
                        let todosDiv = document.getElementsByClassName("perro");
                        for (let i = 0; i < todosDiv.length; i++) {
                            todosDiv[i].style.opacity = "1";
                        }
                        divPulsado.remove();
                    });
                    document.body.appendChild(divPulsado);
                });
                divPrincipal.appendChild(div);
            }
        } else if (httpRequest.status === 400 || httpRequest === 401) {
            cabecera();
            masPaginas = false;
        } else {
            alert("There was a problem with the request.");
        }
    }
}