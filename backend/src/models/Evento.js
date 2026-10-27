import Mesa from './Mesa.js';

class Evento {
    constructor(id, nome, data, horario, local) {
        this.id = id;
        this.nome = nome;
        this.data = data;
        this.horario = horario;
        this.local = local;
        this.mesas = [];
        this.semMesa = [];
    }

    // Cria N mesas iguais: Mesa 1, Mesa 2, ... cada uma com "cadeiras" lugares
    criarMesas(quantidade, cadeiras) {
    for (let i = 0; i < quantidade; i++) {
        const maior = this.mesas.reduce((max, m) => Math.max(max, m.number), 0);
        const numero = maior + 1;
        this.mesas.push(new Mesa(null, this.id, numero, cadeiras));
    }
}

    // Acha a mesa pelo número (ou undefined se não existir)
    buscarMesa(numero) {
        return this.mesas.find(m => m.number === numero);
    }

    // Coloca uma pessoa numa mesa. A regra de lotação fica na própria Mesa
    reservar(pessoa, numeroMesa) {
        const mesa = this.buscarMesa(numeroMesa);
        if (!mesa) {
            throw new Error(`A mesa ${numeroMesa} não existe.`);
        }
        mesa.addPessoa(pessoa); // se estiver cheia, o erro vem da Mesa
    }

    // Coloca um grupo inteiro na mesma mesa: ou entram todos, ou ninguém
    reservarGrupo(pessoas, numeroMesa) {
        const mesa = this.buscarMesa(numeroMesa);
        if (!mesa) {
            throw new Error(`A mesa ${numeroMesa} não existe.`);
        }
        if (mesa.lugaresDisponiveis() < pessoas.length) {
            throw new Error(`A mesa ${numeroMesa} só tem ${mesa.lugaresDisponiveis()} lugares livres.`);
        }
        pessoas.forEach(p => mesa.addPessoa(p));
    }

    // Tira a pessoa de qualquer mesa em que ela esteja
    cancelar(pessoaId) {
        this.mesas.forEach(m => m.removerPessoa(pessoaId));
    }

    totalLugares() {
        return this.mesas.reduce((soma, m) => soma + m.seats, 0);
    }

    lugaresDisponiveis() {
        return this.mesas.reduce((soma, m) => soma + m.lugaresDisponiveis(), 0);
    }
}

export default Evento;
