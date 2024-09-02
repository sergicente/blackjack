(() => {
    "use strict";
    let deck = [];
    const btnPedir = document.querySelector("#btnPedir");
    const btnRepartir = document.querySelector("#btnRepartir");
    const btnNuevo = document.querySelector("#btnNuevo");
    const btnDetener = document.querySelector("#btnDetener");
    const divCartasJugador = document.querySelector("#jugador-cartas");
    const divCartasComputadora = document.querySelector("#computadora-cartas");
    const divFichasApostadas = document.querySelector("#fichasApostadas");
    const divFichas10 = document.querySelector("#fichas10");
    const divFichas50 = document.querySelector("#fichas50");
    const divFichas100 = document.querySelector("#fichas100");
    const divFichas500 = document.querySelector("#fichas500");
    const saldoJugador = document.querySelector("#saldoJugador");
    const apuestaJugador = document.querySelector("#apuestaJugador");
    const mensaje = document.querySelector(".mensajes");
    const moneda10 = document.querySelector("#fichas10");
    const moneda50 = document.querySelector("#fichas50");
    const moneda100 = document.querySelector("#fichas100");
    const moneda500 = document.querySelector("#fichas500");
    let cartaVolteada;

    const jugador = {
        puntos: 0,
        hayAs: 0,
        marcador: document.querySelectorAll("small")[1],
        contadorCartas: 0,
        apuesta: 0,
        saldo: 0,
        fichas10: 5,
        fichas50: 3,
        fichas100: 3,
        fichas500: 1,
        apuestaFichas10: 0,
        apuestaFichas50: 0,
        apuestaFichas100: 0,
        apuestaFichas500: 0,
    };

    const computadora = {
        puntos: 0,
        hayAs: 0,
        marcador: document.querySelectorAll("small")[0],
        contadorCartas: 0,
    };

    const crearDeck = () => {
        deck = [];
        const valores = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        const palos = ["C", "D", "H", "S"];
        let combinaciones = [];
        for (let valor of valores) {
            for (let palo of palos) {
                combinaciones.push(valor + palo);
            }
        }
        while (combinaciones.length > 0) {
            let indiceAleatorio = Math.floor(Math.random() * combinaciones.length);
            deck.push(combinaciones[indiceAleatorio]);
            combinaciones.splice(indiceAleatorio, 1);
        }
        return deck;
    };

    const pedirCarta = () => {
        const carta = deck.pop();
        return carta;
    };

    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        return isNaN(valor) ? (valor === "A" ? 11 : 10) : valor * 1;
    };

    const sumarPuntos = (carta, turno) => {
        const valorCartaActual = valorCarta(carta);
        if (valorCartaActual === 11) turno.hayAs += 1;
        turno.puntos += valorCartaActual;
        turno.contadorCartas += 1;
        while (turno.puntos > 21 && turno.hayAs > 0) {
            turno.puntos -= 10; // Ajusta el valor de un As de 11 a 1
            turno.hayAs -= 1; // Reduce el contador de Ases ajustados
        }
    };

    const mostrarCarta = (divCartas, carta) => {
        const imgCarta = document.createElement("img");
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add("carta");
        divCartas.append(imgCarta);
    };

    const mostrarCartaVolteada = (divCartas) => {
        const imgCarta = document.createElement("img");
        imgCarta.src = `assets/cartas/red_back.png`;
        imgCarta.classList.add("carta");
        divCartas.append(imgCarta);
    };

    const dibujarFicha = (div, ficha) => {
        const imgFicha = document.createElement("img");
        imgFicha.src = `assets/fichas/${ficha}.png`;
        div.append(imgFicha);
    };

    const mostrarFichasMonedero = () => {
        divFichas10.innerHTML = "";
        divFichas50.innerHTML = "";
        divFichas100.innerHTML = "";
        divFichas500.innerHTML = "";
        for (let i = 0; i < jugador.fichas10; i++) dibujarFicha(divFichas10, 10);
        for (let i = 0; i < jugador.fichas50; i++) dibujarFicha(divFichas50, 50);
        for (let i = 0; i < jugador.fichas100; i++) dibujarFicha(divFichas100, 100);
        for (let i = 0; i < jugador.fichas500; i++) dibujarFicha(divFichas500, 500);
    };

    const apostar = (monto) => {
        const fichas = {
            10: "fichas10",
            50: "fichas50",
            100: "fichas100",
            500: "fichas500",
        };
        const divFicha = {
            10: divFichas10,
            50: divFichas50,
            100: divFichas100,
            500: divFichas500,
        };
        if (jugador[fichas[monto]] > 0 && jugador.contadorCartas === 0) {
            jugador[fichas[monto]] -= 1; // Restamos una ficha del tipo seleccionado
            jugador[`apuestaFichas${monto}`] += 1;
            dibujarFicha(divFichasApostadas, monto);
            mostrarFichasMonedero();
            calcularImportes();
            btnRepartir.classList.remove("noMostrar");
            apuestaJugador.classList.remove("noMostrar");
        } else {
        }
    };

    const turnoComputadora = () => {
        mensaje.innerText = "Se queda";
        setTimeout(() => {
            divCartasComputadora.removeChild(divCartasComputadora.children[1]);
            mostrarCarta(divCartasComputadora, cartaVolteada);
            repartirCarta();
        }, 500);
        const repartirCarta = () => {
            if (computadora.puntos < 17 && computadora.contadorCartas < 5) {
                setTimeout(() => {
                    const carta = pedirCarta();
                    sumarPuntos(carta, computadora);
                    mostrarCarta(divCartasComputadora, carta);

                    repartirCarta(); // Llama recursivamente si aún se cumplen las condiciones
                }, 500);
            } else {
                setTimeout(turnoGanador, 500); // Llama a la función para determinar el ganador
            }
        };
    };

    const turnoJugador = () => {
        mensaje.innerText = "Carta";
        const carta = pedirCarta();
        sumarPuntos(carta, jugador);
        mostrarCarta(divCartasJugador, carta);
        if (jugador.puntos > 21) {
            turnoGanador();
        } else if (jugador.contadorCartas === 5 || jugador.puntos === 21) {
            turnoComputadora();
        }
    };

    const ganaJugador = () => {
        setTimeout(() => {
            jugador.apuesta *= 2;
            apuestaJugador.innerText = jugador.apuesta;
            divFichasApostadas.innerHTML += divFichasApostadas.innerHTML;
            jugador.apuestaFichas10 *= 2;
            jugador.apuestaFichas50 *= 2;
            jugador.apuestaFichas100 *= 2;
            jugador.apuestaFichas500 *= 2;
            mensaje.innerText = `Ganas`;
            btnNuevo.classList.remove("noMostrar");
        }, 0);
    };

    const ganaComputadora = () => {
        setTimeout(() => {
            jugador.apuestaFichas10 = 0;
            jugador.apuestaFichas50 = 0;
            jugador.apuestaFichas100 = 0;
            jugador.apuestaFichas500 = 0;
            mensaje.innerText = `Pierdes`;
            btnNuevo.classList.remove("noMostrar");
        }, 0);
    };

    const turnoGanador = () => {
        if (jugador.puntos > 21) {
            ganaComputadora();
        } else if (computadora.puntos > 21) {
            ganaJugador();
        } else if (jugador.puntos > computadora.puntos) {
            ganaJugador();
        } else if (jugador.puntos === computadora.puntos) {
            ganaComputadora();
        } else if (jugador.puntos < computadora.puntos) {
            ganaComputadora();
        }
        btnPedir.classList.add("noMostrar");
        btnDetener.classList.add("noMostrar");
    };

    const repartirCartas = () => {
        mensaje.innerText = "Apuestas cerradas";
        btnRepartir.classList.add("noMostrar");

        setTimeout(() => {
            let carta = pedirCarta();
            sumarPuntos(carta, jugador);
            mostrarCarta(divCartasJugador, carta);
        }, 0);

        setTimeout(() => {
            let carta = pedirCarta();
            sumarPuntos(carta, computadora);
            mostrarCarta(divCartasComputadora, carta);
        }, 500);

        setTimeout(() => {
            let carta = pedirCarta();
            sumarPuntos(carta, jugador);
            mostrarCarta(divCartasJugador, carta);
        }, 1000);

        setTimeout(() => {
            let carta = pedirCarta();
            cartaVolteada = carta;
            sumarPuntos(carta, computadora);
            mostrarCartaVolteada(divCartasComputadora);
        }, 1500);

        setTimeout(() => {
            // Comprueba si el jugador tiene 21 puntos después de repartir las cartas
            if (jugador.puntos === 21) {
                // btnPedir.classList.add('noMostrar');
                // btnDetener.classList.add('noMostrar');
                turnoComputadora();
            } else {
                btnPedir.classList.remove("noMostrar");
                btnDetener.classList.remove("noMostrar");
                mensaje.innerText = "Su turno";
            }
        }, 2000);
    };

    const nuevoJuego = () => {
        jugador.fichas10 += jugador.apuestaFichas10;
        jugador.fichas50 += jugador.apuestaFichas50;
        jugador.fichas100 += jugador.apuestaFichas100;
        jugador.fichas500 += jugador.apuestaFichas500;
        jugador.apuestaFichas10 = 0;
        jugador.apuestaFichas50 = 0;
        jugador.apuestaFichas100 = 0;
        jugador.apuestaFichas500 = 0;
        calcularImportes();
        mostrarFichasMonedero();
        divCartasJugador.innerHTML = null;
        divCartasComputadora.innerHTML = null;
        divFichasApostadas.innerHTML = null;
        crearDeck();
        jugador.contadorCartas = 0;
        computadora.contadorCartas = 0;
        jugador.hayAs = 0;
        computadora.hayAs = 0;
        jugador.puntos = 0;
        computadora.puntos = 0;
        apuestaJugador.classList.add("noMostrar");
        btnNuevo.classList.add("noMostrar");
        mensaje.innerText = `Hagan sus apuestas`;
    };

    const calcularImportes = () => {
        let saldo = 0;
        let apuesta = 0;
        saldo = saldo + jugador.fichas10 * 10;
        saldo = saldo + jugador.fichas50 * 50;
        saldo = saldo + jugador.fichas100 * 100;
        saldo = saldo + jugador.fichas500 * 500;
        apuesta = apuesta + jugador.apuestaFichas10 * 10;
        apuesta = apuesta + jugador.apuestaFichas50 * 50;
        apuesta = apuesta + jugador.apuestaFichas100 * 100;
        apuesta = apuesta + jugador.apuestaFichas500 * 500;
        jugador.saldo = saldo;
        jugador.apuesta = apuesta;
        saldoJugador.innerText = jugador.saldo;
        apuestaJugador.innerText = jugador.apuesta;
    };

    // Eventos

    btnPedir.addEventListener("click", () => {
        turnoJugador();
    });

    btnDetener.addEventListener("click", () => {
        turnoComputadora(jugador.puntos);
    });

    btnRepartir.addEventListener("click", () => {
        repartirCartas();
    });

    btnNuevo.addEventListener("click", () => {
        nuevoJuego();
    });

    moneda10.addEventListener("click", () => apostar(10));
    moneda50.addEventListener("click", () => apostar(50));
    moneda100.addEventListener("click", () => apostar(100));
    moneda500.addEventListener("click", () => apostar(500));

    nuevoJuego();
})();
