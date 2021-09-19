document.addEventListener('DOMContentLoaded', function(){ // aguarda o documento HTML estar completamente carregado
	
	// spinner e mensagens de erro
	const spinner = '<div class="d-flex justify-content-center"><div class="spinner-border" style="color: #FF1616; width: 2rem; height: 2rem;" role="status"><span class="sr-only">Loading...</span></div></div>'; // loading spinner 
	const erro_termo_ausente = '<div class="alert rounded-0 alert-danger text-center" style="height: 33px;" role="alert">&#10060;&nbsp;&nbsp; Ops, nothing to search! Enter the name of a movie, music, software ... </div>'; // mensagem de erro 
	// pra quando o usuário tenta pesquisar sem inserir um termo(nome de filme, música e etc)
	const erro_nao_encontrado = '<div class="alert rounded-0 alert-danger text-center" style="height: 33px;" role="alert">Sorry, no result found! &#128557;</div>';
	const erro_interno = '<div class="alert rounded-0 alert-danger text-center" style="height: 33px;" role="alert">&#10060;&nbsp;&nbsp; The search could not be completed, please try again later.</div>';
	
	// funções pra controlar o conteúdo exibido(mensagens de erro ou resultados de pesquisa)
	function mostrarEsconderDiv(id, estilo){
		document.getElementById(id).style.display = estilo; // none ou block
	}
	
	function inserirConteudoDiv(id, conteudo){
		document.querySelector(id).innerHTML = conteudo;
	}
	
	function exibeConteudoDiv(conteudo, divEsconde, divMostra){
		mostrarEsconderDiv(divEsconde, 'none') // esconde a div
		mostrarEsconderDiv(divMostra, 'block') // mostra a div	
		inserirConteudoDiv('#' + divMostra, conteudo) // exibe o conteudo
	}
	
	// aguarda um evento clique no botão "pesquisar"
	document.querySelector('#btn').addEventListener('click', function(){
		let select = document.getElementById('option');
		let select_item = select.options[select.selectedIndex].value; // opção escolhida (audio, video, games e etc)
		let select_value;
		
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
		
		exibeConteudoDiv(spinner, 'erro', 'status-busca') // coloca o spinner bootstrap na div "status-busca"

		let pesquisa = document.querySelector('#termo-pesquisa').value; // pega o termo de pesquisa
		try{

			if(pesquisa.length == 0){ // caso clique em "pesquisar" sem ter colocado o termo antes
				exibeConteudoDiv(erro_termo_ausente, 'status-busca', 'erro') // o erro que será exibido, a div que será escondida e a div que será exibida
			}else{
				
				let url = `https://sumanjay.up.railway.app/torrent/?query=${pesquisa}`;	// url da API + o termo
				
				fetch(url).then(res => { // faz a requisição e obtem um json
						return res.json();
					}).then(json => {
						try{ // verifica se o json tem algum conteúdo e gera a tabela(<table>)
							if(json.length > 0 ){
								// monta a tabela com os resultados da busca
								if(select_item == ""){
									tabela = '<table class="table"><thead><tr><th scope="col">Results for ' + pesquisa + ' in category All:</th></thead><tbody>'
								}else{
									tabela = '<table class="table"><thead><tr><th scope="col">Results for ' + pesquisa + ' in category ' + select_item + ':</th></thead><tbody>'	
								}
								
								if(select_value.length > 0){ // verifica se o array possui as categorias
									for (let j = 0; j < json.length; j++){
										for (let l = 0; l < select_value.length; l++){
											if(json[j]["type"].indexOf(String(select_value[l])) != -1){ // filtra os resultados de acordo com a categoria escolhida no select
												let nomeFormatado = json[j]['name'].length > 70 ? json[j]['name'].substr(0, 69) + " ..." : json[j]['name']; // alguns resultados possuem o nome muito longo, estraga o layout
												tabela = tabela + '<tr><td>' + '<a href="' + json[j]['url'] +'" target="_blank">' + nomeFormatado + '</a><br> Size: ' + json[j]['size'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Seeder: ' + json[j]['seeder'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Leecher: ' + json[j]['leecher'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Type: ' + json[j]['type'] + '&nbsp;&nbsp;|&nbsp;&nbsp;<br>Age: ' + json[j]['age'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Site: ' + json[j]['site'] +'&nbsp;&nbsp;|&nbsp;&nbsp;<a href="' + json[j]['magnet'] + '" target="_blank">Download</a></td></tr>'
											}
										}
									}
								}else{ // não possui categorias para filtrar, então é a opção All do select
									for (let j = 0; j < json.length; j++){
										let nomeFormatado = json[j]['name'].length > 70 ? json[j]['name'].substr(0, 69) + " ..." : json[j]['name'];										
										tabela = tabela + '<tr><td>' + '<a href="' + json[j]['url'] +'" target="_blank">' + nomeFormatado + '</a><br> Size: ' + json[j]['size'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Seeder: ' + json[j]['seeder'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Leecher: ' + json[j]['leecher'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Type: ' + json[j]['type'] + '&nbsp;&nbsp;|&nbsp;&nbsp;<br>Age: ' + json[j]['age'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Site: ' + json[j]['site'] +'&nbsp;&nbsp;|&nbsp;&nbsp;<a href="' + json[j]['magnet'] + '" target="_blank">Download</a></td></tr>'									
									}
								}
								
								tabela = tabela + '</tbody></table>'
								// exibe a tabela
								exibeConteudoDiv(tabela, 'erro', 'status-busca')
					
							}else{
								// mostra mensagem de erro pro caso da pesquisa não retornar conteúdo
								exibeConteudoDiv(erro_nao_encontrado, 'status-busca', 'erro') // o erro que será exibido, a div que será escondida e a div que será exibida								
							}
						}catch(e){
							// mostra mensagem de erro relacionado a algum erro interno - conexão lenta por exemplo
							exibeConteudoDiv(erro_interno, 'status-busca', 'erro') // o erro que será exibido, a div que será escondida e a div que será exibida						
						}
					})
				}
			
		}catch(e){
			// mostra mensagem de erro relacionado a algum erro interno
			exibeConteudoDiv(erro_interno, 'status-busca', 'erro') // o erro que será exibido, a div que será escondida e a div que será exibida
		}
		
	})

})
