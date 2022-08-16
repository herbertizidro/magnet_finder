document.addEventListener('DOMContentLoaded', function(){ // aguarda o documento HTML estar completamente carregado
    
    // spinner e mensagens de erro
    const spinner = '<div class="d-flex justify-content-center"><div class="spinner-border" style="color: #FF1616; width: 2rem; height: 2rem;" role="status"><span class="sr-only">Loading...</span></div></div>';
    const erro_termo_ausente = '<div class="alert rounded-0 alert-danger text-center" style="height: 33px;" role="alert">&#10060;&nbsp;&nbsp; Ops, nothing to search! Enter the name of a movie, music, software ... </div>';
    const erro_nao_encontrado = '<div class="alert rounded-0 alert-danger text-center" style="height: 33px;" role="alert">Sorry, no result found! &#128557;</div>';
    const erro_interno = '<div class="alert rounded-0 alert-danger text-center" style="height: 33px;" role="alert">&#10060;&nbsp;&nbsp; The search could not be completed, please try again later.</div>';
    
  
    const adicionarConteudoDiv = (conteudo, divEsconde, divMostra) => {  
	document.getElementById(divEsconde).style.display = 'none';
	document.getElementById(divMostra).style.display = 'block';
	document.querySelector('#' + divMostra).innerHTML = conteudo;
    }
    
    
    // aguarda um evento clique no botão "pesquisar"
    document.querySelector('#btn').addEventListener('click', function(){
        let select = document.getElementById('option');
        let select_item = select.options[select.selectedIndex].value; // opção escolhida (audio, video, games e etc)
        let select_value;
        
        // subcategorias da api - esse trecho garante uma maior quantidade de resultados
        switch (select_item) {
          case "Other":
            select_value = ["Other"]
            break
          case "Video":
            select_value = ["Movie", "Video", "TV", "Show"]
            break
          case "Audio":
            select_value = ["Music", "Audio"]
            break
          case "Applications":
            select_value = ["Application", "App", "Software"]
            break
          case "Games":
            select_value = ["Games"]
            break
          default:
            select_value = []
        }
        
        //console.log(select_value)
        
        adicionarConteudoDiv(spinner, 'erro', 'resultado-busca') // coloca o spinner bootstrap na div "resultado-busca"

        let pesquisa = document.querySelector('#termo-pesquisa').value; // pega o termo de pesquisa
        try{

            if(pesquisa.length == 0){
                adicionarConteudoDiv(erro_termo_ausente, 'resultado-busca', 'erro')
            }else{
                
                let url = `https://sumanjay.up.railway.app/torrent/?query=${pesquisa}`;
                
                fetch(url).then(res => {
                        return res.json();
                    }).then(json => {
                        try{
                            if(json.length > 0 ){
                                // cabeçalho da tabela
                                tabela = select_item == "" ? '<table class="table"><thead><tr><th scope="col"> All - ' + pesquisa.toUpperCase() + '</th></thead><tbody>' : '<table class="table"><thead><tr><th scope="col"> ' + select_item + ' - ' + pesquisa.toUpperCase() + '</th></thead><tbody>';
                                let nomeFormatado;
                                let tipoFormatado;
                                
                                if(select_value.length > 0){ // verifica se o array possui as categorias
                                    for (let j = 0; j < json.length; j++){
                                        for (let l = 0; l < select_value.length; l++){
                                            if(json[j]["type"].indexOf(String(select_value[l])) != -1){ // filtra os resultados de acordo com a categoria escolhida no select
                                                nomeFormatado = json[j]['name'].length > 70 ? json[j]['name'].substr(0, 69) + " ..." : json[j]['name']; // alguns resultados possuem o nome muito longo, estraga o layout
                                                tipoFormatado = select_item == select_value[l] ? select_item : select_item + " > " + select_value[l];
                                                tabela = tabela + '<tr><td>' + '<a href="' + json[j]['url'] +'" target="_blank">' + nomeFormatado + '</a><br> Size: ' + json[j]['size'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Seeder: ' + json[j]['seeder'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Leecher: ' + json[j]['leecher'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Type: ' + tipoFormatado + '&nbsp;&nbsp;|&nbsp;&nbsp;<br>Age: ' + json[j]['age'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Site: ' + json[j]['site'] +'&nbsp;&nbsp;|&nbsp;&nbsp;<a href="' + json[j]['magnet'] + '" target="_blank">Download</a></td></tr>'
                                            }
                                        }
                                    }
                                }else{ // não possui categorias para filtrar, então é a opção All do select
                                    for (let j = 0; j < json.length; j++){
                                        nomeFormatado = json[j]['name'].length > 70 ? json[j]['name'].substr(0, 69) + " ..." : json[j]['name'];                                     
                                        tabela = tabela + '<tr><td>' + '<a href="' + json[j]['url'] +'" target="_blank">' + nomeFormatado + '</a><br> Size: ' + json[j]['size'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Seeder: ' + json[j]['seeder'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Leecher: ' + json[j]['leecher'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Type: ' + json[j]['type'] + '&nbsp;&nbsp;|&nbsp;&nbsp;<br>Age: ' + json[j]['age'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Site: ' + json[j]['site'] +'&nbsp;&nbsp;|&nbsp;&nbsp;<a href="' + json[j]['magnet'] + '" target="_blank">Download</a></td></tr>'                                    
                                    }
                                }
                                
                                tabela = tabela + '</tbody></table>'
                                // exibe a tabela
                                adicionarConteudoDiv(tabela, 'erro', 'resultado-busca')
                    
                            }else{
                                adicionarConteudoDiv(erro_nao_encontrado, 'resultado-busca', 'erro')                         
                            }
                        }catch(e){
                            adicionarConteudoDiv(erro_interno, 'resultado-busca', 'erro')                      
						}
                    })
                }
            
        }catch(e){
            adicionarConteudoDiv(erro_interno, 'resultado-busca', 'erro')
        }
        
    })

})
