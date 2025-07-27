use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

/// Represents a suit of a card
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Suit {
    hearts = "h",
    diamonds = "d",
    clubs = "c",
    spades = "s",
}

/// Represents a value of a card
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub enum Value {
    two = 2,
    three = 3,
    four = 4,
    five = 5,
    six = 6,
    seven = 7,
    eight = 8,
    nine = 9,
    ten = 10,
    jack = 11,
    queen = 12,
    king = 13,
    ace = 14,
}

/// Represents a value of a card as a string
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ValueAsString {
    two = "2",
    three = "3",
    four = "4",
    five = "5",
    six = "6",
    seven = "7",
    eight = "8",
    nine = "9",
    ten = "T",
    jack = "J",
    queen = "Q",
    king = "K",
    ace = "A",
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
            'h' => Suit::hearts,
            'd' => Suit::diamonds,
            'c' => Suit::clubs,
            's' => Suit::spades,
            _ => return Err(format!("Invalid suit: {}", suit_char)),
        };

        // Check if the value is valid
        let value = match value_str {
            '2' => Value::two,
            '3' => Value::three,
            '4' => Value::four,
            '5' => Value::five,
            '6' => Value::six,
            '7' => Value::seven,
            '8' => Value::eight,
            '9' => Value::nine,
            'T' => Value::ten,
            'J' => Value::jack,
            'Q' => Value::queen,
            'K' => Value::king,
            'A' => Value::ace,
            _ => return Err(format!("Invalid value: {}", value_str)),
        };

        Ok(Card { suit, value })
    }

    /// Returns a string representation of the card
    pub fn to_string(&self) -> String {
        // Get the value as a string
        let value_str = match self.value {
            Value::two => "2",
            Value::three => "3",
            Value::four => "4",
            Value::five => "5",
            Value::six => "6",
            Value::seven => "7",
            Value::eight => "8",
            Value::nine => "9",
            Value::ten => "T",
            Value::jack => "J",
            Value::queen => "Q",
            Value::king => "K",
            Value::ace => "A",
        };

        // Get the suit as a string
        let suit_str = match self.suit {
            Suit::hearts => "h",
            Suit::diamonds => "d",
            Suit::clubs => "c",
            Suit::spades => "s",
        };

        format!("{}{}", value_str, suit_str)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_card_creation() {
        let card = Card::new(Suit::spades, Value::ace);
        assert_eq!(card.suit(), Suit::spades);
        assert_eq!(card.value(), Value::ace);
    }

    #[test]
    fn test_card_from_str() {
        let card = Card::from_str("As").unwrap();
        assert_eq!(card.suit(), Suit::spades);
        assert_eq!(card.value(), Value::ace);
    }

    #[test]
    fn test_card_to_string() {
        let card = Card::new(Suit::spades, Value::king);
        assert_eq!(card.to_string(), "Ks");
    }
}
