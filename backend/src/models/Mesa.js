class Mesa {
    constructor(id, eventId, number, seats) {
        this.id = id;
        this.eventId = eventId;
        this.number = number;
        this.seats = seats;
        this.pessoas = [];
    }

     addPessoa (pessoa) {

        if (this.lugaresDisponiveis() <= 0) {
            throw new Error('Não há lugares disponíveis na mesa.');
        }

        this.pessoas.push(pessoa);
    }

     removerPessoa (pessoaId) {
        this.pessoas = this.pessoas.filter(p => p.id !== pessoaId);
    }

    lugaresDisponiveis() {
        return this.seats - this.pessoas.length;
    }
}

export default Mesa;