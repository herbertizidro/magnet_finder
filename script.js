
document.addEventListener('DOMContentLoaded', function(){
	
	// spinner e mensagens de erro
	const spinner = '<div class="d-flex justify-content-center"><div class="spinner-border" style="color: #FF1616; width: 2rem; height: 2rem;" role="status"><span class="sr-only">Loading...</span></div></div>'; // loading spinner 
	const erro_termo_ausente = '<div class="alert rounded-0 alert-danger text-center" role="alert">&#10060;&nbsp;&nbsp; Ops, nothing to search! Enter the name of a movie, music, software ... </div>'; // mensagem de erro 
	// pra quando o usuário tenta pesquisar sem inserir um termo(nome de filme, música e etc)
	const erro_nao_encontrado = '<div class="alert rounded-0 alert-danger text-center" role="alert">Sorry, no result found! &#128557;</div>';
	const erro_interno = '<div class="alert rounded-0 alert-danger text-center" role="alert">&#10060;&nbsp;&nbsp; The search could not be completed, please try again later.</div>';
	
	function mostrarEsconderDiv(id, estilo){
		document.getElementById(id).style.display = estilo; // none ou block
	}
	
	function inserirConteudoDiv(id, conteudo){
		document.querySelector(id).innerHTML = conteudo;
	}
	
	function exibeErro(erro, divEsconde, divMostra){
		mostrarEsconderDiv(divEsconde, 'none') // esconde a div
		mostrarEsconderDiv(divMostra, 'block') // mostra a div	
		inserirConteudoDiv('#erro', erro) // exibe uma mensagem de erro
	}
	
	// aguarda um evento clique no botão pesquisar
	document.querySelector('#btn').addEventListener('click', function(){
		let select = document.getElementById('option');
		let select_value = select.options[select.selectedIndex].value; // opção escolhida (audio, video, games e etc)
		
		mostrarEsconderDiv('status-busca', 'block') // mostra a div
		mostrarEsconderDiv('erro', 'none') // esconde a div	
		inserirConteudoDiv('#status-busca', spinner) // coloca o spinner bootstrap na div "status-busca"

		let pesquisa = document.querySelector('#termo-pesquisa').value; // pega o termo de pesquisa
		try{

			if(pesquisa.length == 0){ // caso clique em "pesquisar" sem ter colocado o termo antes
				exibeErro(erro_termo_ausente, 'status-busca', 'erro') // o erro que será exibido, a div que será escondida e a div que será exibida		
				
			}else{
				
				let url = `https://api.sumanjay.cf/torrent/?query=${pesquisa}`;	// url da API					
				
				fetch(url).then(res => { // faz a requisição e obtem um json
						console.log(res)
						return res.json();
					}).then(json => {
						try{ // verifica se o json tem algum conteúdo e gera a tabela(<table>)
							if(json.length > 0 ){
								// monta a tabela com os resultados da busca
								tabela = '<table class="table"><thead><tr><th scope="col">Results for: ' + pesquisa + '</th></thead><tbody>'
								for (let j = 0; j < json.length; j++){
									if(json[j]["type"].indexOf(String(select_value)) != -1){
										tabela = tabela + '<tr><td>' + '<a href="' + json[j]['url'] +'" target="_blank">' + json[j]['name'] + '</a><br> Size: ' + json[j]['size'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Seeder: ' + json[j]['seeder'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Leecher: ' + json[j]['leecher'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Type: ' + json[j]['type'] + '&nbsp;&nbsp;|&nbsp;&nbsp;<a href="' + json[j]['magnet'] + '" target="_blank">Download</a></td></tr>'
									}
								}							
								tabela = tabela + '</tbody></table>'
								// monta a tabela
								mostrarEsconderDiv('status-busca', 'block') // mostra a div que terá a lista com os resultados da pesquisa
								mostrarEsconderDiv('erro', 'none') // esconde a div	que exibe a mensagem de erro
								inserirConteudoDiv('#status-busca', tabela) // exibe os resultados
					
							}else{
								// mostra mensagem de erro pro caso da pesquisa não retornar conteúdo
								exibeErro(erro_nao_encontrado, 'status-busca', 'erro') // o erro que será exibido, a div que será escondida e a div que será exibida
							}
						}catch(e){
							// mostra mensagem de erro relacionado a algum erro interno - conexão lenta por exemplo
							exibeErro(erro_interno, 'status-busca', 'erro') // o erro que será exibido, a div que será escondida e a div que será exibida						
						}
					})
				}
			
		}catch(e){
			// mostra mensagem de erro relacionado a algum erro interno
			exibeErro(erro_interno, 'status-busca', 'erro') // o erro que será exibido, a div que será escondida e a div que será exibida
		}
		
	})

})
