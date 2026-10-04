//! Ranking the best five-card hand of up to seven cards.
//!
//! A rank is a number that orders hands: a better hand has a higher rank, and
//! equally strong hands have the same rank. It is the hand type, followed by
//! the five values that decide between hands of that type, one hex digit
//! each, most important first: `0x7777dd` is sevens full of kings. This is the
//! same number the TypeScript library's `handRank` returns.

use crate::card::CardSet;

/// A hand's rank; see the module documentation
pub type Rank = u32;

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[repr(u8)]
pub enum HandType {
    HighCard = 1,
    Pair,
    TwoPair,
    ThreeOfAKind,
    Straight,
    Flush,
    FullHouse,
    FourOfAKind,
    StraightFlush,
    RoyalFlush,
}

impl HandType {
    pub const ALL: [HandType; 10] = [
        HandType::HighCard,
        HandType::Pair,
        HandType::TwoPair,
        HandType::ThreeOfAKind,
        HandType::Straight,
        HandType::Flush,
        HandType::FullHouse,
        HandType::FourOfAKind,
        HandType::StraightFlush,
        HandType::RoyalFlush,
    ];

    /// The type of the hand with this rank
    pub fn of(rank: Rank) -> HandType {
        HandType::ALL[(rank >> 20) as usize - 1]
    }
}

const ACE: u32 = 14;
const FIVE: u32 = 5;

/// The top card of the highest straight in a mask of values, or 0 if there
/// is none. The ace also counts as 1, for the wheel A-2-3-4-5.
const fn find_straight_top(mask: u32) -> u8 {
    let mask = if mask & (1 << ACE) != 0 {
        mask | 0b10
    } else {
        mask
    };
    let mut top = ACE;
    while top >= FIVE {
        let run = 0b11111 << (top - 4);
        if mask & run == run {
            return top as u8;
        }
        top -= 1;
    }
    0
}

/// The five highest values of a mask, one hex digit each, highest first;
/// filled up with 0 if the mask has fewer
const fn find_highest_five(mask: u32) -> u32 {
    let mut digits = 0;
    let mut count = 0;
    let mut value = ACE;
    while count < 5 && value >= 2 {
        if mask & (1 << value) != 0 {
            digits = (digits << 4) | value;
            count += 1;
        }
        value -= 1;
    }
    digits << (4 * (5 - count))
}

// Lookup tables over all masks of the values 2-14 (bits 2-14), indexed by
// mask >> 2. They are computed by the compiler, so ranking only reads them.
const TABLE_SIZE: usize = 1 << 13;

static STRAIGHT_TOP: [u8; TABLE_SIZE] = {
    let mut table = [0; TABLE_SIZE];
    let mut index = 0;
    while index < TABLE_SIZE {
        table[index] = find_straight_top((index as u32) << 2);
        index += 1;
    }
    table
};

static HIGHEST_FIVE: [u32; TABLE_SIZE] = {
    let mut table = [0; TABLE_SIZE];
    let mut index = 0;
    while index < TABLE_SIZE {
        table[index] = find_highest_five((index as u32) << 2);
        index += 1;
    }
    table
};

#[inline(always)]
fn straight_top(mask: u32) -> u32 {
    STRAIGHT_TOP[(mask >> 2) as usize] as u32
}

/// The highest value in a mask, or 0 if it is empty
#[inline(always)]
fn highest(mask: u32) -> u32 {
    if mask == 0 {
        0
    } else {
        31 - mask.leading_zeros()
    }
}

#[inline(always)]
fn bit(value: u32) -> u32 {
    1 << value
}

/// Appends a value to a rank `times` times, one hex digit each
#[inline(always)]
fn with_value(rank: u32, value: u32, times: u32) -> u32 {
    (0..times).fold(rank, |rank, _| (rank << 4) | value)
}

/// Appends the `count` (1 to 5) highest values of a mask to a rank
#[inline(always)]
fn with_highest(rank: u32, mask: u32, count: u32) -> u32 {
    (rank << (4 * count)) | (HIGHEST_FIVE[(mask >> 2) as usize] >> (4 * (5 - count)))
}

#[inline(always)]
fn straight_rank(hand_type: HandType, top: u32) -> u32 {
    (0..5).fold(hand_type as u32, |rank, i| (rank << 4) | (top - i))
}

/// The rank of the best five-card hand among the cards (up to seven; with
/// fewer than five, the missing kickers count as 0).
///
/// The hand types are checked from the best to the worst, and the first one
/// the cards make is the hand.
#[inline]
pub fn rank_of(cards: CardSet) -> Rank {
    let bits = cards.0;
    let h = (bits & 0xffff) as u32;
    let d = ((bits >> 16) & 0xffff) as u32;
    let c = ((bits >> 32) & 0xffff) as u32;
    let s = (bits >> 48) as u32;

    // Flush: five or more cards of one suit. With at most 7 cards, only one
    // suit can have five.
    let flush = if h.count_ones() >= 5 {
        h
    } else if d.count_ones() >= 5 {
        d
    } else if c.count_ones() >= 5 {
        c
    } else if s.count_ones() >= 5 {
        s
    } else {
        0
    };

    // Straight flush: it beats everything, so it is decided first
    if flush != 0 {
        match straight_top(flush) {
            ACE => return straight_rank(HandType::RoyalFlush, ACE),
            0 => {}
            top => return straight_rank(HandType::StraightFlush, top),
        }
    }

    // A value occurs at most once per suit, so how often it occurs is the
    // number of suit masks it is in
    let at_least_two = (h & d) | ((h | d) & (c | s)) | (c & s);
    let at_least_three = (h & d & (c | s)) | ((h | d) & c & s);
    let quads = highest(h & d & c & s);
    let all = h | d | c | s;

    // Four of a kind, with the highest other value as the kicker
    if quads != 0 {
        let rank = with_value(HandType::FourOfAKind as u32, quads, 4);
        return with_highest(rank, all & !bit(quads), 1);
    }

    // Full house: the highest trips, and as the pair the highest other value
    // that occurs at least twice (a pair or a second set of trips)
    let trips = highest(at_least_three);
    let full_house_pair = highest(at_least_two & !bit(trips));
    if trips != 0 && full_house_pair != 0 {
        let rank = with_value(HandType::FullHouse as u32, trips, 3);
        return with_value(rank, full_house_pair, 2);
    }

    // Flush: the five highest values of the flush suit
    if flush != 0 {
        return with_highest(HandType::Flush as u32, flush, 5);
    }

    // Straight: five values in a row in any suits
    let top = straight_top(all);
    if top != 0 {
        return straight_rank(HandType::Straight, top);
    }

    // Three of a kind, with the two highest other values as kickers
    if trips != 0 {
        let rank = with_value(HandType::ThreeOfAKind as u32, trips, 3);
        return with_highest(rank, all & !bit(trips), 2);
    }

    // Two pair, with the highest other value as the kicker (which can be a
    // card of a third pair)
    let pair = highest(at_least_two);
    let lower_pair = highest(at_least_two & !bit(pair));
    if pair != 0 && lower_pair != 0 {
        let rank = with_value(with_value(HandType::TwoPair as u32, pair, 2), lower_pair, 2);
        return with_highest(rank, all & !bit(pair) & !bit(lower_pair), 1);
    }

    // Pair, with the three highest other values as kickers
    if pair != 0 {
        let rank = with_value(HandType::Pair as u32, pair, 2);
        return with_highest(rank, all & !bit(pair), 3);
    }

    with_highest(HandType::HighCard as u32, all, 5)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::card::parse_cards;

    fn rank(cards: &str) -> Rank {
        rank_of(CardSet::of(&parse_cards(cards).unwrap()).unwrap())
    }

    #[test]
    fn ranks_like_the_typescript_library() {
        // values from handRank(getBestHand(...)) of the TypeScript library
        for (cards, expected) in [
            ("AhKhQhJhTh2c3d", 0xaedcba),
            ("Ah2d3c4s5h9cKd", 0x554321),
            ("2c2d5h5s9cJdKh", 0x35522d),
            ("7c7d7hKsKd2c3c", 0x7777dd),
            ("5h4h3h2hAh9c9d", 0x954321),
            ("AsKdQc9h7s4d2c", 0x1edc97),
        ] {
            assert_eq!(rank(cards), expected, "{cards}");
        }
    }

    #[test]
    fn orders_the_hand_types() {
        let hands = [
            "AsKdQc9h7s", // high card
            "2s2dQc9h7s", // pair
            "2s2d3c3h7s", // two pair
            "2s2d2c9h7s", // three of a kind
            "Ah2d3c4s5h", // straight, the wheel
            "6h2d3c4s5h", // straight, six high
            "2h4h6h8hTh", // flush
            "2s2d2c3h3s", // full house
            "2s2d2c2hAs", // four of a kind
            "Ah2h3h4h5h", // straight flush, the steel wheel
            "9hThJhQhKh", // straight flush, king high
            "AhKhQhJhTh", // royal flush
        ];
        for pair in hands.windows(2) {
            assert!(rank(pair[0]) < rank(pair[1]), "{} < {}", pair[0], pair[1]);
        }
        assert_eq!(HandType::of(rank("AhKhQhJhTh")), HandType::RoyalFlush);
        assert_eq!(HandType::of(rank("Ah2h3h4h5h")), HandType::StraightFlush);
    }

    #[test]
    fn uses_the_best_five_of_seven() {
        // the sixth and seventh best values don't count
        assert_eq!(rank("AsKdQc9h7s4d2c"), rank("AsKdQc9h7s3d2c"));
        // a third pair only counts as a kicker
        assert_eq!(rank("AsAdKcKh2s2dQc"), rank("AsAdKcKh3s4dQc"));
        // two trips make a full house with the higher trips
        assert_eq!(rank("9s9d9c5h5s5d2c"), rank("9s9d9c5h5s3d2c"));
    }

    #[test]
    fn suits_do_not_matter_for_equal_hands() {
        assert_eq!(rank("AhKdQc9s7h"), rank("AsKcQd9h7c"));
        assert_eq!(rank("2h4h6h8hTh"), rank("2s4s6s8sTs"));
    }
}
