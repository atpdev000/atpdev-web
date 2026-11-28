import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanExtractedNames,
  parseDelimitedText,
  parsePastedParticipantText,
  pickNameFromRowCells,
} from '../fileListExtractor.ts';

const EXCEL_TSV_SAMPLE = [
  '1\tALVARADO MONTOYA, Fransua Duban',
  '2\tGUTIERREZ ANAMPA, Bruce Lee Jesus',
  '3\tJURADO MEDINA, Emely Nicole',
  '4\tSANTIBAÑEZ DIAZ, Nelson Franc',
  '5\tVARAS ATANACIO, Tatiana Lucero',
  '6\tVELASQUEZ NEYRA, Marco Antonio',
  '7\tYNCA PALOMINO, Ederson Ramiro',
  '8\tZEVALLOS SANCHEZ, Juan David',
  '9\t',
].join('\n');

const EXPECTED_ORDERED_NAMES = [
  'ALVARADO MONTOYA, Fransua Duban',
  'GUTIERREZ ANAMPA, Bruce Lee Jesus',
  'JURADO MEDINA, Emely Nicole',
  'SANTIBAÑEZ DIAZ, Nelson Franc',
  'VARAS ATANACIO, Tatiana Lucero',
  'VELASQUEZ NEYRA, Marco Antonio',
  'YNCA PALOMINO, Ederson Ramiro',
  'ZEVALLOS SANCHEZ, Juan David',
];

describe('fileListExtractor', () => {
  it('extrae exactamente los 8 nombres en orden desde texto copiado de Excel (TSV) sin romper la coma interna', () => {
    const { names, isBulkPaste } = parsePastedParticipantText(EXCEL_TSV_SAMPLE);
    assert.equal(isBulkPaste, true);
    assert.deepEqual(names, EXPECTED_ORDERED_NAMES);
  });

  it('limpia ruido típico de OCR de tabla Excel (bordes |, I, l, corchetes, fila 9 vacía y encabezado)', () => {
    const noisyOcr = [
      '| N° | APELLIDOS Y NOMBRES |',
      '| 1 | ALVARADO MONTOYA, Fransua Duban |',
      'I 2 | GUTIERREZ ANAMPA, Bruce Lee Jesus',
      '3| JURADO MEDINA, Emely Nicole',
      '[4] SANTIBAÑEZ DIAZ, Nelson Franc',
      '5 VARAS ATANACIO, Tatiana Lucero',
      'l 6 VELASQUEZ NEYRA, Marco Antonio |',
      '7. YNCA PALOMINO , Ederson Ramiro',
      '8) ZEVALLOS SANCHEZ, Juan David',
      '| 9 |',
      '____________________________',
    ].join('\n');

    assert.deepEqual(cleanExtractedNames(noisyOcr), EXPECTED_ORDERED_NAMES);
  });

  it('no parte un solo nombre en formato "APELLIDOS, Nombres" pero sí parte listas en línea separadas por comas', () => {
    assert.deepEqual(
      cleanExtractedNames('ALVARADO MONTOYA, Fransua Duban'),
      ['ALVARADO MONTOYA, Fransua Duban']
    );

    const singleName = parsePastedParticipantText('ALVARADO MONTOYA, Fransua Duban');
    assert.equal(singleName.isBulkPaste, false);
    assert.deepEqual(singleName.names, ['ALVARADO MONTOYA, Fransua Duban']);

    const singleExcelRow = parsePastedParticipantText('1\tALVARADO MONTOYA, Fransua Duban');
    assert.equal(singleExcelRow.isBulkPaste, true);
    assert.deepEqual(singleExcelRow.names, ['ALVARADO MONTOYA, Fransua Duban']);

    const inlineCommaList = parsePastedParticipantText('Carlos, Lucía, Andrés, Valeria');
    assert.equal(inlineCommaList.isBulkPaste, true);
    assert.deepEqual(inlineCommaList.names, ['Carlos', 'Lucía', 'Andrés', 'Valeria']);
  });

  it('maneja filas de Excel con columnas extra (DNI, correo, estado) o Apellidos y Nombres separados', () => {
    assert.equal(
      pickNameFromRowCells(['1', 'ALVARADO MONTOYA, Fransua Duban', '72345678', 'Presente']),
      'ALVARADO MONTOYA, Fransua Duban'
    );
    assert.equal(
      pickNameFromRowCells(['1', 'ALVARADO MONTOYA', 'Fransua Duban']),
      'ALVARADO MONTOYA, Fransua Duban'
    );
    assert.equal(
      pickNameFromRowCells(['2', 'Juan', 'Pérez', 'juan@correo.com']),
      'Juan Pérez'
    );
  });

  it('parsea CSV con comillas sin dividir "APELLIDOS, Nombres"', () => {
    const csv = [
      'Nro,"Apellidos y Nombres"',
      '1,"ALVARADO MONTOYA, Fransua Duban"',
      '2,"GUTIERREZ ANAMPA, Bruce Lee Jesus"',
    ].join('\n');

    assert.deepEqual(parseDelimitedText(csv), [
      'ALVARADO MONTOYA, Fransua Duban',
      'GUTIERREZ ANAMPA, Bruce Lee Jesus',
    ]);
  });

  it('deduplica sin perder el orden original', () => {
    const dup = [
      '1\tALVARADO MONTOYA, Fransua Duban',
      '2\tGUTIERREZ ANAMPA, Bruce Lee Jesus',
      '3\talvarado montoya, fransua duban',
    ].join('\n');

    assert.deepEqual(cleanExtractedNames(dup), [
      'ALVARADO MONTOYA, Fransua Duban',
      'GUTIERREZ ANAMPA, Bruce Lee Jesus',
    ]);
  });
});

