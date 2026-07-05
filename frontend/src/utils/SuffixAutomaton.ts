export class State {
  len: number;
  link: number;
  next: Map<number, number>;
  firstEndPos: number;

  constructor() {
    this.len = 0;
    this.link = -1;
    this.next = new Map();
    this.firstEndPos = -1;
  }
}

export class SuffixAutomaton {
  st: State[];
  last: number;
  idmap: Map<string, number>;

  constructor(tokens: string[], idmap: Map<string, number>) {
    this.st = [new State()];
    this.last = 0;
    this.idmap = idmap;
    
    for (let i = 0; i < tokens.length; i++) {
      const id = idmap.get(tokens[i]);
      if (id !== undefined) {
        this.extend(id, i);
      }
    }
  }

  extend(c: number, idx: number) {
    const cur = this.st.length;
    this.st.push(new State());
    this.st[cur].len = this.st[this.last].len + 1;
    this.st[cur].firstEndPos = idx;
    let p = this.last;

    while (p !== -1 && !this.st[p].next.has(c)) {
      this.st[p].next.set(c, cur);
      p = this.st[p].link;
    }

    if (p === -1) {
      this.st[cur].link = 0;
    } else {
      const q = this.st[p].next.get(c)!;
      if (this.st[p].len + 1 === this.st[q].len) {
        this.st[cur].link = q;
      } else {
        const clone = this.st.length;
        this.st.push(new State());
        this.st[clone].len = this.st[p].len + 1;
        this.st[clone].next = new Map(this.st[q].next);
        this.st[clone].link = this.st[q].link;
        this.st[clone].firstEndPos = this.st[q].firstEndPos;

        while (p !== -1 && this.st[p].next.get(c) === q) {
          this.st[p].next.set(c, clone);
          p = this.st[p].link;
        }

        this.st[q].link = this.st[cur].link = clone;
      }
    }
    this.last = cur;
  }

  serialize(): any {
    // Serialize state array because Maps cannot be directly stringified
    const serializedSt = this.st.map(state => ({
      len: state.len,
      link: state.link,
      firstEndPos: state.firstEndPos,
      next: Array.from(state.next.entries()) // Convert Map to Array of tuples
    }));

    // We don't need to send idmap since backend only matches using integers now!
    return {
      st: serializedSt,
      last: this.last
    };
  }
}
