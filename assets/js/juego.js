// (() => {
"use strict";
let deck = [];
const btnPedir = document.querySelector("#btnPedir");
const btnRepartir = document.querySelector("#btnRepartir");
const btnNuevo = document.querySelector("#btnNuevo");
const btnPlantarse = document.querySelector("#btnDetener");
const btnDoblar = document.querySelector("#btnDoblar");
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
let apostando = false;

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

// Linea de sucesos

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
    apostando = true;
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
    if (jugador[fichas[monto]] > 0 && apostando) {
        jugador[fichas[monto]] -= 1; // Restamos una ficha del tipo seleccionado
        jugador[`apuestaFichas${monto}`] += 1;
        dibujarFicha(divFichasApostadas, monto);
        mostrarFichasMonedero();
        calcularImportes();
        if (jugador.contadorCartas === 0) {
            btnRepartir.classList.remove("noMostrar");
        }
        apuestaJugador.classList.remove("noMostrar");
    }
};

const repartirCartas = () => {
    apostando = false;
    mensaje.innerText = "Apuestas cerradas";
    btnRepartir.classList.add("noMostrar");

    setTimeout(() => {
        let carta = sacarCarta();
        sumarPuntos(carta, jugador);
        mostrarCarta(divCartasJugador, carta);
    }, 1000);

    setTimeout(() => {
        let carta = sacarCarta();
        sumarPuntos(carta, computadora);
        mostrarCarta(divCartasComputadora, carta);
    }, 2000);

    setTimeout(() => {
        let carta = sacarCarta();
        sumarPuntos(carta, jugador);
        mostrarCarta(divCartasJugador, carta);
    }, 3000);

    setTimeout(() => {
        let carta = sacarCarta();
        cartaVolteada = carta;
        sumarPuntos(carta, computadora);
        mostrarCartaVolteada(divCartasComputadora);
    }, 4000);

    setTimeout(() => {
        // Comprueba si el jugador tiene 21 puntos después de repartir las cartas
        if (jugador.puntos === 21) {
            plantarse();
        } else {
            btnPedir.classList.remove("noMostrar");
            if(jugador.saldo >= jugador.apuesta){
                btnDoblar.classList.remove("noMostrar");
            }
            btnPlantarse.classList.remove("noMostrar");
            mensaje.innerText = `Va con ${jugador.puntos}. ¿Cómo desea proceder?`;
        }
    }, 5000);
};

const pedirCarta = () => {
    btnDoblar.classList.add("noMostrar");
    setTimeout(() => {
        mensaje.innerText = `Carta`;
    }, 0);
    setTimeout(() => {
        const carta = sacarCarta();
        sumarPuntos(carta, jugador);
        mostrarCarta(divCartasJugador, carta);
    }, 1000);
    setTimeout(() => {
        if (jugador.puntos > 21) {
            btnPedir.classList.add("noMostrar");
            mensaje.innerText = `${jugador.puntos}. Se pasó`;
            setTimeout(() => {
                turnoGanador();
            }, 1000);
        } else if (jugador.puntos === 21) {
            btnPedir.classList.add("noMostrar");
            mensaje.innerText = `¡Blackjack!`;
            setTimeout(() => {
                plantarse();
            }, 1000);
        } else if (jugador.contadorCartas === 5) {
            btnPedir.classList.add("noMostrar");
            mensaje.innerText = `Va con ${jugador.puntos}.`;
            setTimeout(() => {
                plantarse();
            }, 1000);
        } else {
            mensaje.innerText = `Va con ${jugador.puntos}. ¿Cómo desea proceder?`;
        }
    }, 1000);
};

const doblarApuesta = () => {
    btnPlantarse.classList.add("noMostrar");
    btnPedir.classList.add("noMostrar");
    btnDoblar.classList.add("noMostrar");
    const montoParaDoblar = jugador.apuesta;
    let apuestaInicial = montoParaDoblar;

    // Simulación para verificar si es posible apostar antes de realizarla
    let fichasSimuladas = {
        500: jugador.fichas500,
        100: jugador.fichas100,
        50: jugador.fichas50,
        10: jugador.fichas10,
    };

    while (apuestaInicial >= 500 && fichasSimuladas[500] > 0) {
        fichasSimuladas[500]--;
        apuestaInicial -= 500;
    }
    while (apuestaInicial >= 100 && fichasSimuladas[100] > 0) {
        fichasSimuladas[100]--;
        apuestaInicial -= 100;
    }
    while (apuestaInicial >= 50 && fichasSimuladas[50] > 0) {
        fichasSimuladas[50]--;
        apuestaInicial -= 50;
    }
    while (apuestaInicial >= 10 && fichasSimuladas[10] > 0) {
        fichasSimuladas[10]--;
        apuestaInicial -= 10;
    }

    // Verificar si la simulación indica que es posible doblar la apuesta
    if (apuestaInicial > 0) {
        if (jugador.fichas500 > 0) {
            jugador.fichas500--;
            jugador.fichas100 += 5;
        }
        if (jugador.fichas100 > 0) {
            jugador.fichas100--;
            jugador.fichas50 += 2;
        }
        if (jugador.fichas50 > 0) {
            jugador.fichas50--;
            jugador.fichas10 += 5;
        }
    }

    // Realizar la apuesta real después de la verificación
    apostando = true;
    apuestaInicial = montoParaDoblar;

    // Apostar fichas
    while (apuestaInicial >= 500 && jugador.fichas500 > 0) {
        apostar(500);
        apuestaInicial -= 500;
    }
    while (apuestaInicial >= 100 && jugador.fichas100 > 0) {
        apostar(100);
        apuestaInicial -= 100;
    }
    while (apuestaInicial >= 50 && jugador.fichas50 > 0) {
        apostar(50);
        apuestaInicial -= 50;
    }
    while (apuestaInicial >= 10 && jugador.fichas10 > 0) {
        apostar(10);
        apuestaInicial -= 10;
    }

    setTimeout(() => {
        const carta = sacarCarta();
        sumarPuntos(carta, jugador);
        mostrarCarta(divCartasJugador, carta);
        if (jugador.puntos > 21) {
            mensaje.innerText = `${jugador.puntos}. Se pasó`;
            setTimeout(() => {
                turnoGanador();
            }, 1000);
        } else {
            plantarse();
        }
    }, 1000);
};

const plantarse = () => {
    if (!btnPedir.classList.contains("noMostrar")) {
        btnPedir.classList.add("noMostrar");
    }
    btnDoblar.classList.add("noMostrar");
    btnPlantarse.classList.add("noMostrar");
    mensaje.innerText = `Va con ${jugador.puntos}.`;
    setTimeout(() => {
        divCartasComputadora.removeChild(divCartasComputadora.children[1]);
        mostrarCarta(divCartasComputadora, cartaVolteada);
        repartirCarta();
    }, 1000);
    const repartirCarta = () => {
        if (computadora.puntos < 17 && computadora.contadorCartas < 5) {
            setTimeout(() => {
                const carta = sacarCarta();
                sumarPuntos(carta, computadora);
                mostrarCarta(divCartasComputadora, carta);

                repartirCarta(); // Llama recursivamente si aún se cumplen las condiciones
            }, 1000);
        } else {
            setTimeout(() => {
                mensaje.innerText = `Voy con ${computadora.puntos}.`;
            }, 1000);
            setTimeout(turnoGanador, 2000);
        }
    };
};

const turnoGanador = () => {
    if (jugador.puntos > 21) {
        ganaComputadora();
    } else if (computadora.puntos > 21) {
        mensaje.innerText = `Me he pasado. Usted gana.`;
        ganaJugador();
    } else if (jugador.puntos > computadora.puntos) {
        mensaje.innerText = `Usted gana.`;
        ganaJugador();
    } else if (jugador.puntos === computadora.puntos) {
        mensaje.innerText = `Empate`;
        empate();
    } else if (jugador.puntos < computadora.puntos) {
        mensaje.innerText = `Usted pierde.`;
        ganaComputadora();
    }
    btnDoblar.classList.add("noMostrar");
    btnPedir.classList.add("noMostrar");
    btnPlantarse.classList.add("noMostrar");
};

// Funciones varias

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

const sacarCarta = () => {
    const carta = deck.pop();
    return carta;
};

const ganaJugador = () => {
    jugador.apuesta *= 2;
    apuestaJugador.innerText = jugador.apuesta;
    divFichasApostadas.innerHTML += divFichasApostadas.innerHTML;
    jugador.apuestaFichas10 *= 2;
    jugador.apuestaFichas50 *= 2;
    jugador.apuestaFichas100 *= 2;
    jugador.apuestaFichas500 *= 2;
    btnNuevo.classList.remove("noMostrar");
};

const ganaComputadora = () => {
    jugador.apuestaFichas10 = 0;
    jugador.apuestaFichas50 = 0;
    jugador.apuestaFichas100 = 0;
    jugador.apuestaFichas500 = 0;
    btnNuevo.classList.remove("noMostrar");
};

const empate = () => {
    btnNuevo.classList.remove("noMostrar");
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
    pedirCarta();
});

btnPlantarse.addEventListener("click", () => {
    plantarse(jugador.puntos);
});

btnRepartir.addEventListener("click", () => {
    repartirCartas();
});

btnNuevo.addEventListener("click", () => {
    nuevoJuego();
});
btnDoblar.addEventListener("click", () => {
    doblarApuesta();
});

moneda10.addEventListener("click", () => apostar(10));
moneda50.addEventListener("click", () => apostar(50));
moneda100.addEventListener("click", () => apostar(100));
moneda500.addEventListener("click", () => apostar(500));

nuevoJuego();
// })();
