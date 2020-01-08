define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', title:'Welcome', moduleId: 'viewmodels/welcome', nav: true },
                { route: 'pokemons', title:'Pokemóns', moduleId: 'viewmodels/pokemons', nav: true },
                { route: 'pokemons(/:id)', title:'Pokemóns', moduleId: 'viewmodels/pokemons', hash: '#pokemons', nav: false },
                { route: 'pokemonDetails/:id', title: 'Pokemón Details', moduleId: 'viewmodels/pokemonDetails', hash: '#pokemonDetails', nav: false },
                { route: 'byName/:searchTerm', title:'ByName', moduleId: 'viewmodels/byName', hash: '#byName', nav: false },
                { route: 'byType/:type', title:'ByType', moduleId: 'viewmodels/byType', hash: '#byType', nav: false },
                { route: 'filters', title:'Filters', moduleId: 'viewmodels/filters', hash: '#filters', nav: true },
                { route: 'battle', title:'Battle', moduleId: 'viewmodels/battle', hash: '#battle', nav: true },
                { route: 'stats', title:'Stats', moduleId: 'viewmodels/stats', hash: '#stats', nav: true }

            ]).buildNavigationModel();
            
            return router.activate();
        },
        menu: function () {
            if ($("#navSite #items").css("display") == "none") {
                $("#navSite button").text("Close Menu");
                $("#navSite #items").css("display", "block");
            }
            else {
                $("#navSite button").text("Open Menu");
                $("#navSite #items").css("display", "none");
            }
        }
    };
});