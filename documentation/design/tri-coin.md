# Tri-Coin Hold'em — Design Doc

## Pitch

Texas Hold'em with three currencies, each with its own pot and its own way to win. You can fight for some pots and give up others in the same hand. Your final score is your smallest stack, so specialising in one currency loses.

The design goal: turn every hand from "is my hand good?" into "which pots is my hand good for, and what does my betting tell the table?"

## Core rules (draft v0)

Standard Hold'em deal and streets: two hole cards, flop, turn, river, four betting rounds.

Setup: each player starts with 100 Gold, 100 Silver and 100 Copper. Blinds are paid in Copper.

### Three pots, three win conditions

| Pot    | Won by                          | Notes                                                    |
| ------ | ------------------------------- | -------------------------------------------------------- |
| Gold   | Best high hand                  | Normal Hold'em ranking                                   |
| Silver | Best hand using both hole cards | You can't play the board                                 |
| Copper | Lowest hand                     | Ace-to-five; straights and flushes ignored; no qualifier |

### Betting

- Any bet or raise names a currency. To stay in a pot, you match the current bet in that currency.
- You may drop out of one pot and stay in the others ("out of Gold, still in Copper"). Chips already in a pot you leave are forfeited.
- Folding everything ends your hand.
- A pot with one player left goes to that player at once.

**Scoring:** after the agreed number of hands, your score is your smallest stack. 400 Gold / 20 Silver / 90 Copper scores 20.

**Exchange:** between hands, trade with other players at any agreed rate, or with the bank at 2:1 against you.

**Running out:** a player at 0 in a currency can't contest that pot but stays in the game. Their score is 0 until they trade back in.

## Open questions

### Betting mechanics

- [ ] Can one bet span currencies ("10 Gold and 5 Copper"), or is it one currency per action? Mixed bets are expressive but slow.
- [ ] Does a raise in one currency reopen action in the others?
- [ ] Is it too easy to stay in all three pots cheaply? Consider a minimum entry per pot on the flop.
- [ ] Should blinds rotate currency by hand so Copper doesn't drain fastest?
- [ ] Table-stakes rule: can you go all-in in Silver while keeping Gold and Copper behind?

### Win conditions

- [ ] Is Silver (both hole cards) distinct enough from Gold? It often picks the same winner. Alternatives: best pair or better from hole cards only, or "closest to exactly two pair".
- [ ] Copper needs a tiebreak rule; lows split often.
- [ ] Can one player scoop all three pots? It's possible (e.g. A-2 on a low board). Is that fine, or should a scoop pay a tax?

### Scoring and economy

- [ ] Min-stack scoring may make players too timid. Does it need a tiebreak (second-smallest stack)?
- [ ] Is the 2:1 bank rate right? Too harsh and trading dies; too soft and the currencies blur into one.
- [ ] Game length: a fixed number of hands, a timer, or play until someone hits 0 in everything?
- [ ] Should player-to-player trades be binding, and can they include promises ("I'll stay out of Copper next hand")?

### Practical

- [ ] Bookkeeping: three pots and per-pot participation is a lot to track at a real table. Test with pot mats and a marker per player per pot.
- [ ] Ideal player count? Guess: 4–6. More players means more split pots.
- [ ] Is this fun enough for new players, or strictly for people who already know Hold'em?

## Alternative variants

Other ways to use three currencies, roughly from closest to normal poker to furthest away. Several can be combined with the core rules.

1. **Street currencies.** Each street has a set currency: preflop in Copper, flop in Silver, turn and river in Gold. Seeing flops is cheap and the river is expensive, so your stack mix decides how far you can chase. Someone low on Gold can't call big river bets.
2. **Power currencies.** Only Gold is bet into the pot. Silver is Sight: spend it to privately peek at the next community card. Copper is Swap: spend it to discard a hole card and draw a new one before the flop. The game becomes about when to buy information versus when to buy luck.
3. **Scarcity market.** All three currencies are bet the same way, but final values aren't fixed. At the end, the currency with the least in circulation is worth 3 points per chip, the middle one 2, the most common 1. Hoarding a currency makes it worth more, so players quietly fight over the market as well as the pots.
4. **Home currencies.** Each player starts with a lot of just one currency, their "nation". Scoring is min-stack, so everyone has to win or trade for the other two. It's the most negotiation-heavy version and plays more like a trading game with poker in the middle.
5. **Reputation.** Gold and Silver are ordinary chips. The third currency is Reputation, which can't be traded. You lose it when you raise and then fold, and gain it when you win a showdown after raising. Bets above a certain size require spending Reputation, so constant bluffers get priced out of big pots.
6. **Debt.** The third currency is IOUs. When you're short, you can bet IOUs you don't have; whoever wins that pot collects the debt from you. Unpaid debt at the end counts double against you. It creates desperate, swingy late games.
7. **Suit-linked pots.** Each currency is tied to suits (e.g. Gold = hearts, Silver = spades, Copper = clubs; diamonds are wild). A pot goes to the best hand using at least two cards of its suit. Flush draws matter in a completely different way, and the board's suit spread decides which pots are worth fighting over.

Good combinations to test first: core rules + Street currencies (adds pacing), or Power currencies + Scarcity market (the most different from normal poker).

## Other table spicers

Non-currency ideas for livening up a Hold'em table, from light tweaks to full rule changes. Easiest first try: bomb pots plus double board, which need almost no explanation.

### Small tweaks for any home game

- **Bomb pots:** every few hands, everyone antes a fixed amount and play starts at the flop with no preflop betting.
- **Double board:** deal two sets of community cards; the best hand on each board wins half the pot.
- **7-2 bounty:** win with 7-2 offsuit and show it, and every player pays you a bounty.
- **Run it twice:** when players are all-in, deal the remaining cards twice and split the pot.

### Event cards

- **Event deck:** before each flop, flip a card that changes that hand only. Examples: Reverse (lowest hand wins), Wild Deuces, Blackout (turn dealt face down until showdown), Tax (winner pays 10% to the shortest stack).
- **Player-held events:** each player gets one or two single-use cards per session: Peek at the next community card, Swap a hole card, Veto the river and redeal it.

### Information twists

- **Show one:** after the flop, every player still in turns one hole card face up.
- **Pineapple:** deal three hole cards; discard one after the flop.
- **Secret bets:** once per session, place a sealed bet on which player wins a hand, revealed at showdown.

### Structural changes

- **Bounty tournament:** every player carries a bounty chip; knocking them out wins it.
- **Roles:** secretly deal one "Dealer's Friend" per session, who scores extra if a specific opponent busts first.
- **Auctions:** before the flop, auction the right to see the first community card early, or to act last.

### Social flavor

- **Tell tokens:** correctly call out a bluff before showdown to earn a token, tradeable later for a free peek.
- **House rule of the night:** the winner of the first hand sets one custom rule for the session.
