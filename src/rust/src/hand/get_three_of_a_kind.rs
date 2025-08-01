use crate::hand::hand_types::HandType;
use crate::hand::{Hand, HandResult};

impl Hand {
    pub fn get_three_of_a_kind(&self) -> HandResult {
        let mut value_counts = std::collections::HashMap::new();

        for card in &self.cards() {
            let value = card.value();
            *value_counts.entry(value).or_insert(0) += 1;
        }

        for (value, count) in &value_counts {
            if *count >= 3 {
                let mut three_of_a_kind = Vec::new();

                for card in &self.cards() {
                    if card.value() == *value {
                        three_of_a_kind.push(card.clone());
                        if three_of_a_kind.len() == 3 {
                            break;
                        }
                    }
                }

                let kickers = self.get_kickers(HandType::ThreeOfAKind);
                return HandResult::new(HandType::ThreeOfAKind, three_of_a_kind, kickers);
            }
        }

        // If no three of a kind is found, return an empty HandResult
        HandResult::new(HandType::HighCard, Vec::new(), Vec::new())
    }
}
