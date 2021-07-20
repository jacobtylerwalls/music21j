import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const { test } = QUnit;


export default function tests() {
    test('music21.musicxml.xmlToM21 clef stored on part', assert => {
        const mxUrl = 'https://raw.githubusercontent.com/cuthbertLab/music21/master/music21/corpus/trecento/PMFC_13_19-Credo Scabroso.xml';
        const sp = new music21.musicxml.xmlToM21.ScoreParser();
        sp.scoreFromUrl(mxUrl);
        const bass = sp.stream.parts[2];
        assert.ok(bass.clef.isClassOrSubclass('BassClef'), 'clef in bass part is BassClef');
    });
}
