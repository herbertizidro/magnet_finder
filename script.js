
document.addEventListener('DOMContentLoaded', function(){
	
	document.querySelector('#btn').addEventListener('click', function(){
		let select = document.getElementById('option');
		let select_value = select.options[select.selectedIndex].value; // opção escolhida (audio, video, games e etc)

		document.getElementById('status-busca').style.display = 'block'; // mostra a div
		document.getElementById('erro').style.display = 'none'; // esconde a div
		document.querySelector('#status-busca').innerHTML = '<div class="d-flex justify-content-center"><div class="spinner-border" style="color: #FF1616; width: 2rem; height: 2rem;" role="status"><span class="sr-only">Loading...</span></div></div>'; // loading spinner
		let pesquisa = document.querySelector('#termo-pesquisa').value; // pega o termo de pesquisa
		try{

			if(pesquisa.length == 0){ // caso clique em "pesquisar" sem ter colocado o termo antes
				document.getElementById('status-busca').style.display = 'none';
				document.getElementById('erro').style.display = 'block';
				document.querySelector('#erro').innerHTML = '<div class="alert rounded-0 alert-danger text-center" role="alert">&#10060;&nbsp;&nbsp; Ops, nothing to search! Enter the name of a movie, music, software ... </div>';
			}else{
				
				let url = `https://api.sumanjay.cf/torrent/?query=${pesquisa}`;	// url da API					
				
				fetch(url).then(res => { // faz a requisição e obtem um json
						return res.json();
					}).then(json => {
						try{ // verifica se o json tem algum conteúdo e gera a tabela(<table>)
							if(json.length > 0 ){
								tabela = '<table class="table"><thead><tr><th scope="col">Results for: ' + pesquisa + '</th></thead><tbody>'
								for (let j = 0; j < json.length; j++){
									if(json[j]["type"].indexOf(String(select_value)) != -1){
										tabela = tabela + '<tr><td>' + '<a href="' + json[j]['url'] +'" target="_blank">' + json[j]['name'] + '</a><br> Size: ' + json[j]['size'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Seeder: ' + json[j]['seeder'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Leecher: ' + json[j]['leecher'] + '&nbsp;&nbsp;|&nbsp;&nbsp;Type: ' + json[j]['type'] + '&nbsp;&nbsp;|&nbsp;&nbsp;<a href="' + json[j]['magnet'] + '" target="_blank">Download</a></td></tr>'
									}
								}							
								tabela = tabela + '</tbody></table>'							
								document.getElementById('status-busca').style.display = 'block';
								document.getElementById('erro').style.display = 'none';
								document.querySelector('#status-busca').innerHTML = tabela;				
							}else{
								document.getElementById('status-busca').style.display = 'none';
								document.getElementById('erro').style.display = 'block';
								document.querySelector('#erro').innerHTML = '<div class="alert rounded-0 alert-danger text-center" role="alert">Sorry, no result found! &#128557;</div>';
							}
						}catch(e){						
							document.getElementById('status-busca').style.display = 'none';
							document.getElementById('erro').style.display = 'block';
							document.querySelector('#erro').innerHTML = '<div class="alert rounded-0 alert-danger text-center" role="alert">&#10060;&nbsp;&nbsp; The search could not be completed, please try again later.</div>';							
						}
					})
				}
			
		}catch(e){
			document.getElementById('status-busca').style.display = 'none';
			document.getElementById('erro').style.display = 'block';
			document.querySelector('#erro').innerHTML = '<div class="alert rounded-0 alert-danger text-center" role="alert">&#10060;&nbsp;&nbsp; Sorry, the search could not be completed. Internal error.</div>';
		}
		
	})

})
