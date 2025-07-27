# WASM Integration Plan for Poker Hands Library in Rust

Based on the analysis of the current JavaScript/TypeScript codebase, the following WASM integration plan is proposed for the Rust implementation:

## 1. WASM Bindings with `wasm-bindgen`

- Use `wasm-bindgen` for generating JavaScript bindings from Rust code
- Define public APIs with `#[wasm_bindgen]` attributes
- Implement error handling with `Result` types

## 2. Cargo Configuration

- Configure `Cargo.toml` for WASM target:

  ```toml
  [lib]
  crate-type = ["cdylib"]

  [dependencies]
  wasm-bindgen = "0.2"
  ```

- Generate JS bindings with `wasm-bindgen --target web`

## 3. Memory-Safe Data Transfer

- Use `wasm-bindgen` types for safe data transfer between JS and WASM
- Implement serialization/deserialization for complex data structures
- Minimize memory allocations with stack-based data structures

## 4. Error Handling

- Convert Rust errors to JavaScript errors using `wasm-bindgen` macros
- Implement panic handling with `std::panic::catch_unwind`
- Provide meaningful error messages for FFI boundaries

## 5. Performance Optimization

- Use zero-copy data transfer where possible
- Implement bitwise operations for hand detection
- Apply SIMD operations to batch card evaluations

## 6. Testing Strategy

- Unit tests for individual components
- Integration tests for cross-language functionality
- Performance benchmarks for critical paths

## 7. Build Configuration

- Set up build scripts for generating JS bindings
- Implement CI/CD pipeline for automated testing and deployment

## 8. Example WASM Bindings

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn create_card(suit: &str, value: u8) -> Result<JsValue, JsValue> {
    let suit = match suit {
        "Hearts" => Suit::Hearts,
        "Diamonds" => Suit::Diamonds,
        "Clubs" => Suit::Clubs,
        "Spades" => Suit::Spades,
        _ => return Err(JsValue::from_str("Invalid suit")),
    };

    let card = Card {
        suit,
        value: Value(value),
    };

    Ok(JsValue::from_serde(&card).map_err(|e| JsValue::from_str(&e.to_string()))?)
}

#[wasm_bindgen]
pub fn evaluate_hand(cards: Vec<Card>) -> Result<JsValue, JsValue> {
    let hand = Hand::new(cards);
    let hand_type = hand.detect_hand_type();

    Ok(JsValue::from_serde(&hand_type).map_err(|e| JsValue::from_str(&e.to_string()))?)
}
```
