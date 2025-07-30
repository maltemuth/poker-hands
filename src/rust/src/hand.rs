use crate::card::Card;
use crate::hand::hand_types::HandType;
use wasm_bindgen::prelude::*;

pub mod get_best_hand;
pub mod get_flush;
pub mod get_four_of_a_kind;
pub mod get_full_house;
pub mod get_kickers;
pub mod get_pair;
pub mod get_royal_flush;
pub mod get_straight;
pub mod get_straight_flush;
pub mod get_three_of_a_kind;
pub mod get_two_pair;
pub mod hand_types;
pub mod has_flush;
pub mod has_four_of_a_kind;
pub mod has_full_house;
pub mod has_pair;
pub mod has_royal_flush;
pub mod has_straight;
pub mod has_straight_flush;
pub mod has_three_of_a_kind;
pub mod has_two_pair;

#[wasm_bindgen]
pub struct Hand {
    cards: Vec<Card>,
}

#[wasm_bindgen]
pub struct HandResult {
    hand_type: HandType,
    cards: Vec<Card>,
    kickers: Vec<Card>,
}

#[wasm_bindgen]
impl HandResult {
    pub fn new(hand_type: HandType, cards: Vec<Card>, kickers: Vec<Card>) -> HandResult {
        HandResult {
            hand_type,
            cards,
            kickers,
        }
    }

    pub fn hand_type(&self) -> HandType {
        self.hand_type
    }

    pub fn cards(&self) -> Vec<Card> {
        self.cards.clone()
    }

    pub fn kickers(&self) -> Vec<Card> {
        self.kickers.clone()
    }

    pub fn len(&self) -> usize {
        self.cards.len()
    }

    pub fn is_empty(&self) -> bool {
        self.cards.is_empty()
    }
}

#[wasm_bindgen]
impl Hand {
    pub fn new(cards: Vec<Card>) -> Hand {
        Hand { cards }
    }

    pub fn cards(&self) -> Vec<Card> {
        self.cards.clone()
    }
}
