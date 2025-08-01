use crate::hand::Hand;

impl Hand {
    pub fn has_two_pair(&self) -> bool {
        let mut value_counts = std::collections::HashMap::new();

        for card in &self.cards() {
            let value = card.value();
            *value_counts.entry(value).or_insert(0) += 1;
        }

        let mut pair_count = 0;

        for count in value_counts.values() {
            if *count >= 2 {
                pair_count += 1;
                if pair_count >= 2 {
                    return true;
                }
            }
        }

        false
    }
}
