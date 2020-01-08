App : https://build.phonegap.com/apps/3810081/builds

Novidades:
-Página Welcome:
	Carrossel

-Página Pokemons:
	Adicionar aos favoritos, guardado com amplify

-Página Filters:
	Na pagina Pokemons é possivel apenas procurar por nome ou tipo individualmente, nesta página pode-se procurar por nome, tipo (pode-se selecionar mais que um), lendario/mitico/pseudolendario/starters e favoritos com mais que um ao mesmo tempo (pode-se ver só os favoritos, ou procurar favoritos de um tipo, ou os lendarios com "bbb" no nome que sejam do tipo bug e/ou poison). Todos os filtros selecionados têm efeito quando premido o botao "Procurar" ao lado da pesquisa por nome.

-Página Pokemons e Filters:
	A partir de 3 caracteres tem agora autocomplete

-Página Battle: 
	Escolhe-se 2 pokemons lendários e entre 1 e 4 ataques de cada um e dá para jogar (se escolher o Cosmog por exemplo não vai conseguir pois na parte dos ataques nao aparece nenhum, já que ele não tem nenhum ataque com o accuracy e o power que são usados no jogo). Se escolher 4 ele muda sozinho de pagina, se quiser escolher menos há um botao "Finish" no final da lista. No jogo o HP dos pokemons é multiplicado por 3 para durar mais. Em vez de escolher um ataque pode-se carregar no random para escolher um aleatório. Com amplify são criadas 2 arrays: win_battles e lost_battles onde são colocados dados do jogo. Informações são apresentadas com Modals (quando ganha ou perde, quando o ataque falha - usando o accuracy - e quando se carrega no finish sem qualquer ataque). Instruções mudam no h3 com fundo cinzento fixed no topo superior esquerdo (Escolhe O Teu Pokemon/Escolhe Pokemon Inimigo/...)

-Página Stats:
	Com os dados anteriormente recolhidos aparecem 3 informações nessa página: Com google charts aparece a percentagem de vitorias e derrotas num piechart, é apresentado o pokemon que o jogador escolhe mais vezes para si e o pokemon que ganha mais jogos ( como do utilizador ou inimigo )

-Todas as páginas: 
	Navbar 
	Tudo funcional na app