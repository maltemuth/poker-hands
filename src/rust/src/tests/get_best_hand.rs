use crate::card::Card;
use crate::hand::Hand;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_best_hand() {
        let cards = vec![
            Card::from_str("Ah"),
            Card::from_str("Kh"),
            Card::from_str("Qh"),
            Card::from_str("Jh"),
            Card::from_str("Th"),
        ];
        let hand = Hand::new(cards.into_iter().map(|c| c.unwrap()).collect());

        let best_hand = hand.get_best_hand();
        assert_eq!(best_hand.cards().len(), 5);
        assert_eq!(best_hand.cards()[0].value(), crate::card::Value::Ace);
    }
}
