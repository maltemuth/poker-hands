use std::fmt;

/// Why a calculation was rejected
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Error {
    /// A card that isn't a value (2-9, T, J, Q, K, A) followed by a suit (h, d, c, s)
    InvalidCard(String),
    /// A card that appears more than once among the holes, board and dead cards
    DuplicateCard(String),
    /// A hole with other than two cards
    HoleSize { hole: usize, cards: usize },
    /// A board with more than five cards
    BoardSize(usize),
    /// Odds need at least one hole
    NoHoles,
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Error::InvalidCard(card) => write!(f, "Invalid card: {card:?}"),
            Error::DuplicateCard(card) => write!(f, "Card used more than once: {card}"),
            Error::HoleSize { hole, cards } => {
                write!(f, "Hole {} must have 2 cards, but has {cards}", hole + 1)
            }
            Error::BoardSize(cards) => {
                write!(f, "The board has {cards} cards, at most 5 are allowed")
            }
            Error::NoHoles => write!(f, "At least one hole is needed"),
        }
    }
}

impl std::error::Error for Error {}
