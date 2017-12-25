[![Build Status](https://travis-ci.org/zrrrzzt/julebitforbit.svg?branch=master)](https://travis-ci.org/zrrrzzt/julebitforbit)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![Greenkeeper badge](https://badges.greenkeeper.io/zrrrzzt/julebitforbit.svg)](https://greenkeeper.io/)

# julebitforbit

Julekonkurranse i bit for bit ånd.

Se den live på [bitforbit.allthethings.win](https://bitforbit.allthethings.win)

## Spillet

Del inn i 2 lag eller ha alle mot alle.

En runde består av at et bilde avdekkes bit for bit.
Når noen tror de vet hva bildet er så roper det navnet sitt (eller navnet på laget) og avdekkingen pauses.
Har deltageren rett så avdekkes bildet, hvis ikke så får motstanderlaget lov til å gjette.
Tar begge feil fortsetter avdekkingen.
Det er 20 runder i spillet og alle bilder er julerelatert.
Hver gang man spiller kommer bildene i ny rekkefølge, så gamemaster bør gjøre seg godt kjent med bildene på forhånd.

## Kontroller

Fra venstre til høyre:

- Fullskjerm (trykk eller bruk f på tastaturet) - veksler mellom fullskjerm modus og vanlig
- Forrige (trykk eller bruk l på tastaturet) - gå til forrige bilde (vises ikke på bilde 1)
- Reset (trykk eller bruk r på tastaturet) - gjenoppta runden fra start
- Play/Pause (trykk eller bruk p på tastaturet) - Start/pause avdekkingen av bildet
- Fast forward (trykk eller bruk s på tastaturet) - Avdekker bildet
- Neste (trykk eller bruk n på tastaturet) - Neste bilde (vises ikke på bilde 20)

## Lag din egen variant

For å sette opp din egen server med egne bilder gjør du som følger:

- Ha nyeste versjon av [Node](https://nodejs.org) installert
- Last ned eller klon dette repoet
- Gå inn i mappen
- Innstaller avhengigheter (i kommandolinjen skriv `npm install`)
- Bytt ut evt bilder i mappen (`static/images`) (støtter kun png/jpg)
- Bygg ny jsonfil (i kommandolinjen skriv `npm generate-json`)
- Bygg ny versjon av siden (i kommadolinjen skriv `npm run export`)
- Last opp innholdet i den nye mappen `out` til en server av eget hjerte
- Bruker du [ZEIT/Now](https://zeit.co/now) (i kommandolinjen skriv `now --static out/ --name julebitforbit`)


## License

[MIT](LICENSE)

![Robohash image of julebitforbit](https://robots.kebabstudios.party/julebitforbit.png "Robohash image of julebitforbit")
