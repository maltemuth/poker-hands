use crate::card::Card;
use wasm_bindgen::prelude::*;

pub mod get_flush;
pub mod get_straight;
pub mod has_flush;
pub mod has_straight;

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
