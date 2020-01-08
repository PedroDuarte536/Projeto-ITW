define(['durandal/app'], function (app) {
    var page = function () {
        this.features = [{title: "Pesquisa Pokemons", content: ['Por Nome','Por Tipo'], ex: "#pokemons"},
                         {title: "Detalhes Pokemons", content: ['Evoluções','Várias Imagens'], ex: "#pokemonDetails/25"},
                         {title: "Filtros Combinados", content: ['Favoritos','Vários Tipos'], ex: "#filters"},
                         {title: "Batalha", content: ['Moves do Pokemon','Modals'], ex: "#battle"},
                         {title: "Estatística", content: ['Mais Usado','Mais Vitórias'], ex: "#stats"}];
    };

    return page;
});