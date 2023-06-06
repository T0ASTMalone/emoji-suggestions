const ALPHABET_LEN = 26;

type Node = {
  children: (Node | null)[];
  emoji?: string;
  isEndOfWOrd: boolean;
}

export default class Trie {
  private head: Node | null;

  constructor() {
    this.head= { 
      children: new Array(ALPHABET_LEN).fill(null),
      isEndOfWOrd: false,
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
          children: new Array(ALPHABET_LEN).fill(null), 
          isEndOfWOrd: false,
        } as Node;

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

  find(partial: string): string[] {
    let curr = this.head;
   
    for (let i = 0; i < partial.length; ++i) {
      const index = this.getIndex(partial[i]);
      if (!curr?.children[index]) {
        return [];
      } 

      curr = curr.children[index];
    }
    let words = [];
    // current is the last node in the prefix
    if (curr?.isEndOfWOrd && curr?.emoji) {
      words.push(curr.emoji);
    }
    
    // travers down the tree collecting all letters and adding them to the 
    // prefix
    words = words.concat(this.findWords(curr));

    return words;
  }

  private isEmpty(node: Node): boolean {
    return node?.children?.every(c => c === null);
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
        node = null;
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
      node = null;
    }

    return node;
  }

  private getIndex(char: string) {
    return char.charCodeAt(0) - 'a'.charCodeAt(0);
  }


  private findWords(curr: Node | null) : string[] {
    // base case
    let out: string[] = [];

    if (!curr) {
      return out;
    }

    // recurse 
    // recurse over children
    for (let i = 0; i < curr?.children.length; ++i) {
      const node = curr.children[i];
      if (node) {
        // pre 
        // const char = String.fromCharCode('a'.charCodeAt(0) + i);
        if (node.isEndOfWOrd && node.emoji) {
          out.push(node.emoji);
        }

        // concat returns a copy of the array but does not mutate
        out = out.concat(this.findWords(node));
      }
    }

    return out;
  }
}