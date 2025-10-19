#include <bits/stdc++.h>
using namespace std;

/*
  Structure representing a single state in the Suffix Automaton.
  Each state represents a set of substrings of the input sequence.
*/
struct State {
  int len = 0;                   // Length of the longest substring represented by this state
  int link = -1;                 // Suffix link pointing to the longest proper suffix state
  unordered_map<int, int> next;  // Transitions: character ID -> next state
};

/*
  Suffix Automaton class for efficiently computing the Longest Common Substring (LCS)
  between a reference sequence 'a' and multiple other sequences.
*/
struct SuffixAutomaton {
  vector<State> st;  // Vector storing all states
  int last = 0;      // Tracks the last added state (used during extension)

  // Constructor reserves space for efficiency and initializes the automaton
  SuffixAutomaton() {
    st.reserve(256);
    init();
  }

  // Initializes the automaton with a single state representing the empty string
  void init() {
    st.clear();
    st.push_back(State());
    st[0].link = -1;  // The initial state has no suffix link
    last = 0;
  }

  /*
    Function to add a new character (represented by an integer ID) to the automaton.
    This implements the standard online Suffix Automaton construction algorithm.
  */
  void extend(int c) {
    int cur = (int)st.size();  // Index of the new state
    st.push_back(State());
    st[cur].len = st[last].len + 1;  // Longest substring ending here is +1 from last
    int p = last;

    // Update transitions for all states that do not yet have 'c'
    while (p != -1 && !st[p].next.count(c)) {
      st[p].next[c] = cur;
      p = st[p].link;
    }

    if (p == -1) {
      // If we reached the root, link new state to root
      st[cur].link = 0;
    } else {
      int q = st[p].next[c];  // State already having transition c
      if (st[p].len + 1 == st[q].len) {
        // If q is directly reachable, link cur to q
        st[cur].link = q;
      } else {
        // Otherwise, create a clone state to maintain correct automaton properties
        st.push_back(st[q]);
        int clone = (int)st.size() - 1;
        st[clone].len = st[p].len + 1;

        // Redirect transitions pointing to q to the clone
        while (p != -1 && st[p].next[c] == q) {
          st[p].next[c] = clone;
          p = st[p].link;
        }

        // Update suffix links
        st[q].link = st[cur].link = clone;
      }
    }

    // Update the last added state
    last = cur;
  }

  /*
    Computes the length of the longest common substring between
    the reference sequence (used to build the automaton) and a given row.
    row: vector of strings representing the other sequence
    idmap: mapping of string -> unique integer ID
  */
  int longest_common_with_row(const vector<string> &row, const unordered_map<string, int> &idmap) {
    int v = 0;     // Current state in the automaton
    int l = 0;     // Current length of matching substring
    int best = 0;  // Length of longest matching substring found

    for (auto &tok : row) {
      auto it = idmap.find(tok);
      if (it == idmap.end()) {
        // If the token is not in reference sequence, reset
        v = 0;
        l = 0;
        continue;
      }

      int c = it->second;

      if (st[v].next.count(c)) {
        // If the transition exists, move to the next state
        v = st[v].next.at(c);
        l++;
      } else {
        // Follow suffix links until a transition is found or reach root
        while (v != -1 && !st[v].next.count(c)) v = st[v].link;

        if (v == -1) {
          v = 0;
          l = 0;
        } else {
          l = st[v].len + 1;
          v = st[v].next.at(c);
        }
      }

      // Update the best length found so far
      best = max(best, l);
    }

    return best;
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);

  // Read the size of the reference array 'a'
  int n;
  cin >> n;

  vector<string> a(n);
  for (int i = 0; i < n; ++i) cin >> a[i];

  // Read number of sequences (rows) to compare
  int m;
  cin >> m;

  vector<vector<string>> grid(m);
  for (int i = 0; i < m; ++i) {
    int sz;
    cin >> sz;
    grid[i].resize(sz);
    for (int j = 0; j < sz; ++j) cin >> grid[i][j];
  }

  // Assign a unique integer ID to each string in reference array 'a'
  unordered_map<string, int> idmap;
  int nextId = 1;
  for (auto &tok : a) idmap[tok] = nextId++;

  // Build Suffix Automaton on reference sequence
  SuffixAutomaton sa;
  for (auto &tok : a) sa.extend(idmap[tok]);

  // Compute LCS length for each row and store pair (LCS length, row)
  vector<pair<int, vector<string>>> rows_with_lcs;
  for (auto &row : grid) {
    int lcs_len = sa.longest_common_with_row(row, idmap);
    rows_with_lcs.push_back({lcs_len, row});
  }

  // Sort rows in descending order of LCS length
  sort(rows_with_lcs.rbegin(), rows_with_lcs.rend());

  // Output: first LCS length, then the row elements
  for (auto &p : rows_with_lcs) {
    cout << p.first << " ";
    for (size_t i = 0; i < p.second.size(); ++i) {
      if (i) cout << ' ';
      cout << p.second[i];
    }
    cout << "\n";
  }

  return 0;
}
