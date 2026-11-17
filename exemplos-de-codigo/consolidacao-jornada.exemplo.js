/**
 * Exemplo didático de validação de jornada — AF Ponto.
 * Independente do código operacional do aplicativo.
 * Utiliza dados fictícios e não acessa o Firebase.
 */

const EVENTOS = [
  'entrada',
  'inicio_intervalo',
  'fim_intervalo',
  'saida'
];

function consolidarJornadaExemplo(marcacoes) {
  if (!Array.isArray(marcacoes)) {
    throw new TypeError('Marcações devem ser uma lista');
  }

  const divergencias = [];
  const contagem = Object.fromEntries(
    EVENTOS.map(tipo => [tipo, 0])
  );
  const tipos = [];

  for (const marcacao of marcacoes) {
    const tipo = marcacao?.tipo;

    if (!EVENTOS.includes(tipo)) {
      divergencias.push('tipo_invalido');
      continue;
    }

    contagem[tipo]++;
    tipos.push(tipo);

    if (!Number.isFinite(marcacao.instanteMs)) {
      divergencias.push('horario_invalido');
    }
  }

  for (const tipo of EVENTOS) {
    if (contagem[tipo] > 1) {
      divergencias.push(`${tipo}_duplicado`);
    }
  }

  const sequenciasValidas = [
    ['entrada'],
    ['entrada', 'saida'],
    ['entrada', 'inicio_intervalo'],
    ['entrada', 'inicio_intervalo', 'fim_intervalo'],
    ['entrada', 'inicio_intervalo', 'fim_intervalo', 'saida']
  ];

  const sequenciaValida = sequenciasValidas.some(
    seq => seq.length === tipos.length &&
      seq.every((tipo, i) => tipo === tipos[i])
  );

  if (!sequenciaValida) {
    divergencias.push('sequencia_invalida');
  }

  if (contagem.saida > 0 && contagem.entrada === 0) {
    divergencias.push('saida_sem_entrada');
  }

  if (contagem.fim_intervalo > 0 &&
      contagem.inicio_intervalo === 0) {
    divergencias.push('fim_intervalo_sem_inicio');
  }

  return {
    status: divergencias.length
      ? 'divergente'
      : contagem.saida
        ? 'concluida'
        : 'em_andamento',
    divergencias: [...new Set(divergencias)],
    totalMarcacoes: marcacoes.length
  };
}

module.exports = { consolidarJornadaExemplo };
