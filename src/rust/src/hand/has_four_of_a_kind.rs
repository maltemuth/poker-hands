use crate::hand::Hand;

impl Hand {
    pub fn has_four_of_a_kind(&self) -> bool {
        let mut value_counts = std::collections::HashMap::new();

        for card in &self.cards() {
            let value = card.value();
            *value_counts.entry(value).or_insert(0) += 1;
            if *value_counts.get(&value).unwrap() >= 4 {
                return true;
            }
        }
        false
    }
}
