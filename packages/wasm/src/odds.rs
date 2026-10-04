//! Exact odds and hand type percentages, over every way to complete the board.

use crate::card::{Card, CardSet};
use crate::error::Error;
use crate::rank::{HandType, rank_of};

/// Calls `visit` with every way to complete `known` with `missing` of the
/// `rest` cards. No boards are built: the set is passed down as a number while
/// the cards are chosen one by one, so a card shared by many boards is added
/// only once.
fn for_each_board(known: CardSet, rest: &[Card], missing: usize, mut visit: impl FnMut(CardSet)) {
    fn complete(set: CardSet, rest: &[CardSet], missing: usize, visit: &mut impl FnMut(CardSet)) {
        if missing == 0 {
            visit(set);
            return;
        }
        for i in 0..=rest.len() - missing {
            complete(set | rest[i], &rest[i + 1..], missing - 1, visit);
        }
    }

    let rest: Vec<CardSet> = rest.iter().map(|&card| card.into()).collect();
    complete(known, &rest, missing, &mut visit);
}

fn check_board(board: &[Card]) -> Result<(), Error> {
    if board.len() > 5 {
        return Err(Error::BoardSize(board.len()));
    }
    Ok(())
}

fn check_hole(index: usize, hole: &[Card]) -> Result<(), Error> {
    if hole.len() != 2 {
        return Err(Error::HoleSize {
            hole: index,
            cards: hole.len(),
        });
    }
    Ok(())
}

/// How often one hole wins or ties
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub struct HoleTally {
    /// Boards on which this hole alone has the best hand
    pub wins: u32,
    /// Boards on which this hole shares the best hand with others
    pub ties: u32,
}

/// The result of [`odds`]: one tally per hole, in the order of the holes
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Odds {
    pub holes: Vec<HoleTally>,
    /// The number of ways to complete the board
    pub boards: u32,
}

impl Odds {
    pub fn win_chance(&self, hole: usize) -> f64 {
        self.holes[hole].wins as f64 / self.boards as f64
    }

    pub fn tie_chance(&self, hole: usize) -> f64 {
        self.holes[hole].ties as f64 / self.boards as f64
    }
}

/// Counts, for every way to complete the board, which holes win or tie.
///
/// Every hole needs exactly two cards, the board can have up to five, and
/// no card may appear twice.
pub fn odds(holes: &[Vec<Card>], board: &[Card]) -> Result<Odds, Error> {
    if holes.is_empty() {
        return Err(Error::NoHoles);
    }
    holes
        .iter()
        .enumerate()
        .try_for_each(|(i, hole)| check_hole(i, hole))?;
    check_board(board)?;
    let board_set = CardSet::of(board)?;
    let hole_sets: Vec<CardSet> = holes
        .iter()
        .map(|hole| CardSet::of(hole))
        .collect::<Result<_, _>>()?;
    let used = holes
        .iter()
        .flatten()
        .try_fold(board_set, |set, &card| set.with(card))?;

    let mut tally = vec![HoleTally::default(); holes.len()];
    let mut ranks = vec![0; holes.len()];
    let mut boards = 0;
    for_each_board(board_set, &used.remaining(), 5 - board.len(), |board| {
        let mut best = 0;
        let mut winners = 0;
        let mut winner = 0;
        for (i, &hole) in hole_sets.iter().enumerate() {
            let rank = rank_of(board | hole);
            ranks[i] = rank;
            if rank > best {
                best = rank;
                winners = 1;
                winner = i;
            } else if rank == best {
                winners += 1;
            }
        }
        // a single winner gets a win, otherwise each tied hole gets a tie
        if winners == 1 {
            tally[winner].wins += 1;
        } else {
            for (hole, &rank) in tally.iter_mut().zip(&ranks) {
                if rank == best {
                    hole.ties += 1;
                }
            }
        }
        boards += 1;
    });

    Ok(Odds {
        holes: tally,
        boards,
    })
}

/// The result of [`percentages`]: how often the hole makes each hand type
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Percentages {
    /// The number of boards per hand type, in the order of [`HandType::ALL`]
    pub counts: [u32; 10],
    /// The number of ways to complete the board
    pub boards: u32,
}

impl Percentages {
    pub fn count(&self, hand_type: HandType) -> u32 {
        self.counts[hand_type as usize - 1]
    }

    pub fn percentage(&self, hand_type: HandType) -> f64 {
        self.count(hand_type) as f64 / self.boards as f64
    }
}

/// Counts which hand type the hole makes on every way to complete the board.
/// Dead cards (e.g. other players' holes) can't appear on the board.
pub fn percentages(hole: &[Card], board: &[Card], dead: &[Card]) -> Result<Percentages, Error> {
    check_hole(0, hole)?;
    check_board(board)?;
    let known = CardSet::of(&[hole, board].concat())?;
    let used = dead.iter().try_fold(known, |set, &card| set.with(card))?;

    let mut counts = [0; 10];
    let mut boards = 0;
    for_each_board(known, &used.remaining(), 5 - board.len(), |cards| {
        counts[HandType::of(rank_of(cards)) as usize - 1] += 1;
        boards += 1;
    });

    Ok(Percentages { counts, boards })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::card::parse_cards;

    fn cards(text: &str) -> Vec<Card> {
        parse_cards(text).unwrap()
    }

    fn holes(texts: &[&str]) -> Vec<Vec<Card>> {
        texts.iter().map(|text| cards(text)).collect()
    }

    fn counts(odds: &Odds) -> Vec<(u32, u32)> {
        odds.holes
            .iter()
            .map(|hole| (hole.wins, hole.ties))
            .collect()
    }

    #[test]
    fn pre_flop_odds_match_the_typescript_library() {
        let result = odds(&holes(&["AhAs", "KdKc"]), &[]).unwrap();
        assert_eq!(result.boards, 1_712_304);
        assert_eq!(counts(&result), [(1_388_072, 6_538), (317_694, 6_538)]);
    }

    #[test]
    fn three_way_ties_count_for_each_tied_hole() {
        // 42 rivers: 7-2 and 7-3 split a jack-high straight on 38, a queen (4)
        // gives As Ks the ace-high straight, and a seven (2) ties all three
        let result = odds(&holes(&["7h2c", "7d3s", "AsKs"]), &cards("8c9dTsJh")).unwrap();
        assert_eq!(result.boards, 42);
        assert_eq!(counts(&result), [(0, 38), (0, 38), (4, 2)]);
    }

    #[test]
    fn a_complete_board_is_one_board() {
        let result = odds(&holes(&["AsKd", "Ah9c"]), &cards("8c7d5h3s2c")).unwrap();
        assert_eq!(counts(&result), [(1, 0), (0, 0)]);
        assert_eq!(result.win_chance(0), 1.0);
    }

    #[test]
    fn a_single_hole_wins_every_board() {
        let result = odds(&holes(&["AhAs"]), &[]).unwrap();
        assert_eq!(result.boards, 2_118_760);
        assert_eq!(counts(&result), [(2_118_760, 0)]);
    }

    #[test]
    fn rejects_invalid_spots() {
        assert_eq!(odds(&[], &[]), Err(Error::NoHoles));
        assert_eq!(
            odds(&holes(&["AhAs", "Kd"]), &[]),
            Err(Error::HoleSize { hole: 1, cards: 1 })
        );
        assert_eq!(
            odds(&holes(&["AhAsAd", "KdKc"]), &[]),
            Err(Error::HoleSize { hole: 0, cards: 3 })
        );
        assert_eq!(
            odds(&holes(&["AhAs", "KdKc"]), &cards("2c3c4c5c6c7c")),
            Err(Error::BoardSize(6))
        );
        assert_eq!(
            odds(&holes(&["AhAs", "AhKc"]), &[]),
            Err(Error::DuplicateCard("Ah".into()))
        );
        assert_eq!(
            odds(&holes(&["AhAs", "KdKc"]), &cards("Kd2c3c")),
            Err(Error::DuplicateCard("Kd".into()))
        );
    }

    #[test]
    fn percentages_match_the_typescript_library() {
        let result = percentages(&cards("AhKh"), &cards("QhJh2c"), &[]).unwrap();
        assert_eq!(result.counts, [189, 315, 78, 13, 108, 332, 0, 0, 0, 46]);
        assert_eq!(result.boards, 1081);

        let pre_flop = percentages(&cards("AhKh"), &[], &[]).unwrap();
        assert_eq!(
            pre_flop.counts,
            [
                386_130, 916_776, 469_092, 92_004, 65_508, 138_296, 47_124, 2_668, 78, 1_084
            ]
        );
        assert_eq!(pre_flop.boards, 2_118_760);
    }

    #[test]
    fn dead_cards_are_left_out_of_the_boards() {
        let result = percentages(&cards("AhKh"), &cards("QhJh2c"), &cards("Th")).unwrap();
        // 46 remaining cards, and no royal flush without the ten of hearts
        assert_eq!(result.boards, 46 * 45 / 2);
        assert_eq!(result.count(HandType::RoyalFlush), 0);
        assert_eq!(
            percentages(&cards("AhKh"), &[], &cards("Ah")),
            Err(Error::DuplicateCard("Ah".into()))
        );
    }
}
