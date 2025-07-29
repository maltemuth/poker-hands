use crate::card::Card;
use wasm_bindgen::prelude::*;

pub mod get_flush;
pub mod get_four_of_a_kind;
pub mod get_full_house;
pub mod get_straight;
pub mod get_straight_flush;
pub mod get_three_of_a_kind;
pub mod has_flush;
pub mod has_four_of_a_kind;
pub mod has_full_house;
pub mod has_straight;
pub mod has_straight_flush;
pub mod has_three_of_a_kind;

#[wasm_bindgen]
pub struct Hand {
    cards: Vec<Card>,
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
