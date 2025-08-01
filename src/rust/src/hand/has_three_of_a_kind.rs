use crate::hand::Hand;

impl Hand {
    pub fn has_three_of_a_kind(&self) -> bool {
        let mut value_counts = std::collections::HashMap::new();

        for card in &self.cards() {
            let value = card.value();
            *value_counts.entry(value).or_insert(0) += 1;
        }

        for count in value_counts.values() {
            if *count >= 3 {
                return true;
            }
        }

        false
    }
}
