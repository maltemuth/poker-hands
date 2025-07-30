use crate::card::Card;
use crate::hand::hand_types::HandType;
use crate::hand::Hand;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn get_kickers(&self, hand_type: HandType) -> Vec<Card> {
        let mut cards = self.cards();
        cards.sort_by(|a, b| b.value().cmp(&a.value()));

        match hand_type {
            HandType::HighCard => cards,
            HandType::Pair => cards.iter().skip(2).cloned().collect(),
            HandType::TwoPair => cards.iter().skip(4).cloned().collect(),
            HandType::ThreeOfAKind => cards.iter().skip(3).cloned().collect(),
            HandType::Straight => cards.iter().skip(4).cloned().collect(),
            HandType::Flush => cards.iter().skip(4).cloned().collect(),
            HandType::FullHouse => cards.iter().skip(3).cloned().collect(),
            HandType::FourOfAKind => cards.iter().skip(1).cloned().collect(),
            HandType::StraightFlush => cards.iter().skip(4).cloned().collect(),
            HandType::RoyalFlush => vec![],
        }
    }
}
