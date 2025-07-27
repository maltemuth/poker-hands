use super::*;

#[test]
fn test_ace_of_hearts_to_string() {
    let card = Card::new(Suit::Hearts, Value::Ace);
    assert_eq!(card.to_string(), "Ah");
}

#[test]
fn test_card_from_str_ace_of_hearts() {
    let card = Card::from_str("Ah").unwrap();
    assert_eq!(card.suit(), Suit::Hearts);
    assert_eq!(card.value(), Value::Ace);
}
