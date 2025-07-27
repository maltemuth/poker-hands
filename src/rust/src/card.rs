use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

/// Represents a suit of a card
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Suit {
    Hearts = "h",
    Diamonds = "d",
    Clubs = "c",
    Spades = "s",
}

/// Represents a value of a card
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub enum Value {
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9,
    Ten = 10,
    Jack = 11,
    Queen = 12,
    King = 13,
    Ace = 14,
}

/// Represents a value of a card as a string
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ValueAsString {
    Two = "2",
    Three = "3",
    Four = "4",
    Five = "5",
    Six = "6",
    Seven = "7",
    Eight = "8",
    Nine = "9",
    Ten = "T",
    Jack = "J",
    Queen = "Q",
    King = "K",
    Ace = "A",
}

/// Represents a playing card
#[wasm_bindgen]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Card {
    suit: Suit,
    value: Value,
}

#[wasm_bindgen]
impl Card {
    /// Creates a new card
    pub fn new(suit: Suit, value: Value) -> Card {
        Card { suit, value }
    }

    /// Gets the suit of the card
    pub fn suit(&self) -> Suit {
        self.suit
    }

    /// Gets the value of the card
    pub fn value(&self) -> Value {
        self.value
    }

    /// Creates a card from a string representation
    pub fn from_str(s: &str) -> Result<Card, String> {
        if s.len() != 2 {
            return Err(format!("Invalid card string: {}", s));
        }

        let suit_char = s
            .chars()
            .nth(1)
            .ok_or_else(|| format!("Invalid card string: {}", s))?;
        let value_str = s
            .chars()
            .nth(0)
            .ok_or_else(|| format!("Invalid card string: {}", s))?;

        // Check if the suit is valid
        let suit = match suit_char {
            'h' => Suit::Hearts,
            'd' => Suit::Diamonds,
            'c' => Suit::Clubs,
            's' => Suit::Spades,
            _ => return Err(format!("Invalid suit: {}", suit_char)),
        };

        // Check if the value is valid
        let value = match value_str {
            '2' => Value::Two,
            '3' => Value::Three,
            '4' => Value::Four,
            '5' => Value::Five,
            '6' => Value::Six,
            '7' => Value::Seven,
            '8' => Value::Eight,
            '9' => Value::Nine,
            'T' => Value::Ten,
            'J' => Value::Jack,
            'Q' => Value::Queen,
            'K' => Value::King,
            'A' => Value::Ace,
            _ => return Err(format!("Invalid value: {}", value_str)),
        };

        Ok(Card { suit, value })
    }

    /// Returns a string representation of the card
    pub fn to_string(&self) -> String {
        // Get the value as a string
        let value_str = match self.value {
            Value::Two => "2",
            Value::Three => "3",
            Value::Four => "4",
            Value::Five => "5",
            Value::Six => "6",
            Value::Seven => "7",
            Value::Eight => "8",
            Value::Nine => "9",
            Value::Ten => "T",
            Value::Jack => "J",
            Value::Queen => "Q",
            Value::King => "K",
            Value::Ace => "A",
        };

        // Get the suit as a string
        let suit_str = match self.suit {
            Suit::Hearts => "h",
            Suit::Diamonds => "d",
            Suit::Clubs => "c",
            Suit::Spades => "s",
            _ => "?",
        };

        format!("{}{}", value_str, suit_str)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_card_creation() {
        let card = Card::new(Suit::Spades, Value::Ace);
        assert_eq!(card.suit(), Suit::Spades);
        assert_eq!(card.value(), Value::Ace);
    }

    #[test]
    fn test_card_from_str() {
        let card = Card::from_str("As").unwrap();
        assert_eq!(card.suit(), Suit::Spades);
        assert_eq!(card.value(), Value::Ace);
    }

    #[test]
    fn test_card_from_str_hearts() {
        let card = Card::from_str("Ah").unwrap();
        assert_eq!(card.suit(), Suit::Hearts);
        assert_eq!(card.value(), Value::Ace);
    }

    #[test]
    fn test_card_to_string() {
        let card = Card::new(Suit::Spades, Value::King);
        assert_eq!(card.to_string(), "Ks");
    }
}
