use crate::hand::Hand;

impl Hand {
    pub fn has_full_house(&self) -> bool {
        let mut value_counts = std::collections::HashMap::new();

        for card in &self.cards() {
            let value = card.value();
            *value_counts.entry(value).or_insert(0) += 1;
        }

        let mut sorted_values: Vec<_> = value_counts.iter().collect();
        sorted_values.sort_by(|a, b| b.1.cmp(a.1));

        if sorted_values.len() < 2 {
            return false;
        }

        // Check for 3 of a kind and 2 of a kind
        if *sorted_values[0].1 >= 3 && *sorted_values[1].1 >= 2 {
            return true;
        }

        false
    }
}
