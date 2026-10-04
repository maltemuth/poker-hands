use std::fmt;
use std::str::FromStr;

use crate::error::Error;

const VALUES: &[u8; 13] = b"23456789TJQKA";
const SUITS: &[u8; 4] = b"hdcs";

/// A card: a value from 2 (two) to 14 (ace) and a suit from 0 to 3, in the
/// order hearts, diamonds, clubs, spades
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
pub struct Card {
    value: u8,
    suit: u8,
}

impl Card {
    pub const fn new(value: u8, suit: u8) -> Option<Card> {
        if value >= 2 && value <= 14 && suit < 4 {
            Some(Card { value, suit })
        } else {
            None
        }
    }

    pub const fn value(self) -> u8 {
        self.value
    }

    pub const fn suit(self) -> u8 {
        self.suit
    }

    /// The card's bit in a [`CardSet`]
    const fn bit(self) -> u64 {
        1 << (16 * self.suit as u32 + self.value as u32)
    }
}

impl FromStr for Card {
    type Err = Error;

    /// Parses a card like "Ah" or "Td"
    fn from_str(input: &str) -> Result<Card, Error> {
        let invalid = || Error::InvalidCard(input.to_string());
        let &[value, suit] = input.as_bytes() else {
            return Err(invalid());
        };
        let value = VALUES
            .iter()
            .position(|&v| v == value)
            .ok_or_else(invalid)?;
        let suit = SUITS.iter().position(|&s| s == suit).ok_or_else(invalid)?;
        Ok(Card {
            value: value as u8 + 2,
            suit: suit as u8,
        })
    }
}

impl fmt::Display for Card {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let value = VALUES[self.value as usize - 2] as char;
        let suit = SUITS[self.suit as usize] as char;
        write!(f, "{value}{suit}")
    }
}

/// Parses cards written one after another, optionally separated by
/// whitespace: "AhKd", "Ah Kd" and "" (no cards) are all valid.
pub fn parse_cards(input: &str) -> Result<Vec<Card>, Error> {
    let compact: String = input.split_whitespace().collect();
    if !compact.len().is_multiple_of(2) || !compact.is_ascii() {
        return Err(Error::InvalidCard(input.trim().to_string()));
    }
    (0..compact.len())
        .step_by(2)
        .map(|i| compact[i..i + 2].parse())
        .collect()
}

/// A set of cards as one number: bits 16 * suit + value. Each suit's 16 bits
/// are that suit's mask of values (bits 2-14), which is what hand ranking
/// works on, and adding cards to a set is a single OR.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub struct CardSet(pub(crate) u64);

impl CardSet {
    pub const EMPTY: CardSet = CardSet(0);

    /// The set of some cards, or the first card that appears twice
    pub fn of(cards: &[Card]) -> Result<CardSet, Error> {
        cards
            .iter()
            .try_fold(CardSet::EMPTY, |set, &card| set.with(card))
    }

    /// The set with one more card, or an error if it already has it
    pub fn with(self, card: Card) -> Result<CardSet, Error> {
        if self.contains(card) {
            Err(Error::DuplicateCard(card.to_string()))
        } else {
            Ok(CardSet(self.0 | card.bit()))
        }
    }

    pub const fn contains(self, card: Card) -> bool {
        self.0 & card.bit() != 0
    }

    pub const fn len(self) -> u32 {
        self.0.count_ones()
    }

    pub const fn is_empty(self) -> bool {
        self.0 == 0
    }

    /// All 52 cards that are not in this set
    pub fn remaining(self) -> Vec<Card> {
        (0..4)
            .flat_map(|suit| (2..=14).map(move |value| Card { value, suit }))
            .filter(|&card| !self.contains(card))
            .collect()
    }
}

impl From<Card> for CardSet {
    fn from(card: Card) -> CardSet {
        CardSet(card.bit())
    }
}

impl std::ops::BitOr for CardSet {
    type Output = CardSet;

    fn bitor(self, other: CardSet) -> CardSet {
        CardSet(self.0 | other.0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_and_prints_cards() {
        for text in ["2h", "Td", "Jc", "As"] {
            assert_eq!(text.parse::<Card>().unwrap().to_string(), text);
        }
        assert_eq!("Ah".parse::<Card>().unwrap(), Card::new(14, 0).unwrap());
    }

    #[test]
    fn rejects_invalid_cards() {
        for text in ["", "A", "1h", "Ax", "ah", "Ahh", "10h"] {
            assert_eq!(
                text.parse::<Card>(),
                Err(Error::InvalidCard(text.into())),
                "{text}"
            );
        }
    }

    #[test]
    fn parses_card_lists_with_or_without_spaces() {
        let expected: Vec<Card> = ["Ah", "Kd", "2c"].map(|c| c.parse().unwrap()).to_vec();
        assert_eq!(parse_cards("AhKd2c").unwrap(), expected);
        assert_eq!(parse_cards(" Ah Kd  2c ").unwrap(), expected);
        assert_eq!(parse_cards("").unwrap(), vec![]);
        assert!(parse_cards("AhK").is_err());
        assert!(parse_cards("AhXx").is_err());
    }

    #[test]
    fn card_sets_reject_duplicates() {
        let cards = parse_cards("AhKdAh").unwrap();
        assert_eq!(CardSet::of(&cards), Err(Error::DuplicateCard("Ah".into())));
    }

    #[test]
    fn remaining_cards_complete_the_deck() {
        let set = CardSet::of(&parse_cards("AhKd2c").unwrap()).unwrap();
        let rest = set.remaining();
        assert_eq!(rest.len(), 49);
        assert!(rest.iter().all(|&card| !set.contains(card)));
        assert_eq!(CardSet::EMPTY.remaining().len(), 52);
    }
}
