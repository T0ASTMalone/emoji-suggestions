// 26 letters in alphabet +1 for underscores
const ALPHABET_LEN = 27;
const UNDERSCORE_CODE = 26;
const UNDERSCORE = '_';
const ZERO = 'a'.charCodeAt(0);
const EMPTY_CHILD = null;

type Node = {
  children: (Node | null)[];
  parent?: Node;
  idx: number;
  emoji?: string;
  isEndOfWOrd: boolean;
}

export default class Trie {
  private head: Node | null;
  // for middle of word searches
  private letters: Map<number, Node[]>;

  constructor() {
    this.head= { 
      children: new Array(ALPHABET_LEN).fill(EMPTY_CHILD),
      isEndOfWOrd: false,
      idx: -1,
    }
    this.letters = new Map<number, Node[]>();

    for (let i = 0; i < 26; ++i) {
      this.letters.set(ZERO + i, []);
    }
  }

  insert(item: string, value: string): void {
    let curr = this.head as Node;

    for (let i = 0; i < item.length; ++i) {
      const index = this.getIndex(item[i])
      
      if (curr.children[index]) {
        curr = curr.children[index] as Node;
      } else {
        const node = { 
          children: new Array(ALPHABET_LEN).fill(EMPTY_CHILD), 
          isEndOfWOrd: false,
          // for reverse traversal
          parent: curr,
          idx: index,
        } as Node;
        this.letters.get(ZERO + index)?.push(node);
        curr.children[index] = node;
        curr = node;
      }
    }
    curr.isEndOfWOrd = true;
    curr.emoji = value
  }

  delete(item: string): void {
    this.remove(this.head, item);
  }

  findForNode(node: Node | null, partial: string) {

    let curr = node;

    for (let i = 0; i < partial.length; ++i) {
      const index = this.getIndex(partial[i]);

      if (!curr?.children[index]) {
        return [];
      } 

      curr = curr.children[index];
    }
    let words: [string, string][] = [];
    // current is the last node in the prefix
    if (curr?.isEndOfWOrd && curr?.emoji) {
      words.push([curr.emoji, partial]);
    }
    
    // travers down the tree collecting all letters and adding them to the 
    // prefix
    words = words.concat(this.findWords(curr, partial));

    return words;
  }

  

  find(partial: string): [string, string][] {
    if (partial.length < 2) {
      return [];
    }

    const words = this.findForNode(this.head, partial);

    this.findFromMiddle(partial, words);

    return words;
  }

  // find from middle of word
  private findFromMiddle(partial: string, words: [string, string][]) {
    const seen: { [key: string]: boolean } = {};
    for (let i = 0; i < words.length; ++i) {
      seen[words[i][0]] = true;
    }

    const nodes = this.letters.get(partial.charCodeAt(0));
    
    if (!nodes || !nodes.length) {
      return words;
    }
    // start at 1 to ignore first letter in letters (was already searched when 
    // we started at the head)
    for (let i = 1; i < nodes.length; ++i) {
      const found = this.findForNode(nodes[i], partial.substring(1));
      
      if (!found?.length) {
        continue;
      }

      if (nodes[i] !== this.head && nodes[i]) {
        // get the prefix to the word
        const pref = this.findPref(nodes[i]);
        // add prefix to found words 
        for (let j = 0; j < found.length; ++j) {
          if (seen[found[j][0]]) {
            continue;
          }
          seen[found[j][0]] = true;
          words.push([found[j][0], `${pref}${found[j][1]}`]);
        }
      }
    }

    return words;
  }

  private findPref(node: Node | null): string {
    if (!node) {
      return '';
    }

    if (node === this.head) {
      return '';
    }

    return this.findPref(node.parent ?? null) + this.getCharForIdx(node.idx);
  }

  private isEmpty(node: Node): boolean {
    return node?.children?.every(c => c === EMPTY_CHILD);
  }


  private remove(node: Node | null, key: string, depth = 0): Node | null {
    // base condition

    // return if node is null
    if (!node) {
      return node;
    }

    // if at the end of the word
    if (depth === key.length) {
      // set end of word to false
      if (node.isEndOfWOrd) {
        node.isEndOfWOrd = false;
      }

      // if is empty remove node
      if (this.isEmpty(node)) {
        node = EMPTY_CHILD;
      }
      
      return node;
    }


    // recurse 

    // get index for current depth
    const idx = this.getIndex(key[depth]);

    // remove child at index 
    node.children[idx] = this.remove(node.children[idx], key, depth + 1);
    
    // if node is empty and is not the end of the word
    if (this.isEmpty(node) && !node.isEndOfWOrd) {
      // remove self
      node = EMPTY_CHILD;
    }

    return node;
  }

  private getIndex(char: string) {
    const idx = char.charCodeAt(0) - ZERO;
    return idx < 0 ? UNDERSCORE_CODE : idx;
  }


  private findWords(curr: Node | null, pref: string) : [string, string][] {
    // base case
    let out: [string, string][] = [];

    if (!curr) {
      return out;
    }

    // recurse 
    // recurse over children
    for (let i = 0; i < curr?.children.length; ++i) {
      const node = curr.children[i];

      if (node) {
        // pre 
        const char = this.getCharForIdx(i);

        if (node.isEndOfWOrd && node.emoji) {
          out.push([node.emoji, `${pref}${char}`]);
        }

        out = out.concat(this.findWords(node, `${pref}${char}`));
      }
    }

    return out;
  }

  private getCharForIdx(idx: number) {
    return idx === UNDERSCORE_CODE ? UNDERSCORE : String.fromCharCode(ZERO + idx);
  }
}
