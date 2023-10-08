// código um pouco antigo, fique a vontade para refatorar =)
document.addEventListener('DOMContentLoaded', function(){ // aguarda o documento HTML estar completamente carregado
    
    // spinner e mensagens de erro
    const spinner = '<div class="d-flex justify-content-center"><div class="spinner-border" style="color: #FF1616; width: 2rem; height: 2rem;" role="status"><span class="sr-only">Loading...</span></div></div>';
    const error = '<div class="alert rounded-0 alert-danger text-center" style="height: 33px;" role="alert">&#10060;&nbsp;&nbsp; Ops, nothing to search! Enter the name of a movie, music, software ... </div>';
    const notFoundError = '<div class="alert rounded-0 alert-danger text-center" style="height: 33px;" role="alert">Sorry, no result found! &#128557;</div>';
    const internalError = '<div class="alert rounded-0 alert-danger text-center" style="height: 33px;" role="alert">&#10060;&nbsp;&nbsp; The search could not be completed, please try again later.</div>';
    
  
    const addContent = (content, divHide, divShow) => {  
	document.getElementById(divHide).style.display = 'none';
	document.getElementById(divShow).style.display = 'block';
	document.querySelector('#' + divShow).innerHTML = content;
    }
    
    
    // aguarda um evento clique no botão "pesquisar"
    document.querySelector('#btn').addEventListener('click', function(){
        let select = document.getElementById('option');
        let select_value = select.options[select.selectedIndex].value; // opção escolhida (audio, video, games e etc)
        let categories;
        
        // subcategorias da api - esse trecho garante uma maior quantidade de resultados
        switch (select_value) {
          case "Other":
            categories = ["Other"]
            break
          case "Video":
            categories = ["Movie", "Video", "TV", "Show"]
            break
          case "Audio":
            categories = ["Music", "Audio"]
            break
          case "Applications":
            categories = ["Application", "App", "Software"]
            break
          case "Games":
            categories = ["Games"]
            break
          default:
            categories = []
        }
        
        // console.log(categories)
        
        addContent(spinner, 'erro', 'resultado-busca') // coloca o spinner bootstrap na div "resultado-busca"

        let search = document.querySelector('#termo-pesquisa').value; // pega o termo de pesquisa
        try{

            if(search.length === 0){
                addContent(error, 'resultado-busca', 'erro')
            }else{
                
                let url = `https://sumanjay.up.railway.app/torrent/?query=${search}`; // parou de funcionar
                
                fetch(url).then(res => {
                        return res.json();
                    }).then(json => {
                        try{
                            if(json.length > 0 ){
                                // cabeçalho da tabela
                                table = select_value === "" ? '<table class="table"><thead><tr><th scope="col"> All - ' + search.toUpperCase() + '</th></thead><tbody>' : '<table class="table"><thead><tr><th scope="col"> ' + select_value + ' - ' + search.toUpperCase() + '</th></thead><tbody>';
                                let nameFormatted;
                                let typeFormatted;
                                
                                if(categories.length > 0){ // verifica se o array possui as categorias
                                    for (let j = 0; j < json.length; j++){
                                        for (let l = 0; l < categories.length; l++){
                                            if(json[j]["type"].indexOf(String(categories[l])) != -1){ // filtra os resultados de acordo com a categoria escolhida no select
                                                nameFormatted = json[j]['name'].length > 70 ? json[j]['name'].substr(0, 69) + " ..." : json[j]['name']; // alguns resultados possuem o nome muito longo, estraga o layout
                                                typeFormatted = select_value === categories[l] ? select_value : select_value + " > " + categories[l];
                                                table = table + '<tr><td>' + '<a href="' + json[j]['url'] +'" target="_blank">' + nameFormatted + '</a><br> Size: ' + json[j]['size'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Seeder: ' + json[j]['seeder'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Leecher: ' + json[j]['leecher'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Type: ' + typeFormatted + '&nbsp;&nbsp;|&nbsp;&nbsp;<br>Age: ' + json[j]['age'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Site: ' + json[j]['site'] +'&nbsp;&nbsp;|&nbsp;&nbsp;<a href="' + json[j]['magnet'] + '" target="_blank">Download</a></td></tr>';
                                            }
                                        }
                                    }
                                }else{ // não possui categorias para filtrar, então é a opção All do select
                                    for (let j = 0; j < json.length; j++){
                                        nameFormatted = json[j]['name'].length > 70 ? json[j]['name'].substr(0, 69) + " ..." : json[j]['name'];                                     
                                        table = table + '<tr><td>' + '<a href="' + json[j]['url'] +'" target="_blank">' + nameFormatted + '</a><br> Size: ' + json[j]['size'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Seeder: ' + json[j]['seeder'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Leecher: ' + json[j]['leecher'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Type: ' + json[j]['type'] + '&nbsp;&nbsp;|&nbsp;&nbsp;<br>Age: ' + json[j]['age'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Site: ' + json[j]['site'] +'&nbsp;&nbsp;|&nbsp;&nbsp;<a href="' + json[j]['magnet'] + '" target="_blank">Download</a></td></tr>';                                    
                                    }
                                }
                                
                                table = table + '</tbody></table>';
                                // exibe a tabela
                                addContent(table, 'erro', 'resultado-busca');
                    
                            }else{
                                addContent(notFoundError, 'resultado-busca', 'erro');                     
                            }
                        }catch(e){
                            addContent(internalError, 'resultado-busca', 'erro');                    
			}
                    })
                }
            
        }catch(e){
            addContent(internalError, 'resultado-busca', 'erro')
        }
        
    })

})
