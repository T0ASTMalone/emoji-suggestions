import Trie from '../src/classes/Trie';

describe('Trie Tree', () => {
  const trie: Trie = new Trie();

  beforeAll(() => {
    // test me daddy
    trie.insert('baseball', '⚾');
    trie.insert('basketball', '🏀');
    trie.insert('basket', '🧺');
    trie.insert('ball', '🎱');
    trie.insert('ballet_shoes', '🩰');
    trie.insert('balloon', '🎈');
    trie.insert('chair', '🪑');
    trie.insert('child', '🧒');
  });

  it('searches from the middle of the word', () => {
    // test me daddy
    const expected = [['🪑', 'chair']];
    const actual = trie.find('ai');
    expect(actual).toEqual(expected);
    
    const expected2 = [['🎱', 'ball'], ['🩰', 'ballet_shoes'], ['🎈', 'balloon'], ['⚾', 'baseball'], ['🏀', 'basketball']];
    const actual2 = trie.find('ball');
    expect(actual2).toEqual(expected2);

    const expected3 = [['🩰', 'ballet_shoes']];
    const actual3 = trie.find('sho');
    expect(actual3).toEqual(expected3);

  });

  it('searches from the begining of the word', () => {
    const expected = [['🪑', 'chair'], ['🧒', 'child']];
    const actual = trie.find('ch');
    expect(actual).toEqual(expected)


    const expected2 = [['🧺', 'basket'], ['🏀', 'basketball']];
    const actual2 = trie.find('bask');
    expect(actual2).toEqual(expected2)
  });
});
