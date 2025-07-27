use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

/// Represents a suit of a card
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Suit {
    Hearts,
    Diamonds,
    Clubs,
    Spades,
}

/// Represents a value of a card
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub enum Value {
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King,
    Ace,
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
        let parts: Vec<&str> = s.split_whitespace().collect();
        if parts.len() != 2 {
            return Err(format!("Invalid card string: {}", s));
        }

        let suit = match parts[1] {
            "Hearts" => Suit::Hearts,
            "Diamonds" => Suit::Diamonds,
            "Clubs" => Suit::Clubs,
            "Spades" => Suit::Spades,
            _ => return Err(format!("Invalid suit: {}", parts[1])),
        };

        let value = match parts[0] {
            "2" => Value::Two,
            "3" => Value::Three,
            "4" => Value::Four,
            "5" => Value::Five,
            "6" => Value::Six,
            "7" => Value::Seven,
            "8" => Value::Eight,
            "9" => Value::Nine,
            "10" => Value::Ten,
            "Jack" => Value::Jack,
            "Queen" => Value::Queen,
            "King" => Value::King,
            "Ace" => Value::Ace,
            _ => return Err(format!("Invalid value: {}", parts[0])),
        };

        Ok(Card { suit, value })
    }

    /// Returns a string representation of the card
    pub fn to_string(&self) -> String {
        format!("{:?} of {:?}", self.value, self.suit)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_card_creation() {
        let card = Card::new(Suit::Hearts, Value::Ace);
        assert_eq!(card.suit(), Suit::Hearts);
        assert_eq!(card.value(), Value::Ace);
    }

    #[test]
    fn test_card_from_str() {
        let card = Card::from_str("Ace Hearts").unwrap();
        assert_eq!(card.suit(), Suit::Hearts);
        assert_eq!(card.value(), Value::Ace);
    }

    #[test]
    fn test_card_to_string() {
        let card = Card::new(Suit::Spades, Value::King);
        assert_eq!(card.to_string(), "King of Spades");
    }
}
