# Data Structures for Poker Hands Library in Rust

Based on the analysis of the current JavaScript/TypeScript codebase, the following data structures are proposed for the Rust/WASM implementation:

## 1. Card Data Structure

```rust
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Card {
    pub suit: Suit,
    pub value: Value,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Suit {
    Hearts,
    Diamonds,
    Clubs,
    Spades,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord)]
pub struct Value(pub u8); // 2-14 for Ace
```

## 2. Hand Data Structure

```rust
#[derive(Debug, Clone)]
pub struct Hand {
    pub cards: Vec<Card>,
    pub hand_type: Option<HandType>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum HandType {
    HighCard,
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
```

## 3. Deck Data Structure

```rust
#[derive(Debug, Clone)]
pub struct Deck {
    pub cards: Vec<Card>,
}
```

## 4. Combinatorics Utilities

```rust
pub mod combinatorics {
    pub fn combinations<T: Clone>(items: &[T], k: usize) -> Vec<Vec<T>> {
        // Implementation of combination generator
    }

    pub fn permutations<T: Clone>(items: &[T]) -> Vec<Vec<T>> {
        // Implementation of permutation generator
    }
}
```

## 5. Odds Calculation

```rust
pub mod odds {
    pub fn calculate_win_probability(hand: &Hand, community_cards: &[Card]) -> f64 {
        // Implementation of odds calculation
    }

    pub fn calculate_tie_probability(hand: &Hand, community_cards: &[Card]) -> f64 {
        // Implementation of tie probability calculation
    }
}
```

## 6. Error Handling

```rust
#[derive(Debug)]
pub enum PokerError {
    InvalidCard(String),
    InvalidHand(String),
    // Other error variants
}

pub type Result<T> = std::result::Result<T, PokerError>;
```

## 7. WASM Bindings

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn create_card(suit: &str, value: u8) -> JsValue {
    // Implementation of card creation with WASM bindings
}

#[wasm_bindgen]
pub fn evaluate_hand(cards: &[Card]) -> JsValue {
    // Implementation of hand evaluation with WASM bindings
}
```
