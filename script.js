document.addEventListener('DOMContentLoaded', () => {
    const messages = {
        spinner: '<div class="d-flex justify-content-center"><div class="spinner-border text-danger" style="width: 2rem; height: 2rem;" role="status"><span class="sr-only">Loading...</span></div></div>',
        error: '<div class="alert rounded-0 alert-danger text-center" style="height: 33px;" role="alert">&#10060;&nbsp;&nbsp; Ops, nothing to search! Enter the name of a movie, music, software ... </div>',
        notFound: '<div class="alert rounded-0 alert-danger text-center" style="height: 33px;" role="alert">Sorry, no result found! &#128557;</div>',
        internalError: '<div class="alert rounded-0 alert-danger text-center" style="height: 33px;" role="alert">&#10060;&nbsp;&nbsp; The search could not be completed, please try again later.</div>'
    };

    const categoriesMap = {
        Other: ["Other"],
        Video: ["Movie", "Video", "TV", "Show"],
        Audio: ["Music", "Audio"],
        Applications: ["Application", "App", "Software"],
        Games: ["Games"]
    };

    const addContent = (content, divHide, divShow) => {
        document.getElementById(divHide).style.display = 'none';
        document.getElementById(divShow).style.display = 'block';
        document.getElementById(divShow).innerHTML = content;
    };

    document.getElementById('btn').addEventListener('click', async () => {
        const select = document.getElementById('option');
        const selectedCategory = select.value;
        const categories = categoriesMap[selectedCategory] || [];
        const searchTerm = document.getElementById('termo-pesquisa').value.trim();

        if (!searchTerm) {
            addContent(messages.error, 'resultado-busca', 'erro');
            return;
        }

        addContent(messages.spinner, 'erro', 'resultado-busca');
        const url = `https://sumanjay.up.railway.app/torrent/?query=${searchTerm}`;

        try {
            const response = await fetch(url);
            const results = await response.json();

            if (!results.length) {
                addContent(messages.notFound, 'resultado-busca', 'erro');
                return;
            }

            let table = `<table class="table"><thead><tr><th scope="col"> ${selectedCategory || 'All'} - ${searchTerm.toUpperCase()}</th></tr></thead><tbody>`;

            results.forEach(item => {
                if (categories.length === 0 || categories.some(category => item.type.includes(category))) {
                    const nameFormatted = item.name.length > 70 ? `${item.name.substr(0, 69)} ...` : item.name;
                    const typeFormatted = categories.length ? `${selectedCategory} > ${item.type}` : item.type;
                    table += `
                        <tr><td>
                            <a href="${item.url}" target="_blank">${nameFormatted}</a><br>
                            Size: ${item.size} | Seeder: ${item.seeder} | Leecher: ${item.leecher} | Type: ${typeFormatted}<br>
                            Age: ${item.age} | Site: ${item.site} |
                            <a href="${item.magnet}" target="_blank">Download</a>
                        </td></tr>`;
                }
            });

            table += '</tbody></table>';
            addContent(table, 'erro', 'resultado-busca');
        } catch (error) {
            addContent(messages.internalError, 'resultado-busca', 'erro');
        }
    });
});
