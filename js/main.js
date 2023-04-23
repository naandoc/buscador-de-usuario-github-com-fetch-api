(function () {
    const btnSearch = document.querySelector("button");

    const searchUser = async e => {
        e.preventDefault();
        const inputSearch = document.querySelector(".search");

        clearDisplay();

        try {
            const user = inputSearch.value;
            const url = `https://api.github.com/users/${user}`;

            const res = await fetch(url);
            const data = await res.json();
            console.log(data);

            // fetch nos repositórios do usuário
            const repos = await data.repos_url;
            const reposFetch = await fetch(repos);
            const reposJson = await reposFetch.json();

            if (res.status >= 200 && res.status < 300) {
                addElement(displayPerfil(data));
                displayBio(data);
                insertRepositorieContainer();
                // console.log(reposJson);

                const insertRepositories = reposJson.map(rep => {
                    const divRepositorie = document.querySelector(".repositories");
                    divRepositorie.appendChild(displayRepositories(rep));
                })
            } else if (res.resp !== "ok") {
                const msgError = new Error();
                const h1 = createEl("h1", "title-error");
                h1.innerHTML = `${msgError} ${res.status}!<br> Usuário não encontrado`;

                addElement(h1);
            }
        } catch (error) {
            console.log(error);
        }

    }

    const clearDisplay = () => {
        const display = document.querySelector(".content-perfil");

        if (display) display.remove();
    }

    const createEl = (elementName, myClassName) => {
        const el = document.createElement(elementName);
        el.className = myClassName;

        return el;
    }

    // cria os blocos onde serão exibidos os detalhes do perfil
    const addElement = data => {
        const contentPerfil = createEl("div", "content-perfil");
        const userContainer = createEl("div", "user-container");

        userContainer.appendChild(data);
        contentPerfil.appendChild(userContainer);

        document.querySelector(".main-container").appendChild(contentPerfil);
    }

    const displayPerfil = data => {
        const imgAndName = createEl("div", "img-and-name");

        // cria os elementos que serão inseridos no perfil, como foto, nome e email
        const imgPerfil = createEl("img", "");
        imgPerfil.setAttribute("src", data.avatar_url);
        imgPerfil.setAttribute("alt", "foto de perfil");
        imgAndName.appendChild(imgPerfil);

        const namePerfil = createEl("p", "username");
        const namePerfilLink = createEl("a", "");
        namePerfilLink.setAttribute("href", data.html_url);
        namePerfilLink.innerText = (data.name);
        namePerfil.appendChild(namePerfilLink);
        imgAndName.appendChild(namePerfil);

        const locationPerfil = createEl("p", "location");
        locationPerfil.innerText = data.location;
        imgAndName.appendChild(locationPerfil);

        return imgAndName;
    }

    const displayBio = data => {
        const bioDiv = createEl("div", "bio");
        const textBio = createEl("p", "");
        textBio.innerText = data.bio;
        bioDiv.appendChild(textBio);

        const userContainer = document.querySelector(".user-container");
        userContainer.appendChild(bioDiv);
    }

    const createRepositorieContainer = () => {
        const divRepositorie = createEl("div", "repositories-container");
        const h2Repositories = createEl("h2", "");
        h2Repositories.innerText = "Repositórios"
        divRepositorie.appendChild(h2Repositories);

        const allRepositories = createEl("div", "repositories");
        divRepositorie.appendChild(allRepositories);

        return divRepositorie;
    }

    const insertRepositorieContainer = () => {
        const fieldAddRepositories = createRepositorieContainer();
        const fieldPerfil = document.querySelector(".content-perfil");
        fieldPerfil.appendChild(fieldAddRepositories);
    }

    const displayRepositories = data => {
        const repositorie = createEl("div", "repositorie");
        const repName = createEl("p", "rep-name");
        const repNameLink = createEl("a", "");
        repNameLink.setAttribute("href", data.html_url);
        repNameLink.setAttribute("target", "_blank");
        repNameLink.innerText = data.name;
        repName.appendChild(repNameLink);
        repositorie.appendChild(repName);

        const repDesc = createEl("p", "rep-desc");
        repDesc.innerText = data.description;
        repositorie.appendChild(repDesc);

        return repositorie;
    }

    btnSearch.addEventListener("click", searchUser);

})();

