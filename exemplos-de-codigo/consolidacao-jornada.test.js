
const assert = require('node:assert/strict');
const test = require('node:test');

const {
  consolidarJornadaExemplo
} = require('./consolidacao-jornada.exemplo.js');

function marcar(tipo, hora) {
  return {
    tipo,
    instanteMs: Date.parse(`2026-11-17T${hora}:00-03:00`)
  };
}

test('Jornada completa sem intervalo', () => {
  const resultado = consolidarJornadaExemplo([
    marcar('entrada', '08:00'),
    marcar('saida', '17:00')
  ]);

  assert.equal(resultado.status, 'concluida');
  assert.deepEqual(resultado.divergencias, []);
});

test('Jornada completa com intervalo', () => {
  const resultado = consolidarJornadaExemplo([
    marcar('entrada', '08:00'),
    marcar('inicio_intervalo', '12:00'),
    marcar('fim_intervalo', '13:00'),
    marcar('saida', '17:00')
  ]);

  assert.equal(resultado.status, 'concluida');
  assert.equal(resultado.totalMarcacoes, 4);
});

test('Identifica saída sem entrada', () => {
  const resultado = consolidarJornadaExemplo([
    marcar('saida', '17:00')
  ]);

  assert.equal(resultado.status, 'divergente');
  assert.ok(resultado.divergencias.includes('saida_sem_entrada'));
});

test('Identifica entrada duplicada', () => {
  const resultado = consolidarJornadaExemplo([
    marcar('entrada', '08:00'),
    marcar('entrada', '08:05')
  ]);

  assert.equal(resultado.status, 'divergente');
  assert.ok(resultado.divergencias.includes('entrada_duplicado'));
});

test('Reconhece jornada em andamento', () => {
  const resultado = consolidarJornadaExemplo([
    marcar('entrada', '08:00')
  ]);

  assert.equal(resultado.status, 'em_andamento');
  assert.deepEqual(resultado.divergencias, []);
});
