import { db } from '../config/db.js';

export async function salvarMesa(mesa) {
  const [resultado] = await db.execute(
    'INSERT INTO event_tables (event_id, number, seats) VALUES (?, ?, ?)',
    [mesa.eventId, mesa.number, mesa.seats],
  );
  mesa.id = resultado.insertId;
  return mesa;
}

export async function excluirMesa(code, mesaId) {

   const [resultado] = await db.execute(
    `delete 
    from event_tables
    where id = ? 
    and 
    event_id = (select id from events where code - ? )`, [mesaId, code]
   ); 
   return resultado.affectedRows;

}