// Remove this line if it's not needed elsewhere in the file
use std::fmt;
use std::str::FromStr;

#[derive(Debug, PartialEq, Eq, Hash, Copy, Clone, PartialOrd, Ord)]
pub enum Suit {
    Hearts,
    Diamonds,
    Clubs,
    Spades,
}

impl fmt::Display for Suit {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "{}",
            match self {
                Suit::Hearts => "h",
                Suit::Diamonds => "d",
                Suit::Clubs => "c",
                Suit::Spades => "s",
            }
        )
    }
}

impl FromStr for Suit {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "h" => Ok(Suit::Hearts),
            "d" => Ok(Suit::Diamonds),
            "c" => Ok(Suit::Clubs),
            "s" => Ok(Suit::Spades),
            _ => Err(format!("Invalid suit: {}", s)),
        }
    }
}

#[derive(Debug, PartialEq, Eq, Hash, Copy, Clone)]
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

impl fmt::Display for Value {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "{}",
            match self {
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
            }
        )
    }
}

impl FromStr for Value {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "2" => Ok(Value::Two),
            "3" => Ok(Value::Three),
            "4" => Ok(Value::Four),
            "5" => Ok(Value::Five),
            "6" => Ok(Value::Six),
            "7" => Ok(Value::Seven),
            "8" => Ok(Value::Eight),
            "9" => Ok(Value::Nine),
            "T" => Ok(Value::Ten),
            "J" => Ok(Value::Jack),
            "Q" => Ok(Value::Queen),
            "K" => Ok(Value::King),
            "A" => Ok(Value::Ace),
            _ => Err(format!("Invalid value: {}", s)),
        }
    }
}

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
pub struct Card {
    pub suit: Suit,
    pub value: Value,
}

impl Card {
    pub fn sorted_suits(cards: &[Card]) -> Vec<Suit> {
        let mut suits: Vec<Suit> = cards.iter().map(|card| card.suit).collect();
        suits.sort_unstable_by_key(|suit| *suit);
        suits
    }

    pub fn sorted_values(cards: &[Card]) -> Vec<i32> {
        let mut values: Vec<i32> = cards.iter().map(|card| card.value as i32).collect();
        values.sort_unstable();
        values
    }
}
